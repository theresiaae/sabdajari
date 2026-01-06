// src/pages/Scan.jsx
import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/sidebar';

export default function Scan() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedLetter, setDetectedLetter] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isHandDetected, setIsHandDetected] = useState(false);
  const [currentLandmarks, setCurrentLandmarks] = useState(null);
  const [topPredictions, setTopPredictions] = useState([]);
  const streamRef = useRef(null);
  const handsRef = useRef(null);
  const rafRef = useRef(null);

  // DETEKSI ML REALTIME dengan LANDMARKS
  useEffect(() => {
    if (!isHandDetected || !isCameraActive || !currentLandmarks) return;

    const detectLetter = async () => {
      try {
        // Flatten landmarks ke array 63 nilai
        const landmarksArray = currentLandmarks.flatMap(lm => [lm.x, lm.y, lm.z || 0]);

        console.log('🚀 Sending landmarks:', landmarksArray.length, 'values');
        console.log('📊 Sample landmarks:', landmarksArray.slice(0, 9)); // First 3 points

        const response = await fetch('http://localhost:5000/api/ml/detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ landmarks: landmarksArray })
        });

        if (!response.ok) {
          console.error('❌ Response not OK:', response.status);
          return;
        }

        const result = await response.json();
        console.log('✅ ML Result:', result);

        if (result.success && result.letter) {
          // Filter special commands untuk display
          if (!['del', 'nothing', 'space'].includes(result.letter)) {
            setDetectedLetter(result.letter);
            setConfidence(result.confidence);
            setTopPredictions(result.top_3 || []);
          } else {
            // Show special commands but with different style
            setDetectedLetter(result.letter);
            setConfidence(result.confidence);
            setTopPredictions(result.top_3 || []);
          }
        } else {
          setDetectedLetter('');
          setConfidence(0);
        }
      } catch (error) {
        console.error('🔥 Error deteksi ML:', error);
        setDetectedLetter('');
        setConfidence(0);
      }
    };

    const interval = setInterval(detectLetter, 1000); // Deteksi tiap 1 detik
    return () => clearInterval(interval);
  }, [isHandDetected, isCameraActive, currentLandmarks]);

  // Load MediaPipe
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.js';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    const cameraUtilsScript = document.createElement('script');
    cameraUtilsScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
    cameraUtilsScript.crossOrigin = 'anonymous';
    document.head.appendChild(cameraUtilsScript);

    const drawingUtilsScript = document.createElement('script');
    drawingUtilsScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js';
    drawingUtilsScript.crossOrigin = 'anonymous';
    document.head.appendChild(drawingUtilsScript);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
      if (document.head.contains(cameraUtilsScript)) document.head.removeChild(cameraUtilsScript);
      if (document.head.contains(drawingUtilsScript)) document.head.removeChild(drawingUtilsScript);
    };
  }, []);

  // mengaktifkan kamera pengguna dan inisialisasi MediaPipe Hands untuk mendeteksi tangan
  // secara real-time.
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 } 
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setIsCameraActive(true);

      const checkMediaPipe = setInterval(() => {
        if (window.Hands) {
          clearInterval(checkMediaPipe);
          initHandDetection();
        }
      }, 100);
    } catch (err) {
      alert("Gagal akses kamera: " + err.message);
    }
  };

  // Initialize hand detection
  const initHandDetection = () => {
    const hands = new window.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

      // MediaPipe Hands digunakan untuk mendeteksi tangan dan mengambil 
      // 21 titik landmark yang mewakili posisi jari dan telapak tangan.
    
    hands.onResults((results) => {
      drawHandOnCanvas(results);
      
      if (results.multiHandLandmarks?.[0]) {
        const landmarks = results.multiHandLandmarks[0];
        setCurrentLandmarks(landmarks);
        setIsHandDetected(true);
        console.log("✅ Hand detected, landmarks saved");
      } else {
        setIsHandDetected(false);
        setCurrentLandmarks(null);
        setDetectedLetter('');
        console.log("❌ No hand detected");
      }
    });

    handsRef.current = hands;

    const detect = async () => {
      if (videoRef.current?.readyState === 4) {
        await hands.send({ image: videoRef.current });
      }
      rafRef.current = requestAnimationFrame(detect);
    };
    detect();
  };

  // Draw hand landmarks on canvas
  const drawHandOnCanvas = (results) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = results.image.width;
    canvas.height = results.image.height;

    // Clear canvas
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw hand landmarks
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        // Draw connections
        if (window.drawConnectors) {
          window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
            color: '#00FF00',
            lineWidth: 2
          });
        }
        
        // Draw landmarks
        if (window.drawLandmarks) {
          window.drawLandmarks(ctx, landmarks, {
            color: '#FF0000',
            lineWidth: 1,
            radius: 3
          });
        }
      }
    }
    ctx.restore();
  };

  // Stop camera
  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (handsRef.current) handsRef.current.close();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setIsCameraActive(false);
    setIsHandDetected(false);
    setCurrentLandmarks(null);
    setDetectedLetter('');
    setConfidence(0);
    setTopPredictions([]);
  };

  useEffect(() => () => stopCamera(), []);

  // Manual detection
  const manualDetect = async () => {
    if (!currentLandmarks || !isHandDetected) {
      alert('Pastikan tangan terdeteksi!');
      return;
    }

    try {

      //Pengiriman Landmark ke Backend Machine Learning
      //Landmark yang diperoleh kemudian diubah menjadi array numerik 
      // dan dikirim ke backend untuk diproses oleh model Machine Learning.

      const landmarksArray = currentLandmarks.flatMap(lm => [lm.x, lm.y, lm.z || 0]);

      console.log('🧪 Manual detection - landmarks:', landmarksArray.length);

      const response = await fetch('http://localhost:5000/api/ml/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landmarks: landmarksArray })
      });

      const result = await response.json();
      console.log("📦 Manual result:", result);

      if (result.success && result.letter) {
        setDetectedLetter(result.letter);
        setConfidence(result.confidence);
        setTopPredictions(result.top_3 || []);
      } else {
        alert('Tidak bisa mendeteksi huruf. Coba posisi tangan lain.');
      }
    } catch (error) {
      console.error('🔥 Manual error:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Scan Gerakan Tangan</h1>
          <p className="text-gray-600 mb-6">
            Sistem sekarang menggunakan <strong>MediaPipe Landmarks</strong> untuk deteksi yang lebih akurat!
          </p>

          <div className={`border-l-4 p-4 mb-6 rounded ${
            isHandDetected 
              ? 'bg-green-100 border-green-500 text-green-700' 
              : 'bg-yellow-100 border-yellow-500 text-yellow-700'
          }`}>
            {isCameraActive 
              ? (isHandDetected ? '✅ Tangan terdeteksi! Landmark aktif' : '👋 Tunjukkan tangan Anda')
              : '📹 Aktifkan kamera untuk memulai'}
          </div>

          <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6 shadow-2xl max-w-3xl mx-auto">
            <div className="aspect-video relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{ 
                  transform: 'scaleX(-1)',
                  display: isCameraActive ? 'block' : 'none'
                }}
              />
              
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ 
                  transform: 'scaleX(-1)',
                  display: isCameraActive ? 'block' : 'none'
                }}
              />
              
              {!isCameraActive ? (
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-6xl">🖐️</div>
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 text-white py-4 px-10 rounded-xl hover:bg-blue-700 font-bold text-lg shadow-lg"
                  >
                    Aktifkan Kamera
                  </button>
                </div>
              ) : (
                <>
                  {/* Menampilkan Hasil Prediksi pada Antarmuka
                    Hasil prediksi dari backend ditampilkan langsung 
                    di atas video kamera dalam bentuk overlay. */}
                  {detectedLetter && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 
                    -translate-y-1/2 pointer-events-none">
                      <div className={`${
                        ['del', 'nothing', 'space'].includes(detectedLetter)
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      } text-white px-8 py-4 rounded-2xl font-black text-5xl shadow-2xl`}>
                        {detectedLetter}
                        <div className="text-sm font-normal mt-1">
                          {(confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LANDMARK MODE
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                      isHandDetected ? 'bg-green-600 text-white' : 'bg-black/70 text-white'
                    }`}>
                      {isHandDetected ? '🖐️ Tracking' : '❌ No Hand'}
                    </div>
                  </div>
                </>
              )}
            </div>

            {isCameraActive && (
              <div className="bg-gray-800 p-4 flex justify-center gap-3">
                <button 
                  onClick={() => {
                    setDetectedLetter('');
                    setConfidence(0);
                    setTopPredictions([]);
                  }} 
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-semibold"
                >
                  🔄 Reset
                </button>
                <button 
                  onClick={stopCamera} 
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  ⏹️ Matikan
                </button>
                <button 
                  onClick={manualDetect} 
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  🧪 Deteksi Sekarang
                </button>
              </div>
            )}
          </div>

          {/* Top Predictions */}
          {topPredictions.length > 0 && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 max-w-3xl mx-auto">
              <h3 className="font-bold text-gray-800 mb-4">Top 3 Predictions:</h3>
              <div className="space-y-3">
                {topPredictions.map((pred, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-lg font-bold">{pred.label}</span>
                        <span className="text-sm text-gray-600">
                          {(pred.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pred.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex gap-3">
              <div className="text-2xl">🤖</div>
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">MediaPipe Landmarks + TensorFlow</p>
                <p>Sistem mengekstrak 21 titik koordinat tangan (63 nilai: x, y, z) dan mengirimnya ke backend untuk prediksi. Lebih akurat dan tidak tergantung background!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}