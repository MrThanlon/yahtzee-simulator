import RAPIER from "@dimforge/rapier3d"
import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const gravity = { x: 0.0, y: -9.81, z: 0.0 }
const world = new RAPIER.World(gravity)

// Create the ground
const groundColliderDesc = RAPIER.ColliderDesc.cuboid(5.0, 0.1, 5.0).setRestitution(0.5)
world.createCollider(groundColliderDesc)

// Create a dynamic rigid-body.
const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.0, 1.0, 0.0).setRotation({ x: 1.0, y: 0.3, z: 0.1, w: 1.0 })
const rigidBody = world.createRigidBody(rigidBodyDesc)

// Create a cuboid collider attached to the dynamic rigidBody.
const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setRestitution(1)
const collider = world.createCollider(colliderDesc, rigidBody)

// const container = RAPIER.ColliderDesc.trimesh(new Float32Array([]), new Uint32Array([]))
// const containerCollider = world.createCollider(container)

document.body.style.margin = '0'
document.body.style.padding = '0'

const width = window.innerWidth
const height = window.innerHeight
const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 70.0, width / height, 0.1, 20.0 );
camera.position.set( 0.0, 1.0, -5.0 );

const controls = new OrbitControls( camera, renderer.domElement );
controls.screenSpacePanning = true;
controls.target.set( 0.0, 1.0, 0.0 );
controls.update();

const scene = new THREE.Scene()
const ambientLight = new THREE.AmbientLight(0x606060)
scene.add(ambientLight)
const light = new THREE.PointLight(0xffffff, 1, 1000)
scene.add(light)

const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    vertexColors: true,
})
const geometry = new THREE.BufferGeometry()
const lines = new THREE.LineSegments(geometry, material)
scene.add(lines)

// Game loop. Replace by your own game loop system.
const gameLoop = () => {
    // Step the simulation forward.  
    world.step()

    // Get and print the rigid-body's position.
    const position = rigidBody.translation()
    // console.log("Rigid-body position: ", position.x, position.y, position.z)

    const buffers = world.debugRender()

    lines.visible = true
    lines.geometry.setAttribute('position', new THREE.BufferAttribute(buffers.vertices, 3))
    lines.geometry.setAttribute("color", new THREE.BufferAttribute(buffers.colors, 4))

    renderer.render( scene, camera )

    requestAnimationFrame(gameLoop)
}

gameLoop()
