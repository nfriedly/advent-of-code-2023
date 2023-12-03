import {readFileSync} from 'node:fs'
import assert from 'node:assert'
const input = readFileSync('./input.txt').toString();

function parseLine(line) {
    const [l,r] = line.split(':');
    const gameNum = parseInt(l.match(/\d+/), 10);
    const sets = r.split(';')
        .map(s => s.split(',')
            .map(c => c.match(/(\d+) (red|green|blue)/))
            .map(c => ({[c[2]]: parseInt(c[1], 10)}))
            .reduce((a,b) => ({...a, ...b}))
        )
    return {gameNum, sets}
}

function parse(input) {
    return input.split(/[\r\n]+/).map(parseLine)
}

function filterImpossible(games, max) {
    return games.filter(game => game.sets.every(set => 
        (set.red || 0) <= max.red && 
        (set.green || 0) <= max.green &&
        (set.blue || 0) <= max.blue
    ))
}

function sum(games) {
    return games.map(g => g.gameNum).reduce((a,b)=> a + b )
}

function part1() {
    const total = sum(filterImpossible(parse(input), {red:12, green:13, blue: 14}));
    console.log('Part 1:', total);
}

const testInput = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

assert.deepEqual(parseLine(testInput.split(/[\r\n]+/)[0]), {gameNum: 1, sets: [
    { blue:3, red:4 },
    { red: 1, green: 2, blue: 6 },
    { green: 2 } 
]})
//parse(testInput).map(game => console.log(game))

assert.deepEqual(filterImpossible(parse(testInput), {red:12, green:13, blue: 14}), [{
    gameNum: 1,
    sets: [ { blue: 3, red: 4 }, { red: 1, green: 2, blue: 6 }, { green: 2 } ]
  },
  {
    gameNum: 2,
    sets: [
      { blue: 1, green: 2 },
      { green: 3, blue: 4, red: 1 },
      { green: 1, blue: 1 }
    ]
  },
//   {
//     gameNum: 3,
//     sets: [
//       { green: 8, blue: 6, red: 20 },
//       { blue: 5, red: 4, green: 13 },
//       { green: 5, red: 1 }
//     ]
//   },
//   {
//     gameNum: 4,
//     sets: [
//       { green: 1, red: 3, blue: 6 },
//       { green: 3, red: 6 },
//       { green: 3, blue: 15, red: 14 }
//     ]
//   },
  {
    gameNum: 5,
    sets: [ { red: 6, blue: 1, green: 3 }, { blue: 2, red: 1, green: 2 } ]
  }]);

assert.equal(sum(filterImpossible(parse(testInput), {red:12, green:13, blue: 14})), 8)

part1()