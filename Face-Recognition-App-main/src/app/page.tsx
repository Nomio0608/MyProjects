"use client";

import { useRef, useState, useEffect } from "react";
import { loadModels, detectFaceShape } from "../../lib/faceUtils";

export default function Home() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [faceShape, setFaceShape] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false); // Тайбар үзүүлэх төлөв
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const drawGuideFrame = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Текст
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.font = "16px Arial";
    ctx.fillText("Нүүрээ төвд байрлуулна уу", 60, 30);

    // Ногоон хүрээ
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 50, 100, 100);
  };

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    if (isCameraOpen && canvasRef.current) {
      drawGuideFrame(canvasRef.current);
    }
  }, [isCameraOpen]);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Камер нээхэд алдаа гарлаа:", error);
    }
  };

  const takePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 400, 300);
        const imageUrl = canvasRef.current.toDataURL("image/png");
        setPhoto(imageUrl);

        const shape = await detectFaceShape(videoRef.current, canvasRef.current);
        setFaceShape(shape);

        closeCamera();
      }
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  const reset = () => {
    setPhoto(null);
    setFaceShape(null);
    setIsCameraOpen(false);
    setShowInfo(false); // Тайбар зогсоох
  };

  const faceAnalysisResults: Record<string, any> = {
    round: {
      type: "Natural makeup",
      image: "/makeup-styles/natural.png",
      advice: "Та дугуй царайтай байна. Тиймээс илүү урт харагдуулахын тулд хацрын доод хэсэгт сүүдэр хэрэглээрэй.",
    },
    oval: {
      type: "Glam makeup",
      image: "/makeup-styles/oval.png",
      advice: "Зуйван царай нь бүх төрлийн будалтанд тохиромжтой. Гялалзсан өнгө таньд илүү тохирно.",
    },
    triangular: {
      type: "Glam makeup",
      image: "/makeup-styles/heart.png",
      advice: "Зүрхэн царай нь бүх төрлийн будалтанд тохиромжтой. Гялалзсан өнгө таньд тохирно.",
    },
    heart: {
      type: "Mineral Makeup",
      image: "/makeup-styles/triangular.png",
      advice: "Гурвалжин царай нь бүх төрлийн будалтанд тохиромжтой. Гялалзсан өнгө таньд тохирно.",
    },
    square: {
      type: "Dewy Glow Makeup",
      image: "/makeup-styles/square.png",
      advice: "Дөрвөлжин царайг зөөллөхийн тулд хацар, эрүүний булангийн хэсгийг гэрэлтүүлээрэй.",
    },
  };

  return (
    <div className="bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 min-h-screen p-8 text-center flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold text-white mb-10 drop-shadow-lg">NIRAN</h1>

      {!isCameraOpen && !photo && (
        <div className="flex flex-col gap-4">
          <button
            onClick={openCamera}
            className="bg-white text-pink-500 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-pink-50 transition-all transform hover:scale-105 duration-200"
          >
            📷 Камер нээх
          </button>
        </div>
      )}

      {isCameraOpen && (
        <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center gap-4 transition-all animate-fade-in transform scale-105">
          <div className="relative">
            <video ref={videoRef} autoPlay className="w-64 h-48 rounded-xl shadow-md" />
            <canvas
              ref={canvasRef}
              width="300"
              height="200"
              className="absolute top-0 left-0 w-64 h-48 pointer-events-none"
            />
          </div>
          <div className="flex gap-4 mt-2">
            <button
              onClick={takePhoto}
              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition transform hover:scale-105 duration-200"
            >
              📸 Зураг авах
            </button>
            <button
              onClick={closeCamera}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-400 transition transform hover:scale-105 duration-200"
            >
              ❌ Камер хаах
            </button>
          </div>
        </div>
      )}

      {photo && faceShape && (
        <div className="bg-white mt-6 p-6 rounded-3xl shadow-xl max-w-md w-full animate-fade-in transform scale-105">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">{faceAnalysisResults[faceShape].type}</h2>
          <img src={photo} alt="Captured" className="w-64 h-48 mx-auto rounded-xl shadow transform transition-all duration-500 hover:scale-105" />
          <img
            src={faceAnalysisResults[faceShape].image}
            alt="Recommended"
            className="w-64 h-48 mx-auto rounded-xl shadow mt-4 transform transition-all duration-500 hover:scale-105"
          />
          <p className="mt-4 text-sm text-gray-600">{faceAnalysisResults[faceShape].advice}</p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={reset}
              className="bg-pink-400 text-white px-6 py-2 rounded-full hover:bg-pink-500 transition-all transform hover:scale-105 duration-200"
            >
              🔁 Буцах
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="bg-white border border-pink-400 text-pink-500 px-6 py-2 rounded-full hover:bg-pink-100 transition-all transform hover:scale-105 duration-200"
            >
              🏠 Нүүр хуудас
            </button>
          </div>
        </div>
      )}

      {/* Тайбар гаргах */}
      {showInfo && !photo && (
        <div className="bg-yellow-100 p-4 mt-4 rounded-lg shadow-lg text-center text-gray-700">
          <p>Таны нүүрний хэлбэрийг танихад зориулж төвд байрлуулна уу.</p>
        </div>
      )}
    </div>
  );
}
