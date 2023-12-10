import assert from "node:assert";
import fs from 'node:fs'
import { add, lines, toNum } from '../utils.mjs'

const input = fs.readFileSync('./input.txt').toString();

// 4
const testInput1 = `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`

// 8
const testInput2 = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`

function parse(input) {
    return lines(input).map(l => l.split(''))
}

// const dirMap = {
//     '|' is a vertical pipe connecting north and south.
//     - is a horizontal pipe connecting east and west.
//     L is a 90-degree bend connecting north and east.
//     J is a 90-degree bend connecting north and west.
//     7 is a 90-degree bend connecting south and west.
//     F is a 90-degree bend connecting south and east.
// }


function findS(data) { // [y,x] starting from top left
    for(let y=0; y<data.length; y++) {
        const row = data[y];
        for(let x=0; x<row.length; x++) {
            if(row[x] == 'S') {
                return [y,x];
            }
        }
    }

    return [s, next]
}

const testData1 = parse(testInput1);
const testData2 = parse(testInput2);

assert.deepEqual(findS(testData1), [1,1]);
assert.deepEqual(findS(testData2), [2,0])

function findFirstMove(S, data) {
    const [y,x] = S;
    // north
    if (['|', '7', 'F'].includes(data[y-1]?.[x])){
        return [y-1, x];
    }
    // east
    if (['-','J','7'].includes(data[y][x+1])) {

        return [y, x+1];
    }
    // south
    if (['|', 'L', 'J'].includes(data[y+1]?.[x])) {
        return [y+1, x]
    }

    // there should be two exits.
    // So, if we've checked 3 sides and not found 1, bail out
    console.error({N: data[y-1]?.[x], E: data[y][x+1], S: data[y+1]?.[x]})
    throw new Error('unable to find first move', S)
}

assert.deepEqual(findFirstMove([1,1], testData1), [1,2])
assert.deepEqual(findFirstMove([2,0], testData2), [2,1])

function findNext(prev, cur, data) {
    const [py,px] = prev;
    const [cy, cx] = cur;
    const curLetter = data[cy][cx];
    switch (curLetter) {
        case '|':
            return py == cy-1 ? [cy+1, cx] : [cy-1, cx];
        case '-':
            return px == cx-1 ? [cy, cx+1] : [cy, cx-1];
        case 'L':
            return py == cy-1 ? [cy, cx+1] : [cy-1, cx];
        case 'J':
            return py == cy-1 ? [cy, cx-1] : [cy-1, cx];
        case '7':
            return py == cy+1 ? [cy, cx-1] : [cy+1, cx];
        case 'F':
            return px == cx+1 ? [cy+1, cx] : [cy, cx+1];
    }
    console.error({prev, cur, curLetter: data[cy][cx]})
    throw new Error(`Ut-oh`)
}

assert.deepEqual(findNext([1,1], [1,2], testData1), [1,3])
assert.deepEqual(findNext([2,0], [2,1], testData2), [1,1])

function findFarthestDistance(data) {
    const start = findS(data);
    let prev = start;
    let cur = findFirstMove(start, data);
    let count = 1;
    while(!(cur[0] == start[0] && cur[1] == start[1])) {
        //console.log({start, prev, cur, count})
        const next = findNext(prev, cur, data);
        prev = cur;
        cur = next;
        count++;
    }
    return count/2
}

assert.equal(findFarthestDistance(testData1), 4)

assert.equal(findFarthestDistance(testData2), 8)

const data = parse(input);
// logs 6808, which is apparently too low
console.log('Part 1:', findFarthestDistance(data))