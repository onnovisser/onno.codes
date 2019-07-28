import * as THREE from 'three';
import createDeferredPromise from '../utils/createDeferredPromise';
import { createEmitter } from '../utils/emitter';
import Renderer from './effects/renderer';
import DRACOLoader from './lib/dracoLoader';
import GLTFLoader from './lib/gltfLoader';
// import gui from './gui';
import TerrainMaterial from './materials/terrain';
import createCompressedTextureLoader from './utils/createCompressedTextureLoader';
import {
  addBarycentricCoordinates,
  computeCentroids,
  unindexBufferGeometry,
} from './utils/geom';
import { lerp, smoothstep } from './utils/math';
import Ticker from './utils/ticker';

// 1.00 19
// 1.10 17.1
// 1.25 15.15
// 1.35 14
// 1.50 12.7
// 1.75 10.8

const states = {
  DEFAULT: 0,
  ABOUT: 1,
};

const cameraPositions = {
  [states.DEFAULT]: [380, 114, 61.784],
  [states.ABOUT]: [391.292, 117.129, 61.784],
};

class App {
  state = states.DEFAULT;
  ticker = new Ticker();
  emitter = createEmitter();
  loadPromise = createDeferredPromise();
  focalLength = 10.801;

  async init(canvas, windowWidth, windowHeight, pixelRatio) {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xfafafc, 0, 1000);

    this.camera = new THREE.PerspectiveCamera(
      40,
      windowWidth / windowHeight,
      0.1,
      5000
    );
    this.camera.setFocalLength(this.focalLength);
    console.log(this.camera);
    this.camera.position.set(...cameraPositions[this.state]);
    // camera.position.set(10, 1, 0)
    // camera.rotation.set(-20.333 * (Math.PI / 180), 80.368 * (Math.PI / 180), -10.675 * (Math.PI / 180))
    this.camera.rotation.set(
      -0.333 * (Math.PI / 180),
      80.368 * (Math.PI / 180),
      -0.675 * (Math.PI / 180)
    );
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      // antialias: true // Doesn't work together with PostProcessing
      canvas,
      pixelRatio,
    });

    // this.renderer.shadowMap.enabled = true;
    // // this.renderer.shadowMap.type = THREE.PCFShadowMap;
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0xfafafc);
    const gl = this.renderer.getContext();
    gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);

    const { x, y, z } = this.camera.position;
    // gui
    //   .addNew('x', x, x - 20, x + 6)
    //   .onChange(v => (this.camera.position.x = v));
    // gui
    //   .addNew('y', y, y - 6, y + 6)
    //   .onChange(v => (this.camera.position.y = v));
    // gui
    //   .addNew('z', z, z - 6, z + 6)
    //   .onChange(v => (this.camera.position.z = v));
    // gui.addNew('Focal Length', this.focalLength, 9.01, 24).onChange(v => {
    //   console.log(v);
    //   this.focalLength = v;
    //   this.camera.setFocalLength(v);
    // });

    // controls = new OrbitControls(this.camera, document);
    this.effectRenderer = new Renderer(this.renderer, this.scene, this.camera);
    this.texLoader = createCompressedTextureLoader(this.renderer);

    this.resize(windowWidth, windowHeight, pixelRatio);

    this.initGeometry();
    this.emitter.onWithLast('changePage', this.setState);
    this.ticker.on('tick', this.update);
    this.ticker.start();

    await this.loadPromise;
  }

  initGeometry() {
    // const backgroundGeometry = new THREE.SphereGeometry(1000, 10, 10);
    // const backgroundMaterial = new THREE.MeshLambertMaterial({
    //   color: 0xff0000,
    //   side: THREE.BackSide,
    // });
    // this.background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    // scene.add(background);

    // const ballGeometry = new THREE.SphereGeometry(2, 10, 10);
    // const ballMaterial = new THREE.MeshLambertMaterial({
    //   color: 0xff0000,
    // });
    // const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    // ball.castShadow = true;
    // ball.receiveShadow = false;
    // this.scene.add(ball);
    // ball.position.set(330, 120, 60);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    // const helper = new THREE.DirectionalLightHelper(light, 200);
    // scene.add(helper);
    light.position.set(1, 8, 4);
    light.castShadow = true;
    light.shadow.bias = 0.0001;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.position.set(291.292, 130, 61.784);
    light.shadow.camera.near = -300;
    light.shadow.camera.far = 100;
    light.shadow.camera.right = 350;
    light.shadow.camera.left = 50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -250;
    this.scene.add(light);

    const light2 = new THREE.DirectionalLight(0xff0000, 30);
    // const helper = new THREE.DirectionalLightHelper(light, 200);
    // scene.add(helper);
    light2.position.set(0, -1, 0);
    // this.scene.add(light2);

    console.log(light.shadow.camera);
    // scene.add(new THREE.CameraHelper(light.shadow.camera));
    // light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );

    const loader = new GLTFLoader();
    DRACOLoader.setDecoderPath('/draco-gltf/');
    loader.setDRACOLoader(new DRACOLoader());
    loader.load('/terrain-draco.gltf', obj => {
      const terrain = obj.scene.children[0];

      terrain.castShadow = true;
      terrain.receiveShadow = true;

      unindexBufferGeometry(terrain.geometry);
      addBarycentricCoordinates(terrain.geometry, false);
      computeCentroids(terrain.geometry);
      
      this.scene.add(obj.scene);
      terrain.material.show();
      this.loadPromise.resolve();

      const tex = this.texLoader('/tex-2k');
      const map = this.texLoader('/white');
      terrain.material = new TerrainMaterial(
        { map },
        { tex: { value: tex } },
        this
      );

      // const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
      // const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, fog: false });
      // this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
      // // this.floor.position.y = -5;
      // this.floor.rotateX(-0.5 * Math.PI);
      // this.floor.position.y = 10;
      // // this.floor.receiveShadow = true;
      // this.scene.add(this.floor);
    });
  }

  setState = v => {
    this.state = v;
  };

  update = e => {
    // controls.update();
    this.effectRenderer.render();
    this.emitter.emit('update', e);
    const newPos = this.camera.position
      .toArray()
      .map((v, i) => lerp(v, cameraPositions[this.state][i], e.delta * 0.8));
    this.camera.position.set(...newPos);
  };

  resize = (windowWidth, windowHeight, pixelRatio) => {
    const canvasWidth = windowWidth * pixelRatio;
    const canvasHeight = windowHeight * pixelRatio;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(windowWidth, windowHeight, false);
    this.effectRenderer.setSize(canvasWidth, canvasHeight);
    this.camera.aspect = windowWidth / windowHeight;
    this.focalLength = lerp(10.8, 19, smoothstep(1.75, 1, this.camera.aspect));
    this.camera.setFocalLength(this.focalLength);
    // console.log(this.camera.getFocalLength());
    this.camera.updateProjectionMatrix();
  };
}

export default App;
