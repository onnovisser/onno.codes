import KTXLoader from '../lib/ktxLoader';

/*

DXT: supported by all desktop devices and some Android devices
PVR: supported by all iOS devices and some Android devices
ETC1: supported by most Android devices

 */

const suffixes = {
  opaque: {
    s3tc: 'dxt1',
    etc1: 'etc1',
    pvrtc: 'pvrtc2BPP',
  },
  transparent: {
    s3tc: 'dxt5',
    astc: 'astc-4x4',
    etc: 'etc2A',
    pvrtc: 'pvrtc4BPP',
  },
};

const loader = new KTXLoader();

function createCompressedTextureLoader(renderer) {
  const supports = {
    astc: renderer.extensions.get('WEBGL_compressed_texture_astc'),
    etc: renderer.extensions.get('WEBGL_compressed_texture_etc'),
    etc1: renderer.extensions.get('WEBGL_compressed_texture_etc1'),
    s3tc: renderer.extensions.get('WEBGL_compressed_texture_s3tc'),
    pvrtc: renderer.extensions.get('WEBGL_compressed_texture_pvrtc'),
  };

  // Make sure to check astc before etc
  const preferredType = {
    opaque: Object.keys(suffixes.opaque).filter(key => supports[key])[0],
    transparent: Object.keys(suffixes.transparent).filter(
      key => supports[key]
    )[0],
  };

  console.log(supports, preferredType);

  return function loadCompressedTexture(path, transparency = false) {
    const t = transparency ? 'transparent' : 'opaque'
    return loader.load(
      `${path}-${suffixes[t][preferredType[t]]}.ktx`
    );
  };
}

export default createCompressedTextureLoader;
