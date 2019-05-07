import * as Comlink from 'comlinkjs';
import emitter from '../utils/emitter';
import SceneWorker from './scene.worker';

async function init(canvas) {
  let Scene, target;
  if ('transferControlToOffscreen' in canvas && false) {
    target = canvas.transferControlToOffscreen();
    const worker = new SceneWorker();
    Scene = Comlink.proxy(worker);
  } else {
    target = canvas;
    Scene = await import('./scene').then(m => (m && m.default) || m);
  }

  const scene = await new Scene();
  await scene.init(
    target,
    window.innerWidth,
    window.innerHeight,
    window.devicePixelRatio
  );

  emitter.onWithLast('changePage', evt => {
    scene.emitter.emit('changePage', evt);
  });

  window.addEventListener('resize', () => {
    scene.resize(
      window.innerWidth,
      window.innerHeight,
      window.devicePixelRatio
    );
  });
}

export default init;
