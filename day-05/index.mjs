import assert from "node:assert";
import {lines, toNum} from '../utils.mjs';
import {readFileSync} from 'node:fs'
const input = readFileSync('./input.txt').toString();

const testInput = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

function parse(input) {
    const sections = input.replaceAll('\r', '').split(/\n\n/);
    const seeds = parseSeeds(sections.shift());
    const maps = sections.map(parseMap);
    return {
        seeds,
        maps
    }
}

function parseSeeds(str) {
    return str.match(/\d+/g).map(toNum)
}

assert.deepEqual(parseSeeds(lines(testInput)[0]), [79, 14, 55, 13])

function parseMap(str) {
    const parts = lines(str);
    const [from, to] = parts.shift().split(' ')[0].split('-to-');
    const ranges = parts.map(parseRange);
    // ranges.from = from;
    // ranges.to = to;
    return ranges;
}

function parseRange(str) {
    const [destination, source, length] = str.split(' ').map(toNum);
    return {
        destination,
        source,
        length
    }
}

assert.deepEqual(parseRange('50 98 2'), {destination: 50, source: 98, length: 2})

assert.deepEqual(parse(`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48`), {
    seeds: [ 79, 14, 55, 13 ],
    maps: [ [
        { destination: 50, source: 98, length: 2 },
        { destination: 52, source: 50, length: 48 },
        // from: 'seed',
        // to: 'soil'
      ]
    ]
 })

 function applyMap(seed, ranges) {
    const mapping = ranges.find(r => seed >= r.source && seed <= r.source + r.length)
    if (!mapping) {
        return seed
    }
    const seedOffset = seed - mapping.source;
    return mapping.destination + seedOffset;
 }

 const testSoilMap = [
    { destination: 50, source: 98, length: 2 },
    { destination: 52, source: 50, length: 48 }
  ]
 assert.equal(applyMap(98, testSoilMap), 50)
 assert.equal(applyMap(99, testSoilMap), 51)
 assert.equal(applyMap(53, testSoilMap), 55)
 assert.equal(applyMap(1, testSoilMap), 1)

 function applyMaps(seed, maps) {
    return maps.reduce((seed, ranges) => applyMap(seed, ranges), seed)
 }

 assert.equal(applyMaps(53, [testSoilMap]), 55)
 const testData = parse(testInput);
 assert.equal(applyMaps(79, testData.maps), 82)

 function mapAll(input) {
    const data = parse(input);
    return data.seeds.map(s => applyMaps(s, data.maps))
 }

 assert.deepEqual(mapAll(testInput), [82,43,86,35])

 function lowestLocation(input) {
    return mapAll(input).reduce((a,b) => Math.min(a,b))
 }

 assert.equal(lowestLocation(testInput), 35)

 console.log('Part 1:', lowestLocation(input))
