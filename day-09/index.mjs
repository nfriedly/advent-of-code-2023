import assert from "node:assert";
import fs from 'node:fs'
import { add, lines, toNum } from '../utils.mjs'

const input = fs.readFileSync('./input.txt').toString();

const testInput = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`

function parse(input) {
    return lines(input).map(line => line.split(' ').map(toNum))
}

function getDeltas(nums){
    const deltas = [];
    for (let i=1; i<nums.length; i++) {
        deltas.push(nums[i] - nums[i-1])
    }
    return deltas;
}

const testData = parse(testInput);
assert.deepEqual(getDeltas(testData[0]), [3, 3, 3, 3, 3])
assert.deepEqual(getDeltas(getDeltas(testData[0])), [0, 0, 0, 0])

function extraplate(sequence) {
    let cur = sequence.slice();
    let sequences = [cur];
    while(cur.some(n => n)) {
        cur = getDeltas(cur)
        sequences.push(cur)
    }
    let nextVal;
    for (let i=sequences.length - 1; i>0; i--) {
        cur = sequences[i];
        const next = sequences[i-1]
        const delta = cur[cur.length - 1];
        nextVal = next[next.length-1] + delta
        next.push(nextVal);
    }
    return nextVal;
}

assert.equal(extraplate(testData[0]), 18)

function extrapolateAll(sequences) {
    return sequences.map(extraplate).reduce(add)
}

assert.equal(extrapolateAll(testData), 114)

console.log('Part 1:', extrapolateAll(parse(input)))