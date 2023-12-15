export const lines = str => str.trim().split(/[\r\n]+/);
export const toRows = str => lines(str).map(row => row.split(''))
export const toColumns = str => {
    const rows = toRows(str);
    const cols = new Array(rows[0].length).fill(null).map(_ => [])
    rows.forEach((row,i) => {
        row.forEach((c, j) => {
            cols[j][i] = c
        })
    });
    return cols;
}
export const sections = input => input.replaceAll('\r', '').split(/\n\n/)
export const add = (a,b) => a+b;
export const sum = arr => arr.reduce(add);
export const intersection = (a,b) => a.filter(a => b.includes(a));
export const toNum = n => parseInt(n, 10);
export const min = nums => nums.reduce((a,b) => Math.min(a,b));
export const product = nums => nums.reduce((a,b) => a*b);
export const charMap = toRows;
export const fromRows = (data) => data.map(r => r.join('')).join('\n')
export const printMap = (data) => console.log('\n'+fromRows(data)+'\n')