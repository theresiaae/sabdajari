import { useEffect, useRef } from "react";

export default function Camera({ showDetectionBox = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Gagal membuka kamera:", err);
        alert("Kamera tidak bisa diakses. Periksa izin browser.");
      }
    }

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="border rounded-lg p-2 bg-gray-100 w-96 relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full rounded-md"
        style={{ transform: 'scaleX(-1)' }}
      ></video>
      
      {showDetectionBox && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2">
          <div className="border-4 border-green-500 rounded-lg w-3/4 h-3/4"></div>
        </div>
      )}
      
      <p className="text-center mt-2 text-sm text-gray-700">
        Kamera Aktif
      </p>
    </div>
  );
}