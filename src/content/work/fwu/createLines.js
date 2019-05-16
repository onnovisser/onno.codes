import { mapNoise } from './noise';

const startOffset = 100;
const extraSeed = Math.random();

function mod(rand, n = 3) {
  return ((rand * Math.PI + extraSeed) * 10 ** n) % 1;
}

function createLines(count, offset, noise, width, seed) {
  const firstLine = [
    [-0.2 * width, -80 + startOffset],
    [seed * 0.7 * width, startOffset], // mapNoise(noise[0]) * 30
    [(0.3 + seed * 0.7) * width, -30 + mod(seed) * 40 + startOffset],
    [1.2 * width, -30 + startOffset],
  ];
  const lines = [];

  for (let i = 0; i < count; i++) {
    const newLine = (lines[i - 1] || firstLine).map(old => [old[0], old[1] + offset]);
    const [p1, p2, p3, p4] = newLine;

    p2[0] = mapNoise(noise[i + 20]) * offset * 3.2 + firstLine[1][0];
    p2[1] = i * offset + mapNoise(noise[i]) * offset * 4 + firstLine[1][1];
    p3[0] = mapNoise(noise[i + 10]) * offset + firstLine[2][0];
    p3[1] = i * offset + mapNoise(noise[i + 10]) * offset * 5.5 + firstLine[2][1];

    lines.push([p1, p2, p3, p4]);
  }

  return lines;
}

export { createLines, mod };
