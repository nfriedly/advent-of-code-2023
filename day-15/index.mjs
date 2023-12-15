import assert from "node:assert";
import fs from 'node:fs'
import { sum, toNum } from '../utils.mjs'
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

function newBoxes() {
    return new Array(256).fill(null).map(_ => new Map())
}

function parse(input) {
    return input.split(',').map(parseOp)
}

function parseOp(str, focalLengths) {
    const [left, right] = str.split('=');
    let label, op, fl;
    if (right) {
        label = left;
        op = '=';
        fl = toNum(right);
    } else {
        label = left.slice(0,-1);
        op = '-';
        fl = null;
    }
    return {
        box: hash(label),
        label,
        op,
        fl,
    }
}

assert.deepEqual(parseOp('HASH-'), {label: 'HASH', op: '-', box: 52, fl: null})
assert.deepEqual(parseOp('HASH=1'), {label: 'HASH', op: '=', box: 52, fl: 1})


function execute(input) {
    const boxes = newBoxes();
    parse(input).forEach(op => {
        const box = boxes[op.box];
        if (op.op == '=') {
            box.set(op.label, op.fl);
        } else if (op.op == '-') {
            box.delete(op.label);
        } else throw `unexpected op: ${op.op}`
    });
    return boxes
}

// itterator.toArray apparently isn't supported in my version of node.js (v20.9.0)
function toArray(iterable) {
    const arr = [];
    for(const v of iterable) {
        arr.push(v)
    }
    return arr
}

assert.deepEqual(execute('rn=1')[0], new Map([['rn', 1]]));
{
    const actual = execute(testInput);
    assert.deepEqual(actual[0], new Map([['rn', 1],['cm',2]]))
    assert.deepEqual(actual[1], new Map())
    assert.deepEqual(actual[3], new Map([['ot', 7],['ab',5], ['pc', 6]]))
}

function focusingPower(boxes) {
    return sum(boxes.map((box, i) => toArray(box.values()).map((fl, slot) => (i+1)*(slot+1)*fl)).flat())
}

assert.equal(focusingPower(execute(testInput)), 145)

console.log('Part 2:', focusingPower(execute(input)))