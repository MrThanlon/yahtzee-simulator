import { z } from "zod"
import { initialState, ScoresKey, State } from "../state.js"

function ramdomYesOrNo() {
  return Math.random() < 0.5
}

const scoresKey = Object.keys(State.shape.scores.shape)

let scores = 0
const numRun = 10000

for (let i = 0; i < numRun; i++) {
    const state = initialState()

    while (state.end() === false) {
        while (ramdomYesOrNo()) {
            if (!state.roll([0, 1, 2, 3, 4])) {
                // no more reroll
                break
            }
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
