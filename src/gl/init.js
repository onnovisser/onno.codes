import * as Comlink from 'comlinkjs';
import SceneWorker from './scene.worker';

async function init(canvas) {
  let scene, target;
  if ('transferControlToOffscreen' in canvas) {
    target = canvas.transferControlToOffscreen();
    const worker = new SceneWorker();
    scene = Comlink.proxy(worker);
  } else {
    target = canvas;
    scene = await import('./scene').then(m => (m && m.default) || m);
  }

  await scene.init(
    target,
    window.innerWidth,
    window.innerHeight,
    window.devicePixelRatio
  );

  window.addEventListener('resize', () => {
    scene.resize(
      window.innerWidth,
      window.innerHeight,
      window.devicePixelRatio
    );
  });
}

export default init;
