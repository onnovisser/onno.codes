import * as THREE from 'three';
import gui from '../gui';
import ColorShader from '../shaders/colorShader';
import BloomPass from './bloomPass';
import EffectComposer from './effectComposer';
import RenderPass from './renderPass';
import ShaderPass from './shaderPass';

class Renderer {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.postProcessing = true;

    this.initPostProcessing();
  }

  initPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.renderPass = renderPass;

    const colorPass = new ShaderPass(ColorShader);
    const bloomPass = new BloomPass(
      new THREE.Vector2(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
      ),
      0.6,
      0.4,
      0.85
    );

    this.composer.addPass(renderPass);
    // this.composer.addPass(AAPass);
    // this.composer.addPass(bloomPass);
    this.composer.addPass(colorPass);
    // Render the last pass to the screen
    colorPass.renderToScreen = true;
    this.bloomPass = bloomPass;
    this.colorPass = colorPass;

    // Not sure
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

    if (true) {
      const folder = gui.addFolder('Post Procressing');
      folder.addNew('enabled', this.postProcessing).onChange(value => {
        this.postProcessing = value;
      });
      folder.addNew('Use gamma', this.renderer.gammaInput).onChange(value => {
        this.renderer.gammaInput = value;
        this.renderer.gammaOutput = value;
      });

      const color = folder.addFolder('Color');
      color.addNew('Brightness', 1, 0, 2).onChange(v => {
        colorPass.uniforms.uBrightness.value = v;
      });
      // color.addNew('Saturation', 1, 0, 2).onChange(v => {
      //   colorPass.uniforms.uSaturation.value = v;
      // });
      color.addNew('Red', 1, 0, 2).onChange(v => {
        colorPass.uniforms.uColor.value.x = v;
      });

      color.addNew('Green', 1, 0, 2).onChange(v => {
        colorPass.uniforms.uColor.value.y = v;
      });

      color.addNew('Blue', 1, 0, 2).onChange(v => {
        colorPass.uniforms.uColor.value.z = v;
      });

      const bloomFolder = folder.addFolder('Bloom');
      bloomFolder
        .addNew('bloomThreshold', bloomPass.threshold, 0.0, 1.0)
        .onChange(value => {
          bloomPass.threshold = Number(value);
        });
      bloomFolder
        .addNew('bloomStrength', bloomPass.strength, 0.0, 3.0)
        .onChange(value => {
          bloomPass.strength = Number(value);
        });
      bloomFolder
        .addNew('bloomRadius', bloomPass.radius, 0.0, 1.0)
        .onChange(value => {
          bloomPass.radius = Number(value);
        });
    }
  }

  updateState = () => {
    const state = store.getState();
    if (this.viewMode !== state.game.viewMode) {
      this.viewMode = state.game.viewMode;
      this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
      this.renderer.setScissorTest(false);
      this.composer.renderPass.camera = this.camera;
    }
  };

  render() {
    if (this.postProcessing) {
      this.composer.render(this.scene, this.camera);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  setSize(width, height) {
    this.composer.setSize(
      width * window.devicePixelRatio,
      height * window.devicePixelRatio
    );
    this.colorPass.uniforms.uResolution.value.set(
      width * window.devicePixelRatio,
      height * window.devicePixelRatio
    );
  }
}

export default Renderer;
