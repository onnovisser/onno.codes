import * as THREE from 'three';
// import gui from '../gui';
import createColorShader from '../shaders/colorShader';
import BloomPass from './bloomPass';
import EffectComposer from './effectComposer';
import RenderPass from './renderPass';
import ShaderPass from './shaderPass';

class Renderer {
  constructor(renderer, scene, camera, canvasWidth, canvasHeight) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.postProcessing = true;

    this.initPostProcessing(canvasWidth, canvasHeight);
  }

  initPostProcessing(canvasWidth, canvasHeight) {
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.renderPass = renderPass;

    const colorPass = new ShaderPass(createColorShader(canvasWidth, canvasHeight));
    const bloomPass = new BloomPass(
      new THREE.Vector2(canvasWidth, canvasHeight),
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
      // const folder = gui.addFolder('Post Procressing');
      // folder.addNew('enabled', this.postProcessing).onChange(value => {
      //   this.postProcessing = value;
      // });
      // folder.addNew('Use gamma', this.renderer.gammaInput).onChange(value => {
      //   this.renderer.gammaInput = value;
      //   this.renderer.gammaOutput = value;
      // });
      // const color = folder.addFolder('Color');
      // color.addNew('Brightness', 1, 0, 2).onChange(v => {
      //   colorPass.uniforms.uBrightness.value = v;
      // });
      // // color.addNew('Saturation', 1, 0, 2).onChange(v => {
      // //   colorPass.uniforms.uSaturation.value = v;
      // // });
      // color.addNew('Red', 1, 0, 2).onChange(v => {
      //   colorPass.uniforms.uColor.value.x = v;
      // });
      // color.addNew('Green', 1, 0, 2).onChange(v => {
      //   colorPass.uniforms.uColor.value.y = v;
      // });
      // color.addNew('Blue', 1, 0, 2).onChange(v => {
      //   colorPass.uniforms.uColor.value.z = v;
      // });
      // const bloomFolder = folder.addFolder('Bloom');
      // bloomFolder
      //   .addNew('bloomThreshold', bloomPass.threshold, 0.0, 1.0)
      //   .onChange(value => {
      //     bloomPass.threshold = Number(value);
      //   });
      // bloomFolder
      //   .addNew('bloomStrength', bloomPass.strength, 0.0, 3.0)
      //   .onChange(value => {
      //     bloomPass.strength = Number(value);
      //   });
      // bloomFolder
      //   .addNew('bloomRadius', bloomPass.radius, 0.0, 1.0)
      //   .onChange(value => {
      //     bloomPass.radius = Number(value);
      //   });
    }
  }

  render() {
    if (this.postProcessing) {
      this.composer.render(this.scene, this.camera);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  setSize(canvasWidth, canvasHeight) {
    this.composer.setSize(canvasWidth, canvasHeight);
    this.colorPass.uniforms.uResolution.value.set(canvasWidth, canvasHeight);
  }
}

export default Renderer;
