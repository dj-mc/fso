const { describe, expect, test } = require('@jest/globals');
const { reverse_string, reduce_average } = require('../utils/test-this');

describe('Reverse of', () => {
  test('ab', () => {
    const result = reverse_string('ab');
    expect(result).toBe('ba');
  });

  test('react', () => {
    const result = reverse_string('react');
    expect(result).toBe('tcaer');
  });

  test('releveler', () => {
    const result = reverse_string('releveler');
    expect(result).toBe('releveler');
  });
});

describe('Average of', () => {
  test('one value is itself', () => {
    expect(reduce_average([3])).toBe(3);
  });

  test('many values is correctly calculated', () => {
    expect(reduce_average([1, 2, 3, 4, 5, 6])).toBe(3.5);
  });

  test('an empty array is 0', () => {
    expect(reduce_average([])).toBe(0);
  });
});
