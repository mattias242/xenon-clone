/**
 * Test Suite for Xenon Clone Game
 * Test Driven Development (TDD) approach
 */

// Test framework for game components
class GameTestSuite {
    constructor() {
        this.tests = [];
        this.results = [];
        this.currentTest = null;
    }

    describe(description, testFn) {
        this.tests.push({ description, testFn });
    }

    it(description, testFn) {
        this.tests.push({ description, testFn, isTest: true });
    }

    beforeEach(fn) {
        this.beforeEachFn = fn;
    }

    afterEach(fn) {
        this.afterEachFn = fn;
    }

    async run() {
        console.log('🧪 Running Xenon Clone Test Suite...\n');

        for (const test of this.tests) {
            if (test.isTest) {
                await this.runTest(test);
            } else {
                console.log(`📋 ${test.description}`);
            }
        }

        this.printResults();
    }

    async runTest(test) {
        this.currentTest = test;

        try {
            if (this.beforeEachFn) await this.beforeEachFn();

            await test.testFn();

            console.log(`✅ ${test.description}`);
            this.results.push({ test: test.description, status: 'PASS' });

        } catch (error) {
            console.log(`❌ ${test.description}`);
            console.log(`   Error: ${error.message}`);
            this.results.push({ test: test.description, status: 'FAIL', error: error.message });
        }

        if (this.afterEachFn) await this.afterEachFn();
    }

    printResults() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.status === 'PASS').length;
        const failed = total - passed;

        console.log(`\n📊 Test Results:`);
        console.log(`   Passed: ${passed}`);
        console.log(`   Failed: ${failed}`);
        console.log(`   Total:  ${total}`);

        if (failed === 0) {
            console.log('🎉 All tests passed!');
        } else {
            console.log('💥 Some tests failed. Check the errors above.');
        }
    }

    // Assertion methods
    assert(condition, message = 'Assertion failed') {
        if (!condition) {
            throw new Error(message);
        }
    }

    assertEquals(actual, expected, message = `Expected ${expected}, but got ${actual}`) {
        if (actual !== expected) {
            throw new Error(message);
        }
    }

    assertTrue(value, message = 'Expected true, but got false') {
        this.assert(value === true, message);
    }

    assertFalse(value, message = 'Expected false, but got true') {
        this.assert(value === false, message);
    }

    assertGreaterThan(a, b, message = `${a} is not greater than ${b}`) {
        this.assert(a > b, message);
    }

    assertLessThan(a, b, message = `${a} is not less than ${b}`) {
        this.assert(a < b, message);
    }

    assertNotEquals(actual, expected, message = `Expected ${actual} to not equal ${expected}`) {
        if (actual === expected) {
            throw new Error(message);
        }
    }
}

// Create test suite instance
const testSuite = new GameTestSuite();

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameTestSuite, testSuite };
}
