import React from 'react';
import Shader from 'shadertoy-react';
import fs from './noise.frag';
import noise from './noise.png';

function NoiseShader() {
  return (
    <Shader
      fs={fs}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
      }}
      textures={[{ url: noise }]}
    />
  );
}

export default NoiseShader;
