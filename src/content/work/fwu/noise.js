import noiseTexture from './noise.png';

let canvas, ctx;
if (typeof document !== 'undefined') {
  canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  ctx = canvas.getContext('2d');
}
let image = null;

// Sample a line from the noise texture and get an array of the lightness values
function getNoiseSampler(seed = 0, skip = 0) {
  const offset = seed % 256;
  const roundedOffset = Math.floor(offset);
  const remainder = roundedOffset - offset;
  let values;
  try {
    const valuesLow = ctx
      .getImageData(0, offset, 256, 1)
      .data.filter((_, i) => i % (4 + 4 * skip) === 0);
    const valuesHigh = ctx
      .getImageData(0, offset + 1, 256, 1)
      .data.filter((_, i) => i % (4 + 4 * skip) === 0);
    values = valuesHigh.map((val, i) => lerp(val, valuesLow[i], remainder));
  } catch (e) {
    // can happen due to CORS issues loading the image
    console.error(e);
    values = Array.from({ length: 256 }, () => 0);
  }

  return values;
}

function loadImage(src) {
  return new Promise((yay, nay) => {
    const img = new Image();
    img.onload = () => {
      yay(img);
      img.onload = null;
      img.onerror = null;
    };
    img.onerror = nay;
    img.src = src;
  });
}

function loadNoise() {
  return image
    ? Promise.resolve()
    : loadImage(noiseTexture).then(img => {
        image = img;
        ctx.drawImage(img, 0, 0, 256, 256);
      });
}

function lerp(start, end, fraction) {
  return (1 - fraction) * start + fraction * end;
}

function mapNoise(n) {
  return n / 128 - 1;
}

export { loadNoise, getNoiseSampler, mapNoise };
