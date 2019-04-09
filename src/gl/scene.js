import * as THREE from 'three';
import emitter from '../utils/emitter';
import Renderer from './effects/renderer';
import gui from './gui';
import OBJLoader from './lib/objLoader';
import TerrainMaterial from './materials/terrain';
import { addBarycentricCoordinates, unindexBufferGeometry } from './utils/geom';

let scene, camera, renderer, effectRenderer, controls, floor, background;

async function init(canvas) {
  initScene(canvas);
  initGeometry();
  renderer.setAnimationLoop(update);
  window.addEventListener('resize', onResize);
}

function initScene(canvas) {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xfafafc, 0, 1000);

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );
  camera.setFocalLength(10);
  camera.position.set(391.292, 117.129, 61.784);
  // camera.position.set(10, 1, 0)
  // camera.rotation.set(-20.333 * (Math.PI / 180), 80.368 * (Math.PI / 180), -10.675 * (Math.PI / 180))
  camera.rotation.set(
    -0.333 * (Math.PI / 180),
    80.368 * (Math.PI / 180),
    -0.675 * (Math.PI / 180)
  );
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
    pixelRatio: window.devicePixelRatio,
  });

  renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0xfafafc);
  const gl = renderer.getContext();
  gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);

  const { x, y, z } = camera.position;
  gui.addNew('x', x, x - 20, x + 6).onChange(v => (camera.position.x = v));
  gui.addNew('y', y, y - 6, y + 6).onChange(v => (camera.position.y = v));
  gui.addNew('z', z, z - 6, z + 6).onChange(v => (camera.position.z = v));
  gui.addNew('Focal Length', 10, 9, 14).onChange(v => camera.setFocalLength(v));

  // controls = new OrbitControls(camera, document);
  effectRenderer = new Renderer(renderer, scene, camera);

  window.camera = camera;

  onResize();
}

function initGeometry() {
  const floorGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
  const floorMaterial = new THREE.MeshLambertMaterial({ wireframe: false });
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -5;
  floor.rotateX(-0.5 * Math.PI);
  floor.receiveShadow = true;
  scene.add(floor);

  const backgroundGeometry = new THREE.SphereGeometry(1000, 10, 10);
  const backgroundMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000,
    side: THREE.BackSide,
  });
  background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  // scene.add(background);

  const ballGeometry = new THREE.SphereGeometry(2, 10, 10);
  const ballMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000,
  });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.castShadow = true;
  ball.receiveShadow = false;
  // scene.add(ball);
  ball.position.set(330, 120, 60);
  // ball.position.set(0, 5, 0)

  const light = new THREE.DirectionalLight(0xffffff, 1);
  const helper = new THREE.DirectionalLightHelper(light, 200);
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
  scene.add(light);

  console.log(light.shadow.camera);
  // scene.add(new THREE.CameraHelper(light.shadow.camera));
  // light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );

  const loader = new OBJLoader();
  loader.load('/test.obj', obj => {
    console.log(obj);
    scene.add(obj);
    const terrain = obj.children[0];

    terrain.castShadow = true;
    terrain.receiveShadow = true;

    unindexBufferGeometry(terrain.geometry);
    addBarycentricCoordinates(terrain.geometry, false);
    terrain.material = new TerrainMaterial();
  });
}

function update(timestamp, asd, a) {
  const time = timestamp / 1000;
  // controls.update();
  effectRenderer.render();
  emitter.emit('update', { time });
}

function onResize() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  effectRenderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

export default init;
