import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Scene, camera, renderer, lights, and orbit controls. No objects yet.
const scene = new THREE.Scene();
scene.background = new THREE.Color('#101827');
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 6);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.domElement.id = 'scene';
renderer.domElement.setAttribute('aria-label', 'Full-screen 3D scene');
renderer.domElement.style.cssText = 'position:fixed;inset:0;display:block';
document.body.style.margin = '0';
document.body.append(renderer.domElement);
const rendering = {
  render: () => renderer.render(scene, camera),
  resize: () => {},
};

scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 3));
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(3, 5, 4);
scene.add(light);

function resize() {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  rendering.resize(innerWidth, innerHeight);
}
window.addEventListener('resize', resize);
resize();

// Later steps add updates here instead of starting additional render loops.
const updates = [];
const focus = new THREE.Vector3();
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = true;
controls.minDistance = 2;
controls.maxDistance = 12;
const clock = new THREE.Clock();
renderer.setAnimationLoop((now) => {
  const delta = Math.min(clock.getDelta(), 0.1);
  for (const update of updates) update(delta, now);
  if (controls.enabled) controls.update();
  rendering.render(delta);
});

export { THREE, scene, camera, renderer, focus, updates, controls, rendering };
2-primitives.js
import { THREE, scene } from './1-scene.js';

// 2. Add primitives to the existing scene.
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 1.2, 1.2),
  new THREE.MeshStandardMaterial({ color: '#fb927e', roughness: 1 }),
);
cube.position.set(-3, 0, 0);
cube.rotation.set(0.2, 0.4, 0);
scene.add(cube);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.65, 32, 24),
  new THREE.MeshPhysicalMaterial({
    color: '#c4b5fd', metalness: 0.7, roughness: 0.15, clearcoat: 1,
  }),
);
sphere.position.set(3, 0, 0);
scene.add(sphere);
const grid = new THREE.GridHelper(30, 30, 0x64748b, 0x334155);
grid.position.y = -1;
scene.add(grid);