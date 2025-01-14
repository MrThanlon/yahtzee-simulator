import { z } from "zod"
import { finalScore, initialState, isGameOver, reRoll, ScoresKey, selectScore, State } from "../state.js"
import { checkScore } from "../helper.js"

function ramdomYesOrNo() {
  return Math.random() < 0.5
}

const scoresKey = Object.keys(State.shape.scores.shape)

let scores = 0
const numRun = 10000

for (let i = 0; i < numRun; i++) {
    const state = initialState()

    while (isGameOver(state) === false) {
        while (ramdomYesOrNo()) {
            if (!reRoll(state, [0, 1, 2, 3, 4])) {
                // no more reroll
                break
            }
        }
        // use max score
        let max = 0
        let k = scoresKey[0] as ScoresKey
        for (const key of scoresKey) {
            const s = checkScore(state, key as ScoresKey)
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
        selectScore(state, k)
    }

    const score = finalScore(state)
    scores += score
}

console.log(`Average score: ${scores / numRun}`)
