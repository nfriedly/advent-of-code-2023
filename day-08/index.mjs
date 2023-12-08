import assert from 'node:assert'
import fs from 'node:fs'
import {lines, sections} from '../utils.mjs'
//import _ from 'lodash'

// 2 steps
const testInput1 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`

// 6 steps
const testInput2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`

function parse(input) {
    const [top, bottom] = sections(input);
    const directions = top.split('');
    const network = Object.fromEntries(lines(bottom).map(parseLine))
    return {
        directions,
        network
    }
}

function parseLine(line) {
    const [key, options] = line.split(' = ');
    const [L, R] = options.match(/[A-Z]{3}/g)
    return [key, {L, R}]
}

assert.deepEqual(parseLine('AAA = (BBB, CCC)'), ['AAA', {L: 'BBB', R: 'CCC'}]);
assert.deepEqual(parse(testInput2), {
    directions: ['L', 'L', 'R'],
    network: {
        AAA: {L: 'BBB', R: 'BBB'},
        BBB: {L: 'AAA', R: 'ZZZ'},
        ZZZ: {L: 'ZZZ', R: 'ZZZ'},
    }
})

function countSteps({directions, network}) {
    let count = 0;
    let cur = 'AAA';
    let i = 0;
    while (cur != 'ZZZ') {
        if (i >= directions.length) {
            i = 0;
        }
        //console.log(cur, directions[i])
        cur = network[cur][directions[i]];
        count++;
        i++;
    }
    //console.log(cur, 'done\n')
    return count;
}

assert.equal(countSteps(parse(testInput1)), 2)
assert.equal(countSteps(parse(testInput2)), 6)

const input = fs.readFileSync('./input.txt').toString()

console.log('Part 1:', countSteps(parse(input)))