import { CanvasTexture, ImageBitmapLoader } from 'three';

const loader = new ImageBitmapLoader();

loader.setOptions( { imageOrientation: 'flipY' } );

function loadCanvasTexture(path) {
  return new Promise(res => {
    return loader.load(path, imageBitmap => {
      res(new CanvasTexture(imageBitmap));
    });
  });
}

export default loadCanvasTexture;
