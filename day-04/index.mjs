import assert from 'node:assert'
import {readFileSync} from 'node:fs'
const input = readFileSync('./input.txt').toString();

function parse(input) {
    return input.split(/[\r\n]+/).map(parseLine)
}

function parseLine(line) {
    const [_, [card], winners, nums] = line.split(/Card |:|\|/g).map(toNums)
    return {
        card,
        winners,
        nums
    }
}

function toNums(str) {
    return str.split(' ').filter(s => s).map(s => parseInt(s, 10))
}

function scoreCard(card) {
    const numWinners = intersection(card.winners, card.nums).length
    if (!numWinners) {
        return 0;
    }
    return Math.pow(2, numWinners-1)
}

function intersection(a,b) {
    return a.filter(a => b.includes(a))
}

function scoreInput(input) {
    return parse(input).map(scoreCard).reduce((a,b)=>a+b)
}

const testInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

const testLine = testInput.split(/[\r\n]+/)[0];

assert.deepEqual(parseLine(testLine), {
    card: 1,
    winners: [41, 48, 83, 86, 17],
    nums: [83, 86,  6, 31, 17,  9, 48, 53]
})

assert.equal(scoreCard(parseLine(testLine)), 8)

assert.equal(scoreInput(testInput), 13)

console.log('Part 1:', scoreInput(input))