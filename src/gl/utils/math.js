function lerp(start, end, fraction) {
  return (1 - fraction) * start + fraction * end;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export { lerp, clamp, map };
