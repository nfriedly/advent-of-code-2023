import assert, { AssertionError } from "node:assert";
import fs from 'node:fs'
import { toRows, printMap, fromRows } from '../utils.mjs'
import _ from 'lodash';

const testInput = fs.readFileSync('./test-input.txt').toString();

const id = (y,x,width) => y*width+x;

const N = 'north';
const S = 'south';
const E = 'east';
const W = 'west';

// \
const backslashDir = {
    [N]: W,
    [W]: N,
    [S]: E,
    [E]: S,
}

// /
const frontslashDir = {
    [N]: E,
    [E]: N,
    [S]: W,
    [W]: S,
}

const beamIcon = {
    [N]: '^',
    [S]: 'V',
    [E]: '>',
    [W]: '<',
}

function next(y, x, direction) {
    switch (direction) {
        case N:
            y--;
            break;
        case S:
            y++;
            break;
        case E:
            x++;
            break;
        case W:
            x--;
            break;
        default:
            throw new Error(`unexpected direction ${direction} from ${y},${x}`)
            break;
    }
    return [y,x];
}

class EnergyMap {
    energized = new Set()
    constructor(input) {
        this.map = toRows(input);
        this.beamMap = toRows(input);
        this.width = this.map[0].length;
    }

    id(y,x) {
        return x + y*this.width;
    }

    getEnergized() {
        // this.energized.add(this.id(0,0))
        // this.markBeam(0,0,E);
        return this.traceBeam(0,-1,E)
    }

    markBeam(y,x,dir) {
        const cur = this.beamMap[y][x];
        if(['|','-','\\','/'].includes(cur)) return;
        let icon = beamIcon[dir];
        if (cur == '.') {
            this.beamMap[y][x] = icon;
        }
        if (cur == icon) {
            // loop!
            return true;
        }
        if (typeof cur == 'number') {
            icon = ++cur;
            if (icon > 4) {
                throw new Error(`loop detected at ${y}, ${x}`)
            }
        }
        this.beamMap[y][x] = icon;
        return false;
    }

    traceBeam(fromY, fromX, direction) {
        let [y,x] = next(fromY,fromX, direction)
        //console.log('traceBeam', {fromY, fromX, direction, y,x})
        const tile = this.map[y]?.[x];
        if(!tile) {
            // off the map!
            return this.energized;
        }
        this.energized.add(this.id(y,x));
        const isLoop = this.markBeam(y,x,direction);
        if (isLoop) {
            return this.energized;
        }
        //printMap(this.beamMap)
        if (tile == '.' ||
            (tile == '-' && [E,W].includes(direction)) ||
            (tile == '|' && [N,S].includes(direction))
        ) {
            // keep moving straight
            return this.traceBeam(y,x, direction);
        } else if (tile == '\\') return this.traceBeam(y,x,backslashDir[direction]);
        else if (tile == '/') return this.traceBeam(y,x,frontslashDir[direction]);
        else if (tile == '-') {
            this.traceBeam(y,x,W);
            return this.traceBeam(y,x,E);
        } else if (tile == '|') {
            this.traceBeam(y,x,N);
            return this.traceBeam(y,x,S);
        }
        // shouldn't get this far
        throw `Unhandled tile(${tile}) & direction(${direction}) combo at ${y},${x} from ${fromY}, ${fromX}`
    }

    getEnergizedCount() {
        return this.getEnergized().size
    }
}

assert.equal((new EnergyMap(testInput)).getEnergizedCount(), 46);

const input = fs.readFileSync('./input.txt').toString();
const em = new EnergyMap(input)
console.log('Part 1:', em.getEnergizedCount());
//printMap(em.beamMap);
