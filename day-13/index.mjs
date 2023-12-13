import assert, { AssertionError } from "node:assert";
import fs from 'node:fs'
import { toColumns, toRows, sections, sum } from '../utils.mjs'
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
        rows: toRows(section), 
        cols: toColumns(section)})
    );
}

assert.deepEqual(parse('12\n34'), [{
    rows: [['1','2'], ['3','4']],
    cols: [['1','3'], ['2','4']]
}])

function diff(rowa, rowb) {
    let differences = 0;
    rowa.forEach((a,i) => {
        if (a != rowb[i]) {
            differences++;
        }
    });
    return differences;
}

assert.equal(diff(['.','#','.'], ['.','#','.']), 0)
assert.equal(diff(['.','#','.'], ['.','#','.']), 0)
assert.equal(diff(['.','#','.'], ['.','#','#']), 1)
assert.equal(diff(['.','#','.'], ['.','#','#']), 1)
assert.equal(diff(['.','#','.'], ['#','#','#']), 2)

// returns the index of the row or column just after the mirror line
function findMirrorLine(data, smudges=0) {
    // start at the second line
    const len = data.length;
    outer: for(let mirrorLine=1; mirrorLine<len; mirrorLine++) {
        let differences = diff(data[mirrorLine-1], data[mirrorLine]);
        if (differences <= smudges) {
            // iterate outwards until reaching the end of the array
            const distance = Math.min(mirrorLine, len-mirrorLine)
            for (let offset=1; offset<distance; offset++) {
                differences += diff(data[mirrorLine+offset], data[mirrorLine-1-offset])
                if (differences > smudges) {
                    continue outer;
                }
            }
            if (differences == smudges) return mirrorLine
        }
    }
    return 0;
}

const testData = parse(testInput)
assert.equal(findMirrorLine(testData[0].rows), 0)
assert.equal(findMirrorLine(testData[0].cols), 5)
assert.equal(findMirrorLine(testData[1].rows), 4)
assert.equal(findMirrorLine(testData[1].cols), 0)

function summarize(sections, smudges=0) {
    return sum(sections.map(s => findMirrorLine(s.rows, smudges)*100 + findMirrorLine(s.cols, smudges)))
}

assert.equal(summarize(testData), 405)

const input = fs.readFileSync('./input.txt').toString();
const data = parse(input);
console.log('Part 1:', summarize(data))

assert.equal(findMirrorLine(testData[0].rows, 1), 3)
assert.equal(findMirrorLine(testData[0].cols, 1), 0)
assert.equal(findMirrorLine(testData[1].rows, 1), 1)
assert.equal(findMirrorLine(testData[1].cols, 1), 0)

console.log('Part 1:', summarize(data, 1))