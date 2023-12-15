import assert, { AssertionError } from "node:assert";
import fs from 'node:fs'
import { toRows, printMap, fromRows } from '../utils.mjs'
import _ from 'lodash';

const testInput = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

function tiltN(rows) {
    const height = rows.length;
    const width = rows[0].length;
    for(let x=0; x<width; x++) {
        let prev = -1
        for(let y=0; y<height; y++) {
            const type = rows[y][x];
            if(type == 'O') {
                const newPos = ++prev;
                if (newPos == y) continue;
                assert.equal(rows[newPos][x], '.', `moving O from (${y},${x}) to (${newPos},${x}) in ${fromRows(rows)}}`)
                rows[newPos][x] = 'O'
                rows[y][x] = '.'
            } else if(type == '#') {
                prev = y;
            }
        }
    }
    return rows;
}

function tiltS(rows) {
    const height = rows.length;
    const width = rows[0].length;
    for(let x=0; x<width; x++) {
        let prev = height;
        for(let y=height-1; y>=0; y--) {
            const type = rows[y][x];
            if(type == 'O') {
                const newPos = --prev;
                if (newPos == y) continue;
                assert.equal(rows[newPos][x], '.', `moving O from (${y},${x}) to (${newPos},${x}) in ${fromRows(rows)}}`)
                rows[newPos][x] = 'O'
                rows[y][x] = '.'
            } else if(type == '#') {
                prev = y;
            }
        }
    }
    return rows;
}

function tiltW(rows) {
    rows.forEach(row => {
        let prev = -1;
        row.forEach((type,i) => {
            if(type == 'O') {
                const newPos = ++prev;
                if (newPos == i) return;
                assert.equal(row[newPos], '.', `moving O from ${i} to ${newPos} in ${row.join('')}`)
                row[newPos] = 'O'
                row[i] = '.'
            } else if(type == '#') {
                prev = i;
            }
        })
    })
    return rows
}

function tiltE(rows) {
    rows.forEach(row => {
        let prev = -1;
        row.reverse()
        row.forEach((type,i) => {
            if(type == 'O') {
                const newPos = ++prev;
                if (newPos == i) return;
                assert.equal(row[newPos], '.', `moving O from ${i} to ${newPos} in ${row.join('')}`)
                row[newPos] = 'O'
                row[i] = '.'
            } else if(type == '#') {
                prev = i;
            }
        })
        row.reverse()
    })
    return rows
}

// console.log(testInput,'\n\n');
// printMap(tiltS(toRows(testInput)))


function calculateLoad(rows) {
    const height = rows.length;
    let load = 0;
    for(let y=0; y<height; y++) {
        load += rows[y].filter(t => t=='O').length * (height-y)
    }
    return load;
}

assert.equal(calculateLoad(tiltN(toRows(testInput), 'north')), 136)

const input = fs.readFileSync('./input.txt').toString()
console.log('Part 1:', calculateLoad(tiltN(toRows((input)))))


function spinOnce(rows) {
    tiltN(rows);
    tiltW(rows);
    tiltS(rows);
    tiltE(rows);
    return rows
}

function spinMulti(rows, times) {
    const history = [];
    let cycleLength = -1;
    for(let i=0;i<Math.min(times, 1000);i++) {
        spinOnce(rows)
        const result = fromRows(rows);
        //console.log('\n',i,'\n'+result)
        if (history.includes(result)) {
            const cycleStart = history.indexOf(result);
            cycleLength = i - cycleStart;
            const remainingTimes = (times-i)%cycleLength
            //console.log('cycle found starting at', {cycleStart, i, repeatsAfter: cycleLength, remainingTimes, times})
            return toRows(history[cycleStart+remainingTimes-1])
        }
        history.push(result)
    }
    return rows
}

function spinMultiDumb(rows, times) {
    for(let i=0;i<times;i++) {
        spinOnce(rows)
    }
    return rows
}

assert.equal(fromRows(spinOnce(toRows(testInput))), `.....#....
....#...O#
...OO##...
.OO#......
.....OOO#.
.O#...O#.#
....O#....
......OOOO
#...O###..
#..OO#....`);

assert.equal(fromRows(spinMulti(toRows(testInput), 2)),
`.....#....
....#...O#
.....##...
..O#......
.....OOO#.
.O#...O#.#
....O#...O
.......OOO
#..OO###..
#.OOO#...O`)

assert.equal(fromRows(spinMulti(toRows(testInput), 3)),
`.....#....
....#...O#
.....##...
..O#......
.....OOO#.
.O#...O#.#
....O#...O
.......OOO
#...O###.O
#.OOO#...O`)

assert.equal(fromRows(spinMulti(toRows(testInput), 11)), fromRows(spinMultiDumb(toRows(testInput), 11)))


assert.equal(calculateLoad(spinMulti(toRows(testInput), 1000000000)), 64)

console.log('Part 2', calculateLoad(spinMulti(toRows(input), 1000000000)))
