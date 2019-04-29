import * as Rx from 'rxjs';

function createEmitter() {
  const subs = Object.create(null);
  const subsReplayed = Object.create(null);

  return {
    on(type, handler) {
      return (subs[type] || (subs[type] = new Rx.Subject())).subscribe(handler);
    },
    onWithLast(type, handler) {
      return (
        subsReplayed[type] || (subsReplayed[type] = new Rx.ReplaySubject(1))
      ).subscribe(handler);
    },
    emit(type, evt) {
      (subs[type] || (subs[type] = new Rx.Subject())).next(evt);
      (
        subsReplayed[type] || (subsReplayed[type] = new Rx.ReplaySubject(1))
      ).next(evt);
    },
  };
}

const emitter = createEmitter();

export default emitter;
export { createEmitter };
