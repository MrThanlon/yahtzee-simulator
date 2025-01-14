import { z } from "zod"
import { finalScore, initialState, isGameOver, reRoll, ScoresKey, selectScore, State } from "../state.js"

const state = initialState()

function ramdomYesOrNo() {
  return Math.random() < 0.5
}

const scoresKey = Object.keys(State.shape.scores.shape)

while (isGameOver(state) === false) {
    while (ramdomYesOrNo()) {
        if (!reRoll(state, [0, 1, 2, 3, 4])) {
            // no more reroll
            break
        }
    }
    let index = Math.floor(Math.random() * 12)
    while (!selectScore(state, scoresKey[index] as ScoresKey)) {
        index = Math.floor(Math.random() * 12)
    }
}

console.log(finalScore(state))
