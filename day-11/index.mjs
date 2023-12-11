import assert from "node:assert";
import fs from 'node:fs'
import { charMap as parse, printMap, sum } from '../utils.mjs'

const testInput = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`

const testInputExpanded = `....#........
.........#...
#............
.............
.............
........#....
.#...........
............#
.............
.............
.........#...
#....#.......`

function isEmpty(char) {
    return char == '.'
}


// parsing and expansion could both be more efficient, and expansion could be replaced with math
function expand(_image) {
    const image = _image.map(row => row.slice())

    // expand rows
    for(let i = 0; i<image.length; i++) {
        const row = image[i];
        if (row.every(isEmpty)) {
            //row.allEmpty = true;
            const clone = row.slice();
            //clone.allEmpty = true
            image.splice(i, 0, row.slice())
            i++; // don't process this row again
        }
    }
    // identify cols to expand
    const galaxyCols = image[0].slice().fill(false)
    for(let i = 0; i<image.length; i++) {
        const row = image[i]
        //if (row.allEmpty) continue;
        for(let j=0; j<row.length; j++) {
            if (row[j] == '#') {
                galaxyCols[j] = true;
            }
        }
    }
    // expand cols
    for(let i = 0; i<image.length; i++) {
        const row = image[i];
        // go backwards so that adding doesn't throw off the count
        // could have done that above... oh well.
        for(let j=galaxyCols.length-1; j>=0; j--) {
            if (!galaxyCols[j]) {
                row.splice(j,0,'.');
            }
        }
    }
    return image;
}

const testImage = parse(testInput);
const testImageExpanded = expand(testImage);
printMap(testImage)
printMap(testImageExpanded)

assert.deepEqual(testImageExpanded, parse(testInputExpanded))

function findGalaxies(image) {
    const galaxies = []; // list of [y,x] pairs counting from top-right
    for(let y = 0; y<image.length; y++) {
        const row = image[y]
        //if (row.allEmpty) continue;
        for(let x=0; x<row.length; x++) {
            if (row[x] == '#') {
                galaxies.push([y,x])
            }
        }
    }
    return galaxies;
}

assert.deepEqual(findGalaxies(parse(`.#
#.`)), [[0,1], [1,0]])

function sumDistances(galaxies) {
    let sum = 0;
    for(let i=0; i<galaxies.length; i++) {
        const [sy, sx] = galaxies[i];
        for(let j=i; j<galaxies.length; j++) { // start from j to avoid counting the distance in both directions
            const [dy, dx] = galaxies[j];
            sum += Math.abs(dy-sy) + Math.abs(dx-sx)
        }
    }
    return sum
}

assert.equal(sumDistances(findGalaxies(testImageExpanded)), 374)

const input = fs.readFileSync('./input.txt').toString()
const image = parse(input);
console.log('Part 1:', sumDistances(findGalaxies(expand(image))));

function findExpandGalaxies(image, factor=1000000) {
    const galaxies = findGalaxies(image)
    const hasGalaxyY = image.map(row => row.some(c => c === '#'))
    const hasGalaxyX = image[0].slice().fill(false);
    image.forEach(row => row.forEach((val, x) => {if (val == '#') hasGalaxyX[x]=true}))
    //console.log({galaxies, hasGalaxyY, hasGalaxyX})
    return galaxies.map(([oy, ox]) => {
        let expansionsY = hasGalaxyY.slice(0, oy).filter(hg => !hg).length;
        let expansionsX = hasGalaxyX.slice(0, ox).filter(hg => !hg).length;
        //console.log({oy, ox, expansionsY, expansionsX})
        return [oy - expansionsY + (expansionsY * factor), ox - expansionsX + (expansionsX * factor)]
    })    
}

//console.log(findGalaxies(testImageExpanded))
//console.log(findExpandGalaxies(testImage, 2))

assert.equal(sumDistances(findExpandGalaxies(testImage, 2)), 374)

console.log("Part 2:", sumDistances(findExpandGalaxies(image)))