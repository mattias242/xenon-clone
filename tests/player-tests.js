/**
 * Player Tests
 * Tests for the Player class functionality
 */

testSuite.describe('Player Class');

testSuite.it('should initialize with correct default values', () => {
    // Create a mock game object
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {}
    };

    const player = new Player(mockGame);

    testSuite.assertEquals(player.width, 50, 'Player width should be 50');
    testSuite.assertEquals(player.height, 40, 'Player height should be 40');
    testSuite.assertEquals(player.speed, 5, 'Player speed should be 5');
    testSuite.assertEquals(player.lives, 3, 'Player should start with 3 lives');
    testSuite.assertEquals(player.maxLives, 3, 'Player max lives should be 3');
    testSuite.assertEquals(player.shootCooldown, 0, 'Initial shoot cooldown should be 0');
    testSuite.assertEquals(player.shootCooldownMax, 15, 'Shoot cooldown max should be 15');
    testSuite.assertEquals(player.isInvincible, false, 'Player should not be invincible initially');
});

testSuite.it('should start in correct position', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {}
    };

    const player = new Player(mockGame);

    // Should start centered horizontally, near bottom
    const expectedX = (800 - 50) / 2; // 375
    const expectedY = 600 - 40 - 20; // 540

    testSuite.assertEquals(player.x, expectedX, 'Player should start centered horizontally');
    testSuite.assertEquals(player.y, expectedY, 'Player should start near bottom');
});

testSuite.it('should move correctly with input methods', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {}
    };

    const player = new Player(mockGame);

    // Test movement boundaries
    player.moveLeft();
    testSuite.assertEquals(player.x, 370, 'Player should move left by 5 pixels');

    player.moveLeft();
    testSuite.assertEquals(player.x, 365, 'Player should continue moving left');

    // Test boundary - shouldn't go below 0
    player.x = 0;
    player.moveLeft();
    testSuite.assertEquals(player.x, 0, 'Player should not move left when at boundary');

    // Test right movement
    player.moveRight();
    testSuite.assertEquals(player.x, 5, 'Player should move right by 5 pixels');

    // Test up movement
    player.moveUp();
    testSuite.assertEquals(player.y, 535, 'Player should move up by 5 pixels');

    // Test down movement
    player.moveDown();
    testSuite.assertEquals(player.y, 540, 'Player should move down by 5 pixels');
});

testSuite.it('should handle shooting cooldown', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {}
    };

    const player = new Player(mockGame);

    // Mock the game's addProjectile method
    let projectileCount = 0;
    mockGame.addProjectile = () => {
        projectileCount++;
    };

    // Shoot once - should work
    player.shoot();
    testSuite.assertEquals(player.shootCooldown, 15, 'Shoot cooldown should be set after shooting');
    testSuite.assertEquals(projectileCount, 1, 'Projectile should be added when shooting');

    // Try to shoot immediately - should not work due to cooldown
    player.shoot();
    testSuite.assertEquals(projectileCount, 1, 'No additional projectile should be added during cooldown');

    // Reduce cooldown and try again
    player.shootCooldown = 0;
    player.shoot();
    testSuite.assertEquals(projectileCount, 2, 'Projectile should be added after cooldown');
});

testSuite.it('should handle damage and invincibility', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {},
        gameOver: () => {}
    };

    const player = new Player(mockGame);

    // Test taking damage
    const initialLives = player.lives;
    player.takeDamage();
    testSuite.assertEquals(player.lives, initialLives - 1, 'Player should lose a life when damaged');
    testSuite.assertEquals(player.isInvincible, true, 'Player should become invincible after taking damage');

    // Try to take damage while invincible - should not work
    player.takeDamage();
    testSuite.assertEquals(player.lives, initialLives - 1, 'Player should not lose life while invincible');

    // Reset invincibility and test again
    player.isInvincible = false;
    player.takeDamage();
    testSuite.assertEquals(player.lives, initialLives - 2, 'Player should lose life after invincibility ends');
});

testSuite.it('should reset correctly', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {}
    };

    const player = new Player(mockGame);

    // Modify player state
    player.x = 100;
    player.y = 100;
    player.lives = 1;
    player.isInvincible = true;

    // Reset player
    player.reset();

    // Check reset values
    const expectedX = (800 - 50) / 2;
    const expectedY = 600 - 40 - 20;

    testSuite.assertEquals(player.x, expectedX, 'Player x should reset to center');
    testSuite.assertEquals(player.y, expectedY, 'Player y should reset to bottom');
    testSuite.assertEquals(player.lives, 3, 'Player lives should reset to max');
    testSuite.assertEquals(player.isInvincible, false, 'Player should not be invincible after reset');
});
