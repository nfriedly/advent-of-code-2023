import assert, { AssertionError } from "node:assert";
import fs from 'node:fs'
import { toColumns, lines, sections, sum } from '../utils.mjs'
import _ from 'lodash';

const testInput = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`

function parse(input) {
    return sections(input).map(section => ({
        // rows and cols are each an array of strings
        rows: lines(section), 
        cols: toColumns(section).map(c => c.join(''))})
    );
}

assert.deepEqual(parse('12\n34'), [{
    rows: ['12', '34'],
    cols: ['13', '24']
}])

// returns the index of the row or column just after the mirror line
function findMirrorLine(data) {
    // start at the second line
    const len = data.length;
    outer: for(let mirrorLine=1; mirrorLine<len; mirrorLine++) {
        if (data[mirrorLine-1] == data[mirrorLine]) {
            // iterate outwards until reaching the end of the array
            const distance = Math.min(mirrorLine, len-mirrorLine)
            for (let offset=1; offset<distance; offset++) {
                if (data[mirrorLine+offset] != data[mirrorLine-1-offset]) {
                    continue outer;
                }
            }
            return mirrorLine
        }
    }
    return 0;
}

const testData = parse(testInput)
assert.equal(findMirrorLine(testData[0].rows), 0)
assert.equal(findMirrorLine(testData[0].cols), 5)
assert.equal(findMirrorLine(testData[1].rows), 4)
assert.equal(findMirrorLine(testData[1].cols), 0)

function summarize(sections) {
    return sum(sections.map(s => findMirrorLine(s.rows)*100 + findMirrorLine(s.cols)))
}

assert.equal(summarize(testData), 405)

const input = fs.readFileSync('./input.txt').toString();
const data = parse(input);
console.log('Part 1:', summarize(data))