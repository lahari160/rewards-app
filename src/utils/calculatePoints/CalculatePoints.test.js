// We recommend installing an extension to run jest tests.
import { calculateTransactionPoints } from './calculatePoints';

describe('calculateTransactionPoints', () => {
    test('returns 0 for amounts less than 50', () => {
        expect(calculateTransactionPoints(49.99)).toBe(0);
        expect(calculateTransactionPoints(30)).toBe(0);
    });

    test('returns correct points for amounts between 50 and 100', () => {
        expect(calculateTransactionPoints(50)).toBe(0);
        expect(calculateTransactionPoints(75)).toBe(25);
        expect(calculateTransactionPoints(100)).toBe(50);
    });

    test('returns correct points for amounts over 100', () => {
        expect(calculateTransactionPoints(101)).toBe(52);
        expect(calculateTransactionPoints(120)).toBe(90);
        expect(calculateTransactionPoints(200)).toBe(250);
    });

    test('handles decimal amounts correctly', () => {
        expect(calculateTransactionPoints(100.2)).toBe(50);
        expect(calculateTransactionPoints(100.9)).toBe(50);
        expect(calculateTransactionPoints(150.5)).toBe(150);
    });

    test('handles NaN, undefined, null and non-finite values by returning 0', () => {
        expect(calculateTransactionPoints(NaN)).toBe(0);
        expect(calculateTransactionPoints(Number.NaN)).toBe(0);
        expect(calculateTransactionPoints(undefined)).toBe(0);
        expect(calculateTransactionPoints(null)).toBe(0);
        expect(calculateTransactionPoints(Infinity)).toBe(0);
        expect(calculateTransactionPoints(-Infinity)).toBe(0);
    });

    test('treats non-number inputs (including numeric strings) as invalid and returns 0', () => {
        expect(calculateTransactionPoints('abc')).toBe(0);
        expect(calculateTransactionPoints('150')).toBe(0);
        expect(calculateTransactionPoints([])).toBe(0);
        expect(calculateTransactionPoints({})).toBe(0);
        expect(calculateTransactionPoints(true)).toBe(0);
    });

    test('handles negative numbers (including -0) as zero points', () => {
        expect(calculateTransactionPoints(-50)).toBe(0);
        expect(calculateTransactionPoints(-1)).toBe(0);
        expect(calculateTransactionPoints(-100.5)).toBe(0);
        expect(calculateTransactionPoints(-0)).toBe(0);
    });

    test('accepts values that are explicitly converted to Number and calculates points', () => {
        expect(calculateTransactionPoints(Number('150'))).toBe(150); // Number('150') === 150
    });
});