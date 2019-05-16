import React, { Component } from 'react';
import { createLines, mod } from './createLines';
import { getNoiseSampler, loadNoise } from './noise';

const COUNT = 30; // number of lines
const OFFSET = 5; // median distance between lines
const SPEED = 0.2; // how quick time passes
const NOISE_CHANGE = 70; // length of the noise ramp

let lastRuntime = 0;

class LinesSource extends Component {
  state = {
    loaded: false,
    time: lastRuntime, // Add some time based on the seed so two versions on the same page aren't in sync
    seed: mod(this.props.seed) || Math.random(),
    paused: false,
  };

  lastTime = performance.now();

  componentDidMount() {
    // quick check to exclude older browsers, mainly IE11, from showing the lines, as they won't work
    if (!Math.tanh) return;
    loadNoise().then(() =>
      this.setState({ loaded: true }, () => {
        this.rafId = requestAnimationFrame(this.loop);
      })
    );
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
  }

  loop = timestamp => {
    const delta = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    this.rafId = requestAnimationFrame(this.loop);
    if (this.state.paused) return;
    lastRuntime = this.state.time + delta;
    this.setState(({ time }) => ({ time: time + delta }));
  };

  handlePause = paused => {
    this.setState({ paused });
  };

  renderLines(width) {
    const phase = (Math.tanh(Math.sin(this.state.time * SPEED)) + 1) / 2;

    // Noise texture is 256 pixels tall, so offset the sampler by a max of 256 minus the amount we want to change
    const noise = getNoiseSampler(
      this.state.seed * (256 - NOISE_CHANGE) + phase * NOISE_CHANGE,
      1
    );
    const lines = createLines(COUNT, OFFSET, noise, width, this.state.seed);

    return lines.map(this.renderPolyLine);
  }

  renderPolyLine = (line, i) => (
    <polyline
      vectorEffect="non-scaling-stroke"
      points={this.renderPoints(line)}
      key={i}
    />
  );

  renderPoints = line => {
    let points = '';

    for (let i = 0; i < line.length; i++) {
      points += `${line[i][0]},${line[i][1]} `;
    }

    return points;
  };

  render() {
    return (
      <svg
        viewBox="0 120 100 150"
        preserveAspectRatio="xMidYMin meet"
        shapeRendering="optimizeSpeed"
        style={{ stroke: '#c0c0c0', fill: 'none', strokeWidth: '1px' }}
      >
        {this.state.loaded && this.renderLines(100 /* viewbox width */)}
      </svg>
    );
  }
}

export default React.memo(LinesSource);
