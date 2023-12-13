import assert from "node:assert";
import fs from 'node:fs'
import { lines, sum, toNum } from '../utils.mjs'
import _ from 'lodash';


// . = operational spring
// # = broken spring
// numbers are the sizes of each group of broken springs (#)
const testInput = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

function parse(input) {
    return lines(input).map(parseLine)
}

function parseLine(line) {
    const [left,right] = line.split(' ');
    return {
        springs: left.split(''),
        brokenCounts: right.split(',').map(toNum)
    }
}

assert.deepEqual(parseLine(lines(testInput)[0]), {
    springs: ['?','?','?','.','#','#','#'],
    brokenCounts: [1,1,3]
})

function pa(springs, brokenCounts) {
    //console.log('possibleArrangements', springs.join(''), brokenCounts.join(','))
    if (brokenCounts.length == 0) {
        //if (!springs.includes('#')) console.log('success!')
        return springs.includes('#') ? 0 : 1;
    }
    if (sum(brokenCounts) > springs.filter(s => s!='.').length) return 0;
    const next = springs[0];
    if (next == '.') return consumeDots(springs, brokenCounts);
    if (next == '#') return consumeHashes(springs, brokenCounts);
    if (next == '?') {
        return consumeDots(springs, brokenCounts) + consumeHashes(springs, brokenCounts);
    }
}

const possibleArrangements = _.memoize(pa, (springs, brokenCounts) => `${springs.join('')} ${brokenCounts.join(',')}`)

function consumeDots(springs, brokenCounts) {
    //console.log('consumeDots', springs.join(''), brokenCounts.join(','))
    // treat 0 as a dot, even if it's a ?
    let consume = 1;
    for(; consume<springs.length; consume++) {
        if (springs[consume] != '.') {
            break
        }
    }
    return possibleArrangements(springs.slice(consume), brokenCounts) 
}

function consumeHashes(springs, brokenCounts) {
    //console.log('consumeHashes', springs.join(''), brokenCounts.join(','))
    const count = brokenCounts[0];
    for(let i=0; i<count; i++) {
        // either . or ? for the next stretch
        if (springs[i] == '.') {
            return 0;
        }
    }
    const next = springs[count];
    // and the stretch doesn't have another # at the end
    if (next == '#') {
        return 0;
    }

    // if the next one is a ?, require it to be treated as a .
    if (next == '?' || next == '.') {
        return consumeDots(springs.slice(count), brokenCounts.slice(1))
    }

    // end of string
    return possibleArrangements(springs.slice(count), brokenCounts.slice(1))
}

const testData = parse(testInput);

assert.equal(possibleArrangements(testData[0].springs, testData[0].brokenCounts), 1)
assert.equal(possibleArrangements(testData[1].springs, testData[1].brokenCounts), 4)

function sumPossibles(lines) {
    return sum(lines.map(l => possibleArrangements(l.springs, l.brokenCounts)))
}

assert.equal(sumPossibles(testData), 21)

const input = fs.readFileSync('./input.txt').toString()
console.log('Part 1:', sumPossibles(parse(input)))

function unfoldParse(input) {
    return lines(input).map(unfoldParseLine)
}
function unfoldParseLine(line) {
    const [left,right] = line.split(' ');
    return {
        springs: new Array(5).fill(left).join('?').split(''),
        brokenCounts: new Array(5).fill(right).join(',').split(',').map(toNum)
    }
}

assert.deepEqual(unfoldParseLine('.# 1'), parseLine('.#?.#?.#?.#?.# 1,1,1,1,1'))

console.log('Part 2:', sumPossibles(unfoldParse(input)))