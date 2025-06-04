import * as faceapi from 'face-api.js';

type FaceSample = {
  label: string;
  features: number[]; // Flat array of (x, y) points
};

// ⛔️ Жич: Та жинхэнэ сургагдсан өгөгдлөөр энэ хэсгийг дараа нь солих хэрэгтэй.
const trainingData: FaceSample[] = [
  {
    label: 'oval',
    features: [30, 50, 32, 51, 34, 52, 36, 53, 38, 54, 40, 55], // жишээ өгөгдөл
  },
  {
    label: 'square',
    features: [28, 48, 30, 49, 32, 50, 34, 51, 36, 52, 38, 53], // жишээ
  },
  // ... бусад хэлбэрүүд
];

function distance(a: number[], b: number[]) {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

export function classifyFace(landmarks: faceapi.FaceLandmarks68): string {
  const points = landmarks.positions;
  const features: number[] = points.flatMap((pt) => [pt.x, pt.y]);

  const k = 3;
  const distances = trainingData.map(sample => ({
    label: sample.label,
    dist: distance(features, sample.features),
  }));

  const sorted = distances.sort((a, b) => a.dist - b.dist).slice(0, k);
  const votes: Record<string, number> = {};

  sorted.forEach(({ label }) => {
    votes[label] = (votes[label] || 0) + 1;
  });

  return Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
}
