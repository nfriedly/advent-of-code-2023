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