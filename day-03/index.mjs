import {readFileSync} from 'node:fs'
import assert from 'node:assert'
const input = readFileSync('./input.txt').toString();

const testInput = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

function getPartNums(input) {
    const lines = input.split(/[\r\n]+/)
    let lastLine = "", line = "",  nextLine = lines[0];
    const partNums = [];
    for(let i = 0; i<lines.length; i++) {
        lastLine = line;
        line = nextLine;
        nextLine = lines[i+1] || "";
        const reNum = /\d+/g;
        let match;
        while(match = reNum.exec(line)) {
            const end = reNum.lastIndex - 1;
            const start = reNum.lastIndex - match[0].length
            if (
                (line[start-1] && line[start-1] != '.') ||
                (line[end+1] && line[end+1] != '.' ) ||
                (/[^0-9.]/.test(lastLine.substring(start - 1, end + 2))) || // end +2, because it's non-inclusive
                (/[^0-9.]/.test(nextLine.substring(start - 1, end + 2)))
            ) {
                partNums.push(parseInt(match[0], 10))
            }
        }
    }
    return partNums;
}

assert.deepEqual(getPartNums(testInput), [467, /*114,*/ 35, 633, 617, /*58,*/ 592, 755, 664, 598])

function sum(nums) {
    return nums.reduce((a,b) => a+b)
}

assert.equal(sum(getPartNums(testInput)), 4361)

console.log('Part 1:', sum(getPartNums(input)))

function getGearRatios(input) {
    const lines = input.split(/[\r\n]+/)
    let lastLine = "", line = "",  nextLine = lines[0];
    const potetials = {};
    const ratios = [];
    for(let i = 0; i<lines.length; i++) {
        lastLine = line;
        line = nextLine;
        nextLine = lines[i+1] || "";
        const reNum = /\d+/g;
        let match;
        while(match = reNum.exec(line)) {
            const end = reNum.lastIndex - 1;
            const start = reNum.lastIndex - match[0].length
            let x = 0, y = 0, found = false;
            if (line[start-1] == '*') {
                found = true;
                x=start-1;
                y=i;
            } else if (line[end+1] == '*' ) {
                found = true
                x = end+1;
                y = i;
            } else if (lastLine.substring(start - 1, end + 2).includes('*')){ // end +2, because it's non-inclusive
                found = true;
                x = lastLine.substring(start - 1, end + 2).indexOf('*') + Math.max(start - 1, 0);
                y = i - 1;
            } else if (nextLine.substring(start - 1, end + 2).includes('*')) {
                found = true;
                x = nextLine.substring(start - 1, end + 2).indexOf('*') + Math.max(start - 1, 0);
                y = i + 1;
            }
            
            if (found){
                const key = `${x},${y}`;
                if (potetials[key]) {
                    ratios.push(parseInt(match[0], 10) * potetials[key])
                } else {
                    potetials[key] = parseInt(match[0], 10)
                }
            }
        }
    }
    //console.log(potetials)
    return ratios;
}

assert.deepEqual(getGearRatios(testInput), [16345, 451490])
assert.deepEqual(sum(getGearRatios(testInput)), 467835)

console.log('Part 2:', sum(getGearRatios(input)))