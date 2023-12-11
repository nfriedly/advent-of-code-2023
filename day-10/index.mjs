import assert from "node:assert";
import fs from 'node:fs'
import { charMap as parse, printMap } from '../utils.mjs'

const input = fs.readFileSync('./input.txt').toString();

// furthest distance is 4
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

function findPath(data) {
    const start = findS(data);
    let prev = start;
    let cur = findFirstMove(start, data);
    let path = [prev]
    while(!(cur[0] == start[0] && cur[1] == start[1])) {
        path.push(cur)
        const next = findNext(prev, cur, data);
        prev = cur;
        cur = next;
    }
    return path
}

function findFarthestDistance(data) {
    return findPath(data).length/2
}

assert.equal(findFarthestDistance(testData1), 4)

assert.equal(findFarthestDistance(testData2), 8)

const data = parse(input);
console.log('Part 1:', findFarthestDistance(data))

// 4 enclosed
const testInput3 = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`

// 4
const testInput4 = `...........
.S-------7.
.|F-----7|.
.||OOOOO||.
.||OOOOO||.
.|L-7OF-J|.
.|II|O|II|.
.L--JOL--J.
.....O.....`

// 8
const testInput5 = `OF----7F7F7F7F-7OOOO
O|F--7||||||||FJOOOO
O||OFJ||||||||L7OOOO
FJL7L7LJLJ||LJIL-7OO
L--JOL7IIILJS7F-7L7O
OOOOF-JIIF7FJ|L7L7L7
OOOOL7IF7||L7|IL7L7|
OOOOO|FJLJ|FJ|F7|OLJ
OOOOFJL-7O||O||||OOO
OOOOL---JOLJOLJLJOOO` 

// 10
const testInput6 = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`

function contains(path, y, x) {
    return path.some(([py,px]) => py == y && px == x)
}

assert(contains([[1,1], [1,2]], 1, 2))
assert(!contains([[1,1], [1,2]], 1, 0))

function countInsides(data) {
    const path = findPath(data);

    // overwrite S with the proper value for the ray tracer below
    const S = path[0]
    data[S[0]][S[1]] = realS(path)

    // point in polygon for each point in the grid
    // just cast in all points in the same direction for now
    let count = 0;
    for(let y=0; y<data.length; y++) {
        const row = data[y]
        for(let x=0; x<row.length; x++) {
            // don't bother for points that are on the path
            // todo: handle rays that are parallel with the path
            if (contains(path, y, x)) continue;
            let crosses = 0;
            let enteredFrom = null;
            for (let tx=x; tx<row.length; tx++) {
                let val = data[y][tx];
                if (contains(path, y, tx) && val != '-') {
                    if (val == 'F' || val == 'L') {
                        enteredFrom = val
                        continue;
                    } else if (
                        (val == '7' && enteredFrom == 'F') || 
                        (val == 'J' && enteredFrom == 'L')
                    ) {
                        // didn't actually cross the line, just ran along it a bit
                        enteredFrom = null;
                        continue;
                    }
                    crosses++;
                }
            }
            data[y][x] = crosses;
            if (crosses % 2 == 1) count++
        }
    }
    return count;
}

//     '|' is a vertical pipe connecting north and south.
//     - is a horizontal pipe connecting east and west.
//     L is a 90-degree bend connecting north and east.
//     J is a 90-degree bend connecting north and west.
//     7 is a 90-degree bend connecting south and west.
//     F is a 90-degree bend connecting south and east.
function realS(path) {
    const [sy,sx] = path[0];
    const [py,px] = path[path.length-1];
    const [ny,nx] = path[1];

    // s = [1,1]
    // n = [1,2]
    // p = [2,1]
    const dirs = [];
    if (px == sx) {
        dirs.push(py > sy ? 'S' : 'N')
    } else if (sy == py) {
        dirs.push(px > sx ? 'W' : 'E')
    } else {
        throw `Bad previous / start match: [${py},${px}] / [${sy},${sx}]`
    }

    if (nx == sx) {
        dirs.push(ny > sy ? 'S' : 'N')
    } else if (ny == sy) {
        dirs.push(nx > sx ? 'E' : 'W')
    } else {
        throw 'Bad start / next match'
    }

    assert.notEqual(dirs[0], dirs[1])

    const [a,b] = dirs.sort() // E,N,S,W

    if (a == 'N' && b == 'S') {
        return '|'
    }
    if (a == 'E' && b == 'W') {
        return '-'
    }
    if (a == 'E' && b == 'N') {
        return 'L'
    }
    if (a == 'N' && B == 'W') {
        return 'J'
    }
    if (a == 'S' && b == 'W') {
        return '7'
    } if (a == 'E' && b == 'S') {
        return 'F'
    }
    throw `Unexpected dirs: ${a}, ${b}`
}


const testData3 = parse(testInput3);
let actual = countInsides(testData3);
printMap(testData3)
assert.equal(actual, 4);

console.log('Part 2:', countInsides(data))