import * as THREE from "three";
import { GUI } from "dat.gui";

function main() {
  const gui = new GUI();
  const scene = new THREE.Scene();

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const renderer = new THREE.WebGL1Renderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // camera settings
  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);
  //

  // an array of objects whose rotation is to be updated
  const objects = [];

  // use one sphere for everything
  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );
  //

  // make solar system
  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);
  objects.push(solarSystem);
  //

  // make sun
  const sunMaterial = new THREE.MeshPhongMaterial({
    emissive: 0xffff00,
  });

  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);

  sunMesh.scale.set(5, 5, 5); // make sun large

  solarSystem.add(sunMesh);
  objects.push(sunMesh);
  //

  // add light source
  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
  }
  //

  // make earth orbit
  const earthOrbit = new THREE.Object3D();
  earthOrbit.position.x = 10;
  solarSystem.add(earthOrbit);
  objects.push(earthOrbit);
  //

  // make earth
  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    emissive: 0x112244,
  });
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  earthOrbit.add(earthMesh);
  objects.push(earthMesh);
  //

  // make moon orbit
  const moonOrbit = new THREE.Object3D();
  moonOrbit.position.x = 2;
  earthOrbit.add(moonOrbit);
  //

  // make moon
  const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888,
    emissive: 0x222222,
  });
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.set(0.5, 0.5, 0.5);
  moonOrbit.add(moonMesh);
  objects.push(moonMesh);
  //

  // class to hold data about axes and grid
  // visibility for dat.GUI boolean checkboxes
  class AxisGridHelper {

    axes : THREE.AxesHelper;
    grid : THREE.GridHelper;
    _visible: boolean;

    constructor(node, units = 10) {
      const axes  = new THREE.AxesHelper();
      (axes.material as THREE.Material).depthTest = false;
      axes.renderOrder = 2; // after grid
      node.add(axes);

      const grid = new THREE.GridHelper(units, units);
      (grid.material as THREE.Material).depthTest = false;
      grid.renderOrder = 1;
      node.add(grid);

      this.axes = axes;
      this.grid = grid;
      this.visible = false;
    }

    get visible() {
      return this._visible;
    }

    set visible(v) {
      this._visible = v;
      this.axes.visible = v;
      this.grid.visible = v;
    }
  }
  //

  function makeAxisGrid(node, label, units?) {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, "visible").name(label);
  }

  makeAxisGrid(solarSystem, "solarSystem", 25);
  makeAxisGrid(sunMesh, "sunMesh");
  makeAxisGrid(earthOrbit, "earthOrbit");
  makeAxisGrid(earthMesh, "earthMesh");
  makeAxisGrid(moonOrbit, "moonOrbit");
  makeAxisGrid(moonMesh, "moonMesh");

  function resizeRendererToDisplaySize(renderer) {
    const body = renderer.domElement;
    const needResize =
      body.width !== window.innerWidth || body.height !== window.innerHeight;
    if (needResize) {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    return needResize;
  }

  function update(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj) => {
      obj.rotation.y = time;
    });

    // draw!
    renderer.render(scene, camera);

    // Schedule the next frame.
    requestAnimationFrame(update);
  }

  // Schedule the first frame.
  requestAnimationFrame(update);
}

main();
