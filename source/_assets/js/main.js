import * as THREE from "three";

function main() {
  const scene = new THREE.Scene();

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const renderer = new THREE.WebGL1Renderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // an array of objects whose rotation to update
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

  const sunMaterial = new THREE.MeshPhongMaterial({
    emissive: 0xffff00,
  });

  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);

  sunMesh.scale.set(5, 5, 5); // make sun large

  scene.add(sunMesh);
  objects.push(sunMesh);

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
  }

  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

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
