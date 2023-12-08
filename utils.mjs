export const lines = str => str.trim().split(/[\r\n]+/);
export const sections = input => input.replaceAll('\r', '').split(/\n\n/)
export const add = (a,b) => a+b;
export const sum = arr => arr.reduce(add);
export const intersection = (a,b) => a.filter(a => b.includes(a));
export const toNum = n => parseInt(n, 10);
export const min = nums => nums.reduce((a,b) => Math.min(a,b));
export const product = nums => nums.reduce((a,b) => a*b);