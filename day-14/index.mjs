import assert, { AssertionError } from "node:assert";
import fs from 'node:fs'
import { toColumns as parse, sum } from '../utils.mjs'
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

function calculateColLoad(col) {
    //console.log('calculating', col)
    let load = 0;
    let row = -1;
    const max = col.length;
    col.forEach((type,i) => {
        if(type == 'O') {
            const newPos = ++row;
            load += (max - newPos)
            //console.log(`O at ${i} adds ${max-newPos}`)
        } else if(type == '#') {
            row = i;
        }
    })
    //console.log('col total:', load)
    return load;
}



function calculateLoad(cols) {
    return sum(cols.map(calculateColLoad))
}

assert.equal(calculateLoad(parse(testInput)), 136)

const input = fs.readFileSync('./input.txt').toString()
console.log('Part 1:', calculateLoad(parse(input)))