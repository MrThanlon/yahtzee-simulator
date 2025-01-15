import { initialState, ScoresKey, State } from "../state.js"
import { count } from "../helper.js"
import { assertEquals, declareTest } from "../unittest.js"

const scoresKey = Object.keys(State.shape.scores.shape)

let scores = 0
const numRun = 10000

export function allSame(dices: number[]) {
    const counts = count(dices)
    // keep the max count
    const max = counts.reduce((acc, cur, idx) => {
        if (cur > acc.value) {
            return { value: cur, dice: idx }
        }
        return acc
    }, { value: 0, dice: 0 })
    return dices.reduce((acc: number[], cur, idx) => {
        if (cur !== max.dice) {
            acc.push(idx)
        }
        return acc
    }, [])
}

declareTest("allSame", () => {
    const dices = [1, 1, 2, 2, 3]
    const result = allSame(dices)
    assertEquals(result, [2, 3, 4])
})

for (let i = 0; i < numRun; i++) {
    const state = initialState()

    while (state.end() === false) {
        while (state.state.reRollDice) {
            state.roll(allSame(state.state.dices))
        }

        // use max score
        let max = 0
        let k = scoresKey[0] as ScoresKey
        for (const key of scoresKey) {
            const s = state.check(key as ScoresKey)
            if (max === 0) {
                if (s != undefined) {
                    max = s
                    k = key as ScoresKey
                }
            }
            if (s != undefined && s > max) {
                max = s
                k = key as ScoresKey
            }
        }
        state.select(k)
    }

    const score = state.score()
    scores += score
}

console.log(`Average score: ${scores / numRun}`)
