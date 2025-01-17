import RAPIER from "@dimforge/rapier3d"
import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

console.log(RAPIER)

let gravity = { x: 0.0, y: -9.81, z: 0.0 }
let world = new RAPIER.World(gravity)

// Create the ground
let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0)
world.createCollider(groundColliderDesc)

// Create a dynamic rigid-body.
let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.0, 1.0, 0.0)
let rigidBody = world.createRigidBody(rigidBodyDesc)

// Create a cuboid collider attached to the dynamic rigidBody.
let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
let collider = world.createCollider(colliderDesc, rigidBody)

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
let gameLoop = () => {
    // Step the simulation forward.  
    world.step()

    // Get and print the rigid-body's position.
    let position = rigidBody.translation()
    // console.log("Rigid-body position: ", position.x, position.y, position.z)

    const buffers = world.debugRender()

    lines.visible = true
    lines.geometry.setAttribute('position', new THREE.BufferAttribute(buffers.vertices, 3))
    lines.geometry.setAttribute("color", new THREE.BufferAttribute(buffers.colors, 4))

    renderer.render( scene, camera )

    requestAnimationFrame(gameLoop)
}

gameLoop()
