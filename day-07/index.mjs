import assert from 'node:assert'
import fs from 'node:fs'
import {lines, toNum} from '../utils.mjs'
import _ from 'lodash'

const input = fs.readFileSync('./input.txt').toString();

const types = {
    "High_card": 1,
    "One_pair": 2, 
    "Two_pair": 3,
    "Three_of_a_kind": 4, 
    "Full_house": 5,
    "Four_of_a_kind": 6,
    "Five_of_a_kind": 7,
}

function parse(input, joker=false) {
    return lines(input).map(l => parseLine(l, joker))
}

function parseLine(line, joker=false) {
    const [rawHand, rawBid] = line.split(' ');
    const cards = rawHand.split('').map(c => cardVal(c, joker));
    const type = getType(cards);
    const bid = toNum(rawBid)
    return {
        type,
        cards,
        bid
    }
}

const cardVals = {
    A:14, K:13, Q: 12, J: 11, T: 10
}
function cardVal(c, joker=false) {
    if (joker && c === 'J') return 1;
    return cardVals[c] || toNum(c);
}

function getType(cards) {
    const cardMap = _.countBy(cards)
    const jokers = cardMap[1] ?? 0;
    const cardCounts = Object.entries(cardMap)
        .map(([card, count]) => ([card, count]))
        .sort(([valA, countA], [valB, countB]) => countB-countA || valB-valA)
    let [primaryCard, primaryCount] = cardCounts[0];
    if (jokers && primaryCount < 5) {
        primaryCount += (primaryCard == 1 ? cardCounts[1][1] : jokers)
    }
    let type;
    switch (primaryCount) {
        case 5:
            return types.Five_of_a_kind;
        case 4:
            return types.Four_of_a_kind;
        case 3:
            if (jokers == 1 && cardCounts.length === 3) { return types.Full_house; s}
            return type = cardCounts.length == 2 ? types.Full_house : types.Three_of_a_kind;
        case 2:
            return cardCounts.length == 3 ? types.Two_pair : types.One_pair;
        default:
            return types.High_card;
    }
}

assert.equal(cardVal('A'), 14)
assert.equal(cardVal('2'), 2)

assert.equal(getType([3,3,3,3,3]), types.Five_of_a_kind)

assert.deepEqual(parseLine('32T3K 765'), {
    type: types.One_pair,
    cards: [3, 2, 10, 3, 13],
    bid: 765
})

function compareHands(a,b) {
    const typeDiff = a.type - b.type;
    if (typeDiff != 0) {
        return typeDiff;
    }
    for(let i=0; i<a.cards.length; i++) {
        const diff = a.cards[i] - b.cards[i]
        if (diff != 0) {
            return diff;
        }
    }
    return 0
}

function rankHands(hands) {
    return hands.sort(compareHands)
}

const testInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

assert.deepEqual(parse(testInput), [
    { type: 2, cards: [ 3, 2, 10, 3, 13 ], bid: 765 },
    { type: 4, cards: [ 10, 5, 5, 11, 5 ], bid: 684 },
    { type: 3, cards: [ 13, 13, 6, 7, 7 ], bid: 28 },
    { type: 3, cards: [ 13, 10, 11, 11, 10 ], bid: 220 },
    { type: 4, cards: [ 12, 12, 12, 11, 14 ], bid: 483 }
  ]);

assert.deepEqual(rankHands(parse(testInput)), [
    { type: 2, cards: [ 3, 2, 10, 3, 13 ], bid: 765 },
    { type: 3, cards: [ 13, 10, 11, 11, 10 ], bid: 220 },
    { type: 3, cards: [ 13, 13, 6, 7, 7 ], bid: 28 },
    { type: 4, cards: [ 10, 5, 5, 11, 5 ], bid: 684 },
    { type: 4, cards: [ 12, 12, 12, 11, 14 ], bid: 483 }
  ]);

function scoreHands(hands) {
    const ranked = rankHands(hands)
    let score = 0
    for (let i = 0; i<hands.length; i++) {
        score += hands[i].bid * (i+1)
    }
    return score
}

assert.equal(scoreHands(parse(testInput)), 6440)

console.log('Part 1:', scoreHands(parse(input)))

assert.equal(scoreHands(parse(testInput, true)), 5905)

assert.equal(getType([1,1,1,1,1]), types.Five_of_a_kind)
assert.equal(getType([1,1,1,1,2]), types.Five_of_a_kind)
assert.equal(getType([2,2,2,2,1]), types.Five_of_a_kind)

assert.equal(getType([3,3,3,2,4]), types.Three_of_a_kind)
assert.equal(getType([3,3,3,2,2]), types.Full_house)
assert.equal(getType([2,2,3,3,1]), types.Full_house)
assert.equal(getType([3,3,3,2,1]), types.Four_of_a_kind)
assert.equal(getType([2,3,1,1,1]), types.Four_of_a_kind)


assert.equal(getType([3,3,4,2,1]), types.Three_of_a_kind)
assert.equal(getType([3,5,4,2,1]), types.One_pair)

// https://www.reddit.com/r/adventofcode/comments/18cr4xr/2023_day_7_better_example_input_not_a_spoiler/
const testInput2 = `2345A 1
Q2KJJ 13
Q2Q2Q 19
T3T3J 17
T3Q33 11
2345J 3
J345A 2
32T3K 5
T55J5 29
KK677 7
KTJJT 34
QQQJA 31
JJJJJ 37
JAAAA 43
AAAAJ 59
AAAAA 61
2AAAA 23
2JJJJ 53
JJJJ2 41`

assert.deepEqual(rankHands(parse(testInput2, true)), parse(`2345A 1
J345A 2
2345J 3
32T3K 5
KK677 7
T3Q33 11
Q2KJJ 13
T3T3J 17
Q2Q2Q 19
2AAAA 23
T55J5 29
QQQJA 31
KTJJT 34
JJJJJ 37
JJJJ2 41
JAAAA 43
2JJJJ 53
AAAAJ 59
AAAAA 61`, true))

assert.equal(scoreHands(parse(testInput2, true)), 6839)

console.log('Part 2:', scoreHands(parse(input, true)))