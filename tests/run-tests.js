/**
 * Test Runner
 * Runs all test suites for the Xenon Clone game
 */

// Import test framework (if in Node.js environment)
// Note: In browser, these would need to be loaded differently

// Include test framework
// In a real environment, you'd use a proper test runner like Jest, Mocha, etc.
// For now, we'll run this in the browser console

// Load all test files
const testFiles = [
    'tests/test-framework.js',
    'tests/player-tests.js',
    'tests/enemy-tests.js',
    'tests/projectile-tests.js',
    'tests/game-tests.js'
];

// Run all tests when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Starting Xenon Clone Test Suite...\n');

    try {
        // Run all tests
        await testSuite.run();

        console.log('\n✅ All tests completed!');

        // If all tests pass, show a success message
        if (testSuite.results.every(r => r.status === 'PASS')) {
            console.log('🎉 Perfect! All game components are working correctly.');
            console.log('✨ Your Xenon clone is ready for production!');

            // Maybe add a visual indicator in the game
            if (typeof window !== 'undefined' && window.game) {
                console.log('🎮 Game is ready to play!');
            }
        }

    } catch (error) {
        console.error('💥 Test suite failed to run:', error);
    }
});

// Export for potential use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testSuite, testFiles };
}
