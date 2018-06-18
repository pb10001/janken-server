'use strict';
let assert = require('assert');
let util = require('./util');

//utilモジュールのテスト
describe('util', () => {
  describe('num2hand', () => {
    it('0: stone, 1: scissors, 2: paper, others: null', () => {
      assert.equal(util.num2hand(0), 'グー');
      assert.equal(util.num2hand(1), 'チョキ');
      assert.equal(util.num2hand(2), 'パー');
      assert.equal(util.num2hand(3), null);
      assert.equal(util.num2hand('test'), null);
    });
  });
  describe('hand2num', () => {
    it('stone: 0, scissors: 1, paper: 2, others: null', () => {
      assert.equal(util.hand2num('stone'), 0);
      assert.equal(util.hand2num('scissors'), 1);
      assert.equal(util.hand2num('paper'), 2);
      assert.equal(util.hand2num('stona'), null);
      assert.equal(util.hand2num(0), null);
    });
  });
  describe('winner', () => {
    it('勝者が表示される', () => {
      assert.equal(util.winner(0, 0), 2);
      assert.equal(util.winner(0, 1), 0);
      assert.equal(util.winner(0, 2), 1);
      assert.equal(util.winner(0, 3), null);
      assert.equal(util.winner(1, 0), 1);
      assert.equal(util.winner(1, 1), 2);
      assert.equal(util.winner(1, 2), 0);
      assert.equal(util.winner(1, 3), null);
      assert.equal(util.winner(2, 0), 0);
      assert.equal(util.winner(2, 1), 1);
      assert.equal(util.winner(2, 2), 2);
      assert.equal(util.winner(2, 3), null);
      assert.equal(util.winner(3, 0), null);
      assert.equal(util.winner(3, 1), null);
      assert.equal(util.winner(3, 2), null);
    });
  });
});
