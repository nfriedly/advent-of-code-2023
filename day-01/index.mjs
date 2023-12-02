import {readFileSync} from 'node:fs'
import assert from 'node:assert'
const input = readFileSync('./input.txt').toString();

function parse(input) {
    return input.split(/[\r\n]+/g).map(line=> parseInt(
        `${line.match(/[0-9]/)[0]}${line.match(/([0-9])[a-z]*$/)[1]}`,
        10
    ))
}

function toNum(numWord) {
    return {
        'one': '1',
        'two': '2',
        'three': '3',
        'four': '4',
        'five': '5',
        'six': '6',
        'seven': '7',
        'eight': '8',
        'nine': '9'
    }[numWord] || numWord
}

function reverse(str) {
    return str.split("").reverse().join("")
}

function parseLine(line) {
    const a = line.match(/[0-9]|one|two|three|four|five|six|seven|eight|nine/)[0];
    const b = reverse(reverse(line).match(/[0-9]|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/)[0])
    return parseInt(`${toNum(a)}${toNum(b)}`, 10)
}

function parseTwo(input) {
    return input.split(/[\r\n]+/g).map(parseLine)
}

function add(nums) {
    return nums.reduce((a,b) => a+b)
}

function part1() {
    console.log('day 1, part 1: ', add(parse(input)))
}
function part2() {
    console.log('day 1, part 2: ', add(parseTwo(input)))
}



const testInput = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;
assert.deepEqual(parse(testInput), [12, 38, 15, 77])
assert.equal(add(parse(testInput)), 142)

const testTwoInput = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`

assert.deepEqual(parseTwo(testTwoInput), [29, 83, 13, 24, 42, 14, 76])
assert.equal(add(parseTwo(testTwoInput)), 281)

part1()
part2()