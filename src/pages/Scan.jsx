// src/pages/Scan.jsx
import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/sidebar';

export default function Scan() {
  const videoRef = useRef(null);
  const [detectedLetter, setDetectedLetter] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [handPosition, setHandPosition] = useState(null);
  const [isHandDetected, setIsHandDetected] = useState(false);
  const streamRef = useRef(null);
  const handsRef = useRef(null);
  const rafRef = useRef(null);

  // Fungsi untuk konversi BGR ke RGB
  const preprocessCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    
    // Konversi BGR ke RGB (swap R dan B)
    for (let i = 0; i < data.length; i += 4) {
      const temp = data[i];      // R
      data[i] = data[i + 2];     // B → R
      data[i + 2] = temp;        // R → B
    }
    
    // Buat canvas baru untuk hasil RGB
    const rgbCanvas = document.createElement('canvas');
    rgbCanvas.width = canvas.width;
    rgbCanvas.height = canvas.height;
    const rgbCtx = rgbCanvas.getContext('2d');
    rgbCtx.putImageData(imgData, 0, 0);
    
    return rgbCanvas;
  };

  // DETEKSI ML REALTIME
  useEffect(() => {
    if (!isHandDetected || !isCameraActive || !handPosition) return;

    const detectLetter = async () => {
      try {
        const video = videoRef.current;
        if (!video || video.readyState !== 4) return;

        const canvas = document.createElement('canvas');
        const size = 96;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const handSize = 180;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        const cropX = (handPosition.x / 100) * videoWidth - handSize / 2;
        const cropY = (handPosition.y / 100) * videoHeight - handSize / 2;

        ctx.drawImage(
          video,
          Math.max(0, cropX),
          Math.max(0, cropY),
          Math.min(handSize, videoWidth - Math.max(0, cropX)),
          Math.min(handSize, videoHeight - Math.max(0, cropY)),
          0,
          0,
          size,
          size
        );

        // Konversi BGR ke RGB
        const rgbCanvas = preprocessCanvas(canvas);

        const blob = await new Promise(resolve => rgbCanvas.toBlob(resolve, 'image/png'));
        const formData = new FormData();
        formData.append('image', blob, 'hand.png');

        const response = await fetch('http://localhost:5000/api/ml/detect', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) return;

        const result = await response.json();
        if (result.success && result.letter && !['del', 'nothing', 'space'].includes(result.letter)) {
          setDetectedLetter(result.letter);
        } else {
          setDetectedLetter('');
        }
      } catch (error) {
        console.error('Error deteksi ML:', error);
        setDetectedLetter('');
      }
    };

    const interval = setInterval(detectLetter, 800);
    return () => clearInterval(interval);
  }, [isHandDetected, isCameraActive, handPosition]);

  // Load MediaPipe
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.js';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Start camera dan hand detection
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
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults((results) => {
      if (results.multiHandLandmarks?.[0]) {
        const hand = results.multiHandLandmarks[0];
        const wrist = hand[0];
        
        const x = (1 - wrist.x) * 100;
        const y = (wrist.y * 100) - 15;
        
        setHandPosition({ x, y });
        setIsHandDetected(true);
        console.log("✅ HAND POSITION SET:", { x, y });
      } else {
        setIsHandDetected(false);
        setHandPosition(null);
        console.log("❌ NO HAND DETECTED");
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

  // Stop camera
  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (handsRef.current) handsRef.current.close();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setIsCameraActive(false);
    setHandPosition(null);
    setIsHandDetected(false);
    setDetectedLetter('');
  };

  useEffect(() => () => stopCamera(), []);

  // Manual detection
  const manualDetect = async () => {
    if (!handPosition || !isHandDetected) {
      alert('Pastikan tangan terdeteksi!');
      return;
    }

    try {
      const video = videoRef.current;
      if (!video || video.readyState !== 4) return;

      const canvas = document.createElement('canvas');
      const size = 96;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      const handSize = 180;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      const cropX = (handPosition.x / 100) * videoWidth - handSize / 2;
      const cropY = (handPosition.y / 100) * videoHeight - handSize / 2;

      ctx.drawImage(
        video,
        Math.max(0, cropX),
        Math.max(0, cropY),
        Math.min(handSize, videoWidth - Math.max(0, cropX)),
        Math.min(handSize, videoHeight - Math.max(0, cropY)),
        0,
        0,
        size,
        size
      );

      // Konversi BGR ke RGB
      const rgbCanvas = preprocessCanvas(canvas);

      const blob = await new Promise(resolve => rgbCanvas.toBlob(resolve, 'image/png'));
      const formData = new FormData();
      formData.append('image', blob, 'hand.png');

      const response = await fetch('http://localhost:5000/api/ml/detect', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log("📦 MANUAL RESULT:", result);

      if (result.success && result.letter && !['del', 'nothing', 'space'].includes(result.letter)) {
        setDetectedLetter(result.letter);
      } else {
        setDetectedLetter('');
      }
    } catch (error) {
      console.error('🔥 MANUAL ERROR:', error);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-[1000px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Scan Gerakan Tangan</h1>
          <p className="text-gray-600 mb-6">
            Tunjukkan tangan Anda ke kamera. Kotak hijau akan mengikuti gerakan tangan secara realtime.
          </p>

          <div className={`border-l-4 p-4 mb-6 rounded ${
            isHandDetected 
              ? 'bg-green-100 border-green-500 text-green-700' 
              : 'bg-yellow-100 border-yellow-500 text-yellow-700'
          }`}>
            {isCameraActive 
              ? (isHandDetected ? '✅ Tangan terdeteksi!' : '👋 Tunjukkan tangan Anda')
              : '📹 Aktifkan kamera untuk memulai'}
          </div>

          <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6 shadow-2xl max-w-3xl mx-auto">
            <div className="aspect-video relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
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
                  {handPosition && isHandDetected && (
                    <div 
                      className="absolute border-4 border-green-400 rounded-xl pointer-events-none shadow-lg shadow-green-500/50"
                      style={{
                        left: `${handPosition.x}%`,
                        top: `${handPosition.y}%`,
                        width: '180px',
                        height: '180px',
                        transform: 'translate(-50%, -50%)',
                        transition: 'all 0.1s ease-out'
                      }}
                    >
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-400 rounded-full"></div>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full"></div>
                      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full"></div>
                      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-400 rounded-full"></div>
                      
                      {detectedLetter && (
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2">
                          <div className="bg-green-500 text-white px-6 py-3 rounded-xl font-black text-3xl shadow-xl whitespace-nowrap">
                            {detectedLetter}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
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
                <button onClick={() => setDetectedLetter('')} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-semibold">
                  🔄 Reset
                </button>
                <button onClick={stopCamera} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">
                  ⏹️ Matikan
                </button>
                <button onClick={manualDetect} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                  🧪 Deteksi Sekarang
                </button>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex gap-3">
              <div className="text-2xl">🤖</div>
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Hand Tracking Realtime</p>
                <p>Menggunakan MediaPipe untuk deteksi tangan. Kotak hijau akan mengikuti posisi tangan Anda secara realtime!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}