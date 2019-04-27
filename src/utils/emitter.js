import mitt from 'mitt';
import * as Rx from 'rxjs';

function createReplayEmitter(all) {
  all = all || Object.create(null);

  return {
    on(type, handler) {
      return (all[type] || (all[type] = new Rx.ReplaySubject(1))).subscribe(
        evt => handler(evt)
      );
    },
    emit(type, evt) {
      (all[type] || (all[type] = new Rx.ReplaySubject(1))).next(evt);
      // (all[type] || []).slice().map(function(handler) {
      //   handler(evt);
      // });
      // (all['*'] || []).slice().map(function(handler) {
      //   handler(type, evt);
      // });
    },
  };
}

const emitter = mitt();
const replayEmitter = createReplayEmitter();

// window.rx = Rx;

// const source = Rx.fromEventPattern(
//   function addHandler(f) {
//     emitter.on('*', (t, e) => f({ t, e }));
//   },
//   function delHandler(f) {
//     emitter.off('*', f);
//   }
// );
// const hot = source.pipe(
//   ops.groupBy(({ t }) => t),
//   ops.map(o => {
//     const subject = new Rx.ReplaySubject(1);
//     const multicasted = o.pipe(ops.multicast(subject));
//     // o.pipe(ops.publishReplay(1))
//     multicasted.connect();
//     return multicasted;
//   }),
//   ops.mergeAll(),
//   ops.publishReplay(100)
// );
// hot.connect();

// window.emitter = emitter;
// window.hot = hot;
// window.ops = ops;
// window.replayEmitter = replayEmitter;

export default emitter;
export { replayEmitter, createReplayEmitter };
