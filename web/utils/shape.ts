import RAPIER from "@dimforge/rapier3d"

export function cylinderContainer(r: number, depth: number, subdivisions: number) {
    const vertices = Array(subdivisions).fill(0).map((_, idx) => {
        const angle = 2 * Math.PI * idx / subdivisions
        return [
            r * Math.cos(angle), 0, r * Math.sin(angle),
            r * Math.cos(angle), depth, r * Math.sin(angle),
        ]
    })
    const indices = Array(subdivisions).fill(0).map((_, idx) => {
        const i1 = idx * 2
        const i2 = (i1 + 2) % (subdivisions * 2)
        return [
            0, i1 + 1, i2 + 1,
            i1 + 1, i1 + 2, i2 + 2,
            i1 + 1, i2 + 1, i2 + 2,
        ]
    })
    return {
        vertices: new Float32Array([
            0, 0, 0,
           ...vertices.flat(),
        ]),
        indices: new Uint32Array(indices.flat())
    }
}

export function container(world: RAPIER.World, r: number, depth: number, num: number) {
    const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()

    // create circle bottom
    const verts = Array(num).fill(0).map((_, idx) => {
        const angle = 2 * Math.PI * idx / num
        return [
            r * Math.cos(angle),
            r * Math.sin(angle),
            0
        ]
    })
    const vertices = new Float32Array([
        0, 0, 0,
        ...verts.flat(),
    ])
    const colliderDesc = RAPIER.ColliderDesc.trimesh(
        new Float32Array([]),
        new Uint32Array([])
    )
    const body = world.createRigidBody(bodyDesc)
    const collider = world.createCollider(colliderDesc, body)
    return {
        body, collider
    }
}
