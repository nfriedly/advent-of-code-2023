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

function parse(input) {
    return lines(input).map(parseLine)
}

function parseLine(line) {
    const [rawHand, rawBid] = line.split(' ');
    const hand = parseHand(rawHand);
    const bid = toNum(rawBid)
    return {
        ...hand,
        bid
    }
}

const cardVals = {
    A:14, K:13, Q: 12, J: 11, T: 10
}
function cardVal(c) {
    return cardVals[c] || toNum(c)
}

function parseHand(raw) {
    const cards = raw.split('').map(cardVal);
    const cardMap = _.countBy(cards)
    const cardCounts = Object.entries(cardMap)
        .map(([card, count]) => ([card, count]))
        .sort(([valA, countA], [valB, countB]) => countB-countA || valB-valA)
    const [primaryCard, primaryCount] = cardCounts[0];
    let type;
    switch (primaryCount) {
        case 5:
            type = types.Five_of_a_kind;
            break;
        case 4:
            type = types.Four_of_a_kind;
            break;
        case 3:
            type = cardCounts.length == 2 ? types.Full_house : types.Three_of_a_kind;
            break;
        case 2:
            type = cardCounts.length == 3 ? types.Two_pair : types.One_pair;
            break;
        default:
            type = types.High_card;
    }
    return {
        type,
        cards,
    }
}

assert.equal(cardVal('A'), 14)
assert.equal(cardVal('2'), 2)

assert.deepEqual(parseHand('AAAAA'), {
    type: types.Five_of_a_kind,
    cards: [14, 14, 14, 14, 14]
})

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