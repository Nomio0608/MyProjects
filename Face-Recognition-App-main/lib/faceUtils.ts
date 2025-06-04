import * as faceapi from 'face-api.js';
import { classifyFace } from './faceClassifier';

// Загваруудыг ачаалах функц
export async function loadModels() {
  const MODEL_URL = '/models';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
}

export function drawGuideFrame(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Текст
  ctx.fillStyle = "rgba(245, 18, 18, 0.7)";
  ctx.font = "25px Arial";
  ctx.fillText("Нүүрээ байрлуулна уу", 60, 30);

  // Ногоон хүрээ
  ctx.strokeStyle = "pink";
  ctx.lineWidth = 2;
  ctx.strokeRect(150, 100, 150, 150); // Хүрээний хэмжээ
}

// Нүүр илрүүлж, landmark авч, хэлбэрийг тодорхойлох
export async function detectFaceShape(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  ctx?.clearRect(0, 0, canvas.width, canvas.height); // canvas цэвэрлэх

  const result = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks();

  if (result) {
    const dims = faceapi.matchDimensions(canvas, video, true);
    const resized = faceapi.resizeResults(result, dims);
    faceapi.draw.drawFaceLandmarks(canvas, resized);

    return classifyFace(result.landmarks);
  }

  return null;
}
