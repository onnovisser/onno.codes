void main(void) {
  vec2 uv = gl_FragCoord.xy/iResolution.xy;
  vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
  gl_FragColor = vec4(col,1.0);
  vec4 texture = texture(iChannel0, uv);
  float y = atan(sin(iTime * .2)) * .2 + .5;
  float lineAlpha = clamp(1. - abs(uv.y - y) * 50., .0, 1.);
  vec3 line = vec3(0., 1., 1.) * lineAlpha;
  gl_FragColor = texture;
  gl_FragColor.rgb = mix(gl_FragColor.rgb, line, lineAlpha);
}
