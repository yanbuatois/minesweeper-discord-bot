const numbers = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  mine: 'bomb',
};
module.exports = {
  numbers,
  testNumberMine(mine) {
    if(mine.isMine) {
      return numbers.mine;
    }
    return numbers[mine.numAdjacentMines];
  },
};