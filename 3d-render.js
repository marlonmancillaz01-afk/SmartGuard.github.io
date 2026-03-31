// ==========================================
// THREE.JS HOLOGRAPHIC RENDERER
// ==========================================

const container = document.getElementById('hologram-container');

// 1. Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
// alpha: true allows the dark background from CSS to show through
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); 

renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// 2. Build the "Device" (A complex double-layered geometry)
// Outer Shell
const outerGeometry = new THREE.CapsuleGeometry(1, 1.5, 4, 16); 
const outerMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x4ade80, // Tactical Green
    wireframe: true, 
    transparent: true,
    opacity: 0.4
});
const deviceShell = new THREE.Mesh(outerGeometry, outerMaterial);
scene.add(deviceShell);

// Inner Core (Represents the internal acoustic processor)
const coreGeometry = new THREE.CylinderGeometry(0.4, 0.4, 2.5, 8);
const coreMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xfbbf24, // Tactical Amber
    wireframe: true 
});
const deviceCore = new THREE.Mesh(coreGeometry, coreMaterial);
deviceShell.add(deviceCore); // Bind the core to the shell

// Move camera back so we can see the object
camera.position.z = 4;

// 3. Animation Loop (Spins the object at 60fps)
function animate3D() {
    requestAnimationFrame(animate3D);

    // Rotate the outer shell slowly
    deviceShell.rotation.x += 0.005;
    deviceShell.rotation.y += 0.01;
    
    // Rotate the inner core in the opposite direction slightly faster
    deviceCore.rotation.y -= 0.02;

    renderer.render(scene, camera);
}

// Start the simulation
animate3D();

// 4. Handle Window Resizing so the 3D model doesn't stretch
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});