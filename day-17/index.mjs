import assert from "node:assert";
import fs from 'node:fs'
import { printMap, printMaps, sum, toRows, toRowsNum } from '../utils.mjs'
//import _ from 'lodash';
import MinHeap from 'min-heap'

const testInput = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

const testExpected = `2>>34^>>>1323
32v>>>35v5623
32552456v>>54
3446585845v52
4546657867v>6
14385987984v4
44578769877v6
36378779796v>
465496798688v
456467998645v
12246868655<v
25465488877v5
43226746555v>`;

const N = 'n';
const S = 's';
const E = 'e';
const W = 'w';

const V = 'v';
const H = 'H';

const opposite = {
    [N]: S,
    [S]: N,
    [E]: W,
    [W]: E,
    [V]: H,
    [H]: V
};


function direction(from,to) {
    if (!from || !to || from == to) return null;
    if (from.x == to.x) {
        return from.y > to.y ? N : S;
    }
    return from.x > to.x ? W : E;
}

function vh(from,to) {
    if (!from || !to || from == to) return '';
    if (from.x == to.x && from.y != to.y) {
        return V;
    }
    if (from.y == to.y && from.x != to.x) {
        return H
    }
    return V+H; 
}

class Point {
    constructor(y,x,cost,vh) {
        this.y = y;
        this.x = x;
        this.cost = cost;
        this.vh = vh;
    }
    toString() {
        return `${this.y},${this.x},${this.vh}`;
    }
    idFrom(from) {
        return `${this.y},${this.x}${vh(from, this)}`;
    }
}

function constructPath(point, cameFrom) {
    const path = [point];
    while( cameFrom[point] || cameFrom.has?.(point)) {
        point = cameFrom[point] || cameFrom.get?.(point)
        path.unshift(point)
    }
    return path;
}

function between(from, to) {
    assert(from && to && (from.y == to.y || from.x == to.x))
    const nodes = [];
    const dir = direction(from,to);
    if (dir == N || dir == S) {
        const step = dir == N ? -1 : 1;
        for(let y=from.y + step; y != to.y; y += step) {
            nodes.push([y,to.x])
        }
    }
    if (dir == E || dir == W) {
        const step = dir == W ? -1 : 1;
        for(let x=from.x + step; x != to.x; x += step) {
            nodes.push([to.y,x])
        }
    }
    return nodes;
}

function dijkstra(graph, [sourcev, sourceh], mindist, maxdist) {
    const dist = {};
    const prev = {};
    const q = new MinHeap((l,r) => (dist[l]??Infinity) - (dist[r]??Infinity))
    Object.values(graph).forEach(p => q.insert(p))
    dist[sourcev] = 0;
    dist[sourceh] = 0;

    while(q.size) {
        const current = q.removeHead()
        //console.log('Processing', current);

        // calculate the cost
        const curCost = (dist[current]??Infinity);
        //assert.notEqual(curCost, Infinity, `infinite cost node at ${current}`);

        const {x,y} = current;
        const neighbors = [];

        // neighbors are either horizontal or vertical
        const h = current.vh == V ? 1 : 0;
        const v = current.vh == H ? 1 : 0;
        assert.notEqual(h,v);
        for (let i=mindist; i<=maxdist; i++){
            neighbors.push([y-(v*i), x-(h*i)], [y+(v*i), x+(h*i)])
        }
        assert(neighbors.length);

        neighbors.map(([y,x]) => graph[`${y},${x},${opposite[current.vh]}`]) // convert to points
        .filter(n => n) // remove off-the-map points (undefined)
        .forEach(neighbor => {
            const curBest = (dist[neighbor]??Infinity);
            let cost = curCost + neighbor.cost;

            // if we moved multiple spaces, count the cost of each
            between(current, neighbor)
                .map(([y,x]) => graph[`${y},${x},${opposite[current.vh]}`])
                .forEach(p => cost += p.cost);

            if (cost < curBest) {
                if (neighbor.x == 140 && neighbor.y == 140) console.log('new best:', cost)
                // removing and re-inserting is the only way to re-sort
                q.remove(neighbor);
                dist[neighbor] = cost;
                prev[neighbor] = current;
                q.insert(neighbor);
            }
        })
    }
    return {dist, prev}
}

function toPointGraph(input){
    const costs = toRowsNum(input)
    const graph = {};

    costs.forEach((row,y) => row.forEach((cost, x) => {
        const p = new Point(y,x,cost,V);
        graph[p] = p;
        const p2 = new Point(y,x,cost,H);
        graph[p2] = p2;
    }))
    return graph;
}

function shortestPath(input, mindist=1, maxdist=3) {
    const graph = toPointGraph(input);
    const {dist, prev} = dijkstra(graph, [graph['0,0,v'], graph['0,0,h']], mindist, maxdist);

    const keys = Object.keys(graph);
    const goals = [graph[keys.pop()], graph[keys.pop()]];
    const dist0 = dist[goals[0]];
    const dist1 = dist[goals[1]];
    const goal = dist0<dist1 ? goals[0] : goals[1];
    console.log('distance to goal', {dist0, dist1, goal})

    const path = constructPath(goal, prev);
    //console.log(path)
    const map = plot(input, path);
    if (input == testInput) {
        printMaps(toRows(input), map, toRows(testExpected))
    } else {
        //printMap(map)
    }

    return dist[goal]
}

const dirIcon = {
    [N]: '^',
    [S]: 'v',
    [E]: '>',
    [W]: '<',
}

function plot(input, path) {
    const map = toRows(input)
    let prev = path.shift()
    path.forEach(p => {
        const dir = direction(prev,p);
        const icon = dirIcon[dir];
        map[p.y][p.x] = icon;
        between(prev,p).forEach(([y,x]) => map[y][x] = icon);
        prev = p;
    })
    return map;
}

assert.equal(shortestPath(testInput), 102)

const input = fs.readFileSync('./input.txt').toString();
console.log('Part 1:', shortestPath(input)) // 695, should be 694

// Part 2 should be 829
console.log('Part 2:', shortestPath(input, 4, 10)) // 829, correct
