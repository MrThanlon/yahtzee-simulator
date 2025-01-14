import { declareTest, assert } from "./unittest.js"

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1
}

declareTest("rollDice", () => {
    const result = rollDice()
    assert(result >= 1 && result <= 6)
})
