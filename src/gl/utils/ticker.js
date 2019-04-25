import mitt from 'mitt';

class Ticker {
  static defaultOpts = {
    startPaused: true,
  };

  initialized = false;
  time;
  startTime;
  pausedTime;
  lastTime;
  runTime;
  maxDelta = 50;
  paused = true;
  frame = null;

  /**
   * Initializes the ticker at a certain time.
   * @param {number} timestamp - Time at which to initialize
   */
  constructor(opts) {
    this.opts = { ...Ticker.defaultOpts, ...opts };
    Object.assign(this, mitt());
    this.init();
  }

  init() {
    const time = performance.now();
    this.startTime = time;
    this.lastTime = time;
    this.paused = this.opts.startPaused;
    this.runTime = 0;
    this.pausedTime = 0;
    this.initialized = true;
  }

  /**
   * The main tick loop.
   * @param {number} time - Timestamp at the start of the animation frame
   * @returns {void}
   * @private
   */
  tick = time => {
    this.frame = self.requestAnimationFrame(this.tick);

    const delta = Math.min(time - this.lastTime, this.maxDelta);

    if (this.paused) {
      this.pausedTime += delta;
    } else {
      this.runTime += delta;
    }

    this.emit('tick', {
      delta: delta / 1000,
      time: time / 1000,
      paused: this.paused,
      runTime: this.runTime / 1000,
    });

    this.lastTime = time;
  };

  start() {
    this.frame = this.frame || self.requestAnimationFrame(this.tick);
    this.paused = false;
    this.emit('start');
  }

  pause() {
    this.paused = true;
    this.emit('pause');
  }

  reset() {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }

    this.initialized = false;
    this.emit('reset');
  }

  restart() {
    this.reset();
    this.start();
  }
}

export default Ticker;
