import RAPIER from "@dimforge/rapier3d"
import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { cylinderContainer } from "./utils/shape.js"

const gravity = { x: 0.0, y: -9.81, z: 0.0 }
const world = new RAPIER.World(gravity)

// Create a dynamic rigid-body.
const rigidBody1 = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0.0, 3.0, 0.0)
        .setRotation({ x: 1.0, y: 0.3, z: 0.1, w: 1.0 })
)

const rigidBody2 = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(1.0, 3.0, 0.0)
        .setRotation({ x: 1.0, y: 0.3, z: 0.1, w: 1.0 })
)

// Create a cuboid collider attached to the dynamic rigidBody.
const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
    .setRestitution(0.02)
    .setFriction(50)
    .setMass(100.0)
const collider1 = world.createCollider(colliderDesc, rigidBody1)
const collider2 = world.createCollider(colliderDesc, rigidBody2)

const containerBody = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased())
const containerShape = cylinderContainer(2, 5, 16)
const container = RAPIER.ColliderDesc.trimesh(
    containerShape.vertices,
    containerShape.indices
).setRestitution(0.02).setFriction(50)
world.createCollider(container, containerBody)

// const container = RAPIER.ColliderDesc.trimesh(new Float32Array([]), new Uint32Array([]))
// const containerCollider = world.createCollider(container)

document.body.style.margin = '0'
document.body.style.padding = '0'

const width = window.innerWidth
const height = window.innerHeight
const renderer = new THREE.WebGLRenderer()
renderer.setSize( width, height )
renderer.setPixelRatio( window.devicePixelRatio )
document.body.appendChild( renderer.domElement )

const camera = new THREE.PerspectiveCamera( 70.0, width / height, 0.1, 20.0 )
camera.position.set( 0.0, 1.0, -5.0 )

const controls = new OrbitControls( camera, renderer.domElement )
controls.screenSpacePanning = true
controls.target.set( 0.0, 1.0, 0.0 )
controls.update()

const scene = new THREE.Scene()
// const ambientLight = new THREE.AmbientLight(0x606060)
// scene.add(ambientLight)
// const light = new THREE.PointLight(0xffffff, 1, 1000)
// scene.add(light)

const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    vertexColors: true,
})
const geometry = new THREE.BufferGeometry()
const lines = new THREE.LineSegments(geometry, material)
scene.add(lines)

// Game loop. Replace by your own game loop system.
let positionX = 0
let positionY = 0
document.addEventListener('mousemove', e => {
    positionX = e.clientX / width - 0.5
    positionY = e.clientY / height - 0.5
})
const startTime = Date.now()
const gameLoop = () => {
    // Step the simulation forward.  
    containerBody.setTranslation(new RAPIER.Vector3(positionX * 2, Math.random() * 0.001, positionY * 2), true)
    world.step()

    // Get and print the rigid-body's position.
    // const position = rigidBody.translation()
    // console.log("Rigid-body position: ", position.x, position.y, position.z)

    const buffers = world.debugRender()

    lines.visible = true
    lines.geometry.setAttribute('position', new THREE.BufferAttribute(buffers.vertices, 3))
    lines.geometry.setAttribute("color", new THREE.BufferAttribute(buffers.colors, 4))

    renderer.render( scene, camera )

    requestAnimationFrame(gameLoop)
}

gameLoop()
