import assert from "node:assert";
import fs from 'node:fs'
import { sum } from '../utils.mjs'
import _ from 'lodash';

const testInput = 'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7'

function hash(str) {
    let cur = 0;
    for(let i=0; i<str.length; i++) {
        cur += str.charCodeAt(i);
        cur *= 17;
        cur %= 256;
    }
    return cur;
}

assert.equal(hash('HASH'), 52)

function sumHashes(str) {
    return sum(str.split(',').map(hash))
}

assert.equal(sumHashes(testInput), 1320);

const input = fs.readFileSync('./input.txt').toString()
console.log("Part 1:", sumHashes(input))