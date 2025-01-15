import { z } from "zod"
import { assert, declareTest } from "./unittest.js"
import { State, Scores, ScoresKey } from "./state.js"

type NumberScoreType = 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes'
type NumberScore = Record<NumberScoreType, number>
type NonNumberScore = Omit<Scores, NumberScoreType>

const sk: NumberScore = {
    ones: 1,
    twos: 2,
    threes: 3,
    fours: 4,
    fives: 5,
    sixes: 6
}

function isNumberScore(score: ScoresKey): score is NumberScoreType {
    return score in sk
}

export function count(dices: number[]): number[] {
    return dices.reduce((acc, cur) => {
        acc[cur] += 1
        return acc
    }, Array(7).fill(0))
}

function fourOfAKind(dices: number[]): number {
    // find 4 of a kind
    const counts = count(dices)
    let res = 0
    counts.forEach((count, i) => {
        if (count >= 4) {
            res = count * i
        }
    })
    return res
}

declareTest('fourOfAKind', () => {
    assert(fourOfAKind([1, 1, 2, 2, 3]) === 0)
    assert(fourOfAKind([1, 3, 3, 3, 3]) === 12)
    assert(fourOfAKind([1, 1, 1, 1, 1]) === 5)
})

function fullHouse(dices: number[]): number {
    // 3 + 2
    const counts = count(dices)
    let i3 = counts.indexOf(3)
    let i2 = counts.indexOf(2)
    if (i3 >= 0 && i2 >= 0) {
        return i3 * 3 + i2 * 2
    }
    return 0
}

declareTest('fullHouse', () => {
    assert(fullHouse([1, 1, 2, 2, 3]) === 0)
    assert(fullHouse([1, 1, 1, 2, 2]) === 7)
    assert(fullHouse([1, 1, 1, 1, 2]) === 0)
})

function smallStraight(dices: number[]): number {
    // 1234 | 2345 | 3456
    const bits = dices.reduce((acc, cur) => acc | (1 << (cur - 1)), 0)
    for (let i = 0; i <= 2; i++) {
        if (((bits >> i) & 0b1111) === 0b1111) {
            return 15
        }
    }
    return 0
}

declareTest('smallStraight', () => {
    assert(smallStraight([1, 2, 3, 4, 5]) === 15)
    assert(smallStraight([1, 2, 3, 4, 6]) === 15)
    assert(smallStraight([1, 2, 3, 5, 6]) === 0)
    assert(smallStraight([3, 2, 1, 4, 6]) === 15)
    assert(smallStraight([6, 5, 4, 3, 1]) === 15)
})

function largeStraight(dices: number[]): number {
    const bits = dices.reduce((acc, cur) => acc | (1 << (cur - 1)), 0)
    for (let i = 0; i <= 1; i++) {
        if (((bits >> i) & 0b11111) === 0b11111) {
            return 30
        }
    }
    return 0
}

declareTest('largeStraight', () => {
    assert(largeStraight([1, 2, 3, 4, 5]) === 30)
    assert(largeStraight([2, 3, 4, 5, 6]) === 30)
    assert(largeStraight([1, 2, 3, 4, 3]) === 0)
})

function yahtzee(dices: number[]): number {
    if (dices.every(d => d === dices[0])) {
        return 50
    }
    return 0
}

declareTest('yahtzee', () => {
    assert(yahtzee([1, 1, 1, 1, 1]) === 50)
    assert(yahtzee([1, 2, 3, 4, 5]) === 0)
    assert(yahtzee([6, 6, 6, 6, 6]) === 50)
    assert(yahtzee([1, 1, 2, 2, 3]) === 0)
})

export function checkScore(state: State, selected: ScoresKey): number | undefined {
    if (state.scores[selected] !== undefined) {
        return undefined
    }
    if (isNumberScore(selected)) {
        const k = sk[selected]
        const score = state.dices.filter(d => d === k).length * k
        const numberingScore = Object.keys(state.scores)
            .filter(k => isNumberScore(k as ScoresKey))
            .map(k => state.scores[k as ScoresKey])
            .reduce((acc, cur) => (acc as number) + (cur || 0), 0) as number
        if (numberingScore + score > 63) {
            return score + 35
        } else {
            return score
        }
    } else if (selected === 'chance') {
        return state.dices.reduce((acc, cur) => acc + cur, 0)
    } else if (selected === 'fourOfAKind') {
        return fourOfAKind(state.dices)
    } else if (selected === 'fullHouse') {
        return fullHouse(state.dices)
    } else if (selected === 'smallStraight') {
        return smallStraight(state.dices)
    } else if (selected === 'largeStraight') {
        return largeStraight(state.dices)
    } else if (selected === 'yahtzee') {
        return yahtzee(state.dices)
    }
    return undefined
}

/**
 * 计算投出指定骰子的概率
 * @param num 
 * @param expected 
 */
export function posibility(num: number, expected: number[]) {

}