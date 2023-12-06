import assert from "node:assert";
import {product} from "../utils.mjs";
/*
Sample:
Time:      7  15   30
Distance:  9  40  200
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