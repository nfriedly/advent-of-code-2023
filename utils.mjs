export const lines = str => str.trim().split(/[\r\n]+/)
export const add = (a,b) => a+b
export const sum = arr => arr.reduce(add)
export const intersection = (a,b) => a.filter(a => b.includes(a))