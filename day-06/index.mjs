import assert from "node:assert";
import {product} from "../utils.mjs";
/*
Sample:
Time:      7  15   30
Distance:  9  40  200

7-9
Winners: 2, 3, 4, or 5
Winners multiplied: 288

Challenge
Time:        63     78     94     68
Distance:   411   1274   2047   1035
*/
// [time, distance]
const testRaces = [[7,9], [15,40], [30,200]];
const races = [[63,411], [78,1274], [94,2047], [68, 1035]];

const distance = (totalTime, btnTime) => (totalTime - btnTime) * btnTime;
assert.equal(distance(7, 1), 6)
assert.equal(distance(7, 2), 10)

function winningBtnTimes(totalTime, minDistance) {
    const ret = [];
    for (let i=1; i<totalTime; i++) {
        const d = distance(totalTime, i);
        if (d>minDistance) {
            ret.push(i)
        }
    }
    return ret;
}

function margin(races) {
    return product(races.map(([totalTime, minDistance]) => winningBtnTimes(totalTime, minDistance).length));
}

assert.deepEqual(winningBtnTimes(7, 9), [2, 3, 4, 5])

assert.equal(margin(testRaces), 288)

console.log('Part 1:', margin(races))

// Part 2
const testTime = 71530;
const testDistance = 940200;

const minTime = (totalTime, distance) => Math.floor(0.5*(totalTime - Math.sqrt(totalTime*totalTime - 4*distance)))+1;
assert.equal(minTime(7, 9), 2)
assert.equal(minTime(15, 40), 4)
assert.equal(minTime(30, 200), 11)

const maxTime = (totalTime, distance) => Math.ceil(0.5*(totalTime + Math.sqrt(totalTime*totalTime - 4*distance)))-1;
assert.equal(maxTime(7, 9), 5)
assert.equal(maxTime(15, 40), 11)
assert.equal(maxTime(30, 200), 19)

const margin2 = (totalTime, distance) => maxTime(totalTime, distance) - minTime(totalTime, distance) + 1;
assert.equal(margin2(71530, 940200), 71503)

console.log('Part 2:', margin2(63789468, 411127420471035))