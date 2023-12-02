import {readFileSync} from 'node:fs'
import assert from 'node:assert'
const input = readFileSync('./input.txt').toString();

function parse(input) {
    return input.split(/[\r\n]+/g).map(line=> parseInt(
        `${line.match(/[0-9]/)[0]}${line.match(/([0-9])[a-z]*$/)[1]}`,
        10
    ))
}

function add(nums) {
    return nums.reduce((a,b) => a+b)
}

function part1() {
    console.log('day 1, part 1: ', add(parse(input)))
}


const testInput = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;
assert.deepEqual(parse(testInput), [12, 38, 15, 77])
assert.equal(add(parse(testInput)), 142)

part1()