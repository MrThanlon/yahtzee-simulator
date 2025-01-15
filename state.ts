import { z } from "zod"
import { declareTest } from "./unittest.js"
import { rollDice } from "./dice.js"
import { checkScore } from "./helper.js"

export const State = z.object({
    /**
     * 回合数
     */
    round: z.number().int().min(0).max(11).default(0),
    /**
     * 剩余重新掷骰子次数
     */
    reRollDice: z.number().int().min(0).max(2).default(2),
    /**
     * 当前的骰子
     */
    dices: z.array(z.number().int().min(1).max(6)).length(5),
    /**
     * 计分板
     */
    scores: z.object({
        ones: z.number().int().min(0).max(5 * 1).optional(),
        twos: z.number().int().min(0).max(5 * 2).optional(),
        threes: z.number().int().min(0).max(5 * 3).optional(),
        fours: z.number().int().min(0).max(5 * 4).optional(),
        fives: z.number().int().min(0).max(5 * 5).optional(),
        sixes: z.number().int().min(0).max(5 * 6).optional(),
        /**
         * 四条: 为四个点数相同骰子的组合，将五个骰子点数和作为所得分数。
         */
        fourOfAKind: z.number().int().min(0).max(5 * 6).optional(),
        /**
         * 葫芦: 为三个点数相同骰子和另外两个点数相同骰子的组合， 将五个骰子点数和作为所得分数。
         */
        fullHouse: z.number().int().min(0).max(3 * 6 + 2 * 5).optional(),
        /**
         * 小顺: 其中四个骰子为1234、2345、3456者，分数得15分。
         */
        smallStraight: z.number().int().min(0).max(15).optional(),
        /**
         * 大顺: 骰子点数为12345、23456者，分数得30分。
         */
        largeStraight: z.number().int().min(0).max(30).optional(),
        /**
         * 快艇: 为五个点数相同骰子的组合， 第一次分数得50分。
         */
        yahtzee: z.number().int().min(0).max(50).optional(),
        /**
         * 全骰: 所有骰子点数相加作为总分。
         */
        chance: z.number().int().min(0).max(6 * 6).optional(),
    }),
})
export type State = z.infer<typeof State>

export function initialState() {
    const dices = Array(5).fill(0).map(() => rollDice())
    const state = State.parse({ scores: {}, dices })
    return {
        state,
        roll(diceIndexes: number[]) {
            if (state.reRollDice <= 0) {
                return false
            }
            if (diceIndexes.length > 5) {
                return false
            }
            diceIndexes.forEach(i => {
                state.dices[i] = rollDice()
            })
            state.reRollDice -= 1
            return true
        },
        check(selected: ScoresKey) {
            return checkScore(state, selected)
        },
        select(selected: ScoresKey) {
            const score = checkScore(state, selected)
            if (score !== undefined) {
                state.scores[selected] = score
                state.reRollDice = 2
                state.round += 1
                return true
            }
            return false
        },
        end() {
            return state.round >= 11
        },
        score() {
            return Object.values(state.scores).reduce((acc, cur) => acc + (cur || 0), 0)
        }
    }
}

declareTest('state', () => {
    console.debug(initialState())
})

declareTest('roll', () => {
    const state = initialState()
    state.roll([0, 1, 2])
    console.debug(state.state.dices)
})

export const Scores = State.shape.scores
export type Scores = z.infer<typeof Scores>
export type ScoresKey = keyof Scores
