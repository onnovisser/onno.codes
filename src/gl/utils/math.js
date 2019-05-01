function lerp(start, end, fraction) {
  return (1 - fraction) * start + fraction * end;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function smoothstep(min, max, value) {
  var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export { lerp, clamp, map, smoothstep };
