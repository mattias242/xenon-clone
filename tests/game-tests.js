/**
 * Game Tests
 * Tests for the main Game class functionality
 */

testSuite.describe('Game Class');

testSuite.it('should initialize with correct default values', () => {
    const canvas = {
        width: 800,
        height: 600,
        getContext: () => ({
            clearRect: () => {},
            fillRect: () => {},
            fillStyle: '',
            font: '',
            textAlign: '',
            fillText: () => {}
        })
    };

    const game = new Game(canvas);

    testSuite.assertEquals(game.width, 800, 'Game should use canvas width');
    testSuite.assertEquals(game.height, 600, 'Game should use canvas height');
    testSuite.assertEquals(game.score, 0, 'Game should start with score 0');
    testSuite.assertEquals(game.level, 1, 'Game should start at level 1');
    testSuite.assertEquals(game.gameOver, false, 'Game should not be over initially');
    testSuite.assertEquals(game.paused, false, 'Game should not be paused initially');
    testSuite.assertEquals(game.enemySpawnTimer, 0, 'Enemy spawn timer should start at 0');
    testSuite.assertEquals(game.enemySpawnInterval, 120, 'Enemy spawn interval should be 120 frames');
});

testSuite.it('should initialize game objects correctly', () => {
    const canvas = {
        width: 800,
        height: 600,
        getContext: () => ({
            clearRect: () => {},
            fillRect: () => {},
            fillStyle: '',
            font: '',
            textAlign: '',
            fillText: () => {}
        })
    };

    const game = new Game(canvas);

    testSuite.assertTrue(game.player instanceof Player, 'Game should have a player object');
    testSuite.assertTrue(Array.isArray(game.projectiles), 'Game should have projectiles array');
    testSuite.assertTrue(Array.isArray(game.enemies), 'Game should have enemies array');
    testSuite.assertTrue(Array.isArray(game.particles), 'Game should have particles array');
    testSuite.assertTrue(Array.isArray(game.powerUps), 'Game should have powerUps array');
    testSuite.assertTrue(Array.isArray(game.explosions), 'Game should have explosions array');
});

testSuite.it('should handle collision detection correctly', () => {
    const canvas = {
        width: 800,
        height: 600,
        getContext: () => ({})
    };

    const game = new Game(canvas);

    // Test collision between two overlapping rectangles
    const rect1 = { x: 10, y: 10, width: 20, height: 20 };
    const rect2 = { x: 15, y: 15, width: 20, height: 20 };

    const collision = game.checkCollision(rect1, rect2);
    testSuite.assertEquals(collision, true, 'Should detect collision between overlapping rectangles');

    // Test no collision between non-overlapping rectangles
    const rect3 = { x: 10, y: 10, width: 20, height: 20 };
    const rect4 = { x: 50, y: 50, width: 20, height: 20 };

    const noCollision = game.checkCollision(rect3, rect4);
    testSuite.assertEquals(noCollision, false, 'Should not detect collision between non-overlapping rectangles');

    // Test edge case - touching but not overlapping
    const rect5 = { x: 10, y: 10, width: 20, height: 20 };
    const rect6 = { x: 30, y: 10, width: 20, height: 20 };

    const edgeCollision = game.checkCollision(rect5, rect6);
    testSuite.assertEquals(edgeCollision, false, 'Should not detect collision when rectangles just touch');
});

testSuite.it('should spawn enemies correctly', () => {
    const canvas = {
        width: 800,
        height: 600,
        getContext: () => ({})
    };

    const game = new Game(canvas);

    const initialEnemyCount = game.enemies.length;

    // Force spawn an enemy
    game.spawnEnemy();

    testSuite.assertEquals(game.enemies.length, initialEnemyCount + 1, 'Should add one enemy when spawning');
    testSuite.assertTrue(game.enemies[game.enemies.length - 1] instanceof Enemy, 'Spawned enemy should be Enemy instance');

    // Check enemy position is within bounds
    const enemy = game.enemies[game.enemies.length - 1];
    testSuite.assertGreaterThan(enemy.x, -enemy.width, 'Enemy should not spawn too far left');
    testSuite.assertLessThan(enemy.x, game.width, 'Enemy should not spawn too far right');
    testSuite.assertEquals(enemy.y, -50, 'Enemy should spawn above screen');
});

testSuite.it('should handle difficulty increase correctly', () => {
    const canvas = {
        width: 800,
        height: 600,
        getContext: () => ({})
    };

    const game = new Game(canvas);

    const initialLevel = game.level;
    const initialSpawnInterval = game.enemySpawnInterval;

    game.increaseDifficulty();

    testSuite.assertEquals(game.level, initialLevel + 1, 'Level should increase by 1');
    testSuite.assertLessThan(game.enemySpawnInterval, initialSpawnInterval, 'Spawn interval should decrease with difficulty');
});

testSuite.it('should handle game over state correctly', () => {
    const canvas = {
        width: 800,
        height: 600,
        getContext: () => ({})
    };

    const game = new Game(canvas);

    testSuite.assertEquals(game.gameOver, false, 'Game should not be over initially');

    game.endGame();
    testSuite.assertEquals(game.gameOver, true, 'Game should be over after calling endGame()');
});

testSuite.it('should reset game state correctly', () => {
    const canvas = {
        width: 800,
        height: 600,
        getContext: () => ({})
    };

    const game = new Game(canvas);

    // Modify game state
    game.score = 1000;
    game.level = 5;
    game.gameOver = true;
    game.paused = true;
    game.player.lives = 1;
    game.enemies.push(new Enemy(game, 100, 100, 'basic'));
    game.projectiles.push(new Projectile(game, 200, 200, 5, 15, 0, -10, true, 1));

    game.reset();

    testSuite.assertEquals(game.score, 0, 'Score should reset to 0');
    testSuite.assertEquals(game.level, 1, 'Level should reset to 1');
    testSuite.assertEquals(game.gameOver, false, 'Game should not be over after reset');
    testSuite.assertEquals(game.paused, false, 'Game should not be paused after reset');
    testSuite.assertEquals(game.player.lives, 3, 'Player lives should reset to max');
    testSuite.assertEquals(game.enemies.length, 0, 'Enemies array should be empty after reset');
    testSuite.assertEquals(game.projectiles.length, 0, 'Projectiles array should be empty after reset');
});

testSuite.it('should handle pause toggle correctly', () => {
    const canvas = {
        width: 800,
        height: 600,
        getContext: () => ({})
    };

    const game = new Game(canvas);

    testSuite.assertEquals(game.paused, false, 'Game should not be paused initially');

    game.togglePause();
    testSuite.assertEquals(game.paused, true, 'Game should be paused after first toggle');

    game.togglePause();
    testSuite.assertEquals(game.paused, false, 'Game should not be paused after second toggle');
});
