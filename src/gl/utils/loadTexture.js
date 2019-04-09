import { TextureLoader } from 'three';

const textureLoader = new TextureLoader();

function loadTexture(path) {
  return textureLoader.load(path);
}

export default loadTexture;
