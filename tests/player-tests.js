/**
 * Player Tests - Updated for Dual-Mode Ship System
 * Tests for the Player class functionality with aircraft/tank modes
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

    testSuite.assertEquals(player.mode, 'aircraft', 'Player should start in aircraft mode');
    testSuite.assertEquals(player.isTransforming, false, 'Player should not be transforming initially');
    testSuite.assertEquals(player.weaponLevel, 1, 'Player should start with weapon level 1');
    testSuite.assertEquals(player.lives, 3, 'Player should start with 3 lives');
    testSuite.assertEquals(player.isInvincible, false, 'Player should not be invincible initially');
    testSuite.assertEquals(player.powerUps.speedBoost, false, 'Speed boost should be disabled initially');
    testSuite.assertEquals(player.powerUps.shield, false, 'Shield should be disabled initially');
    testSuite.assertEquals(player.powerUps.smartBombCount, 0, 'Smart bomb count should be 0 initially');
});

testSuite.it('should start in correct position', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {}
    };

    const player = new Player(mockGame);

    // Should start centered horizontally, near bottom
    const expectedX = (800 - 50) / 2; // 375 (aircraft width is 50)
    const expectedY = 600 - 40 - 20; // 540

    testSuite.assertEquals(player.x, expectedX, 'Player should start centered horizontally');
    testSuite.assertEquals(player.y, expectedY, 'Player should start near bottom');
});

testSuite.it('should handle mode transformation', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {},
        audio: { transform: null }
    };

    const player = new Player(mockGame);

    // Initially in aircraft mode
    testSuite.assertEquals(player.mode, 'aircraft', 'Player should start in aircraft mode');
    testSuite.assertEquals(player.speed, 6, 'Aircraft mode should have speed 6');
    testSuite.assertEquals(player.width, 50, 'Aircraft mode should have width 50');
    testSuite.assertEquals(player.height, 40, 'Aircraft mode should have height 40');

    // Transform to tank mode
    player.transform();
    testSuite.assertEquals(player.isTransforming, true, 'Player should be transforming');
    testSuite.assertEquals(player.transformTimer, 0, 'Transform timer should start at 0');

    // Simulate transformation completion
    player.transformTimer = 30;
    player.update();

    testSuite.assertEquals(player.mode, 'tank', 'Player should be in tank mode after transformation');
    testSuite.assertEquals(player.speed, 3, 'Tank mode should have speed 3');
    testSuite.assertEquals(player.width, 60, 'Tank mode should have width 60');
    testSuite.assertEquals(player.height, 50, 'Tank mode should have height 50');
});

testSuite.it('should handle shooting in different modes', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {},
        audio: { shoot: null }
    };

    const player = new Player(mockGame);

    // Mock projectile tracking
    let projectileCount = 0;
    let lastProjectileX = 0;
    mockGame.addProjectile = (x, y, speedX, speedY, isPlayerProjectile) => {
        projectileCount++;
        lastProjectileX = x;
    };

    // Test aircraft mode shooting (level 1)
    player.shoot();
    testSuite.assertEquals(player.shootCooldown, 12, 'Aircraft shoot cooldown should be 12');
    testSuite.assertEquals(projectileCount, 1, 'Should add one projectile in aircraft mode');

    // Reset cooldown and change to tank mode
    player.shootCooldown = 0;
    player.transform();
    player.transformTimer = 30;
    player.update(); // Complete transformation

    // Test tank mode shooting (level 1)
    player.shoot();
    testSuite.assertEquals(player.shootCooldown, 8, 'Tank shoot cooldown should be 8');
    testSuite.assertEquals(projectileCount, 2, 'Should add second projectile in tank mode');
});

testSuite.it('should handle power-ups correctly', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {},
        audio: { powerup: null }
    };

    const player = new Player(mockGame);

    // Test weapon upgrade
    const weaponPowerUp = { type: 'weapon' };
    player.applyPowerUp(weaponPowerUp);
    testSuite.assertEquals(player.weaponLevel, 2, 'Weapon level should increase after power-up');

    // Test speed boost
    const speedPowerUp = { type: 'speed' };
    player.applyPowerUp(speedPowerUp);
    testSuite.assertEquals(player.powerUps.speedBoost, true, 'Speed boost should be activated');
    testSuite.assertEquals(player.powerUps.speedBoostTimer, 600, 'Speed boost timer should be set');

    // Test shield
    const shieldPowerUp = { type: 'shield' };
    player.applyPowerUp(shieldPowerUp);
    testSuite.assertEquals(player.powerUps.shield, true, 'Shield should be activated');
    testSuite.assertEquals(player.powerUps.shieldTimer, 300, 'Shield timer should be set');

    // Test smart bomb collection
    const bombPowerUp = { type: 'smartbomb' };
    player.applyPowerUp(bombPowerUp);
    testSuite.assertEquals(player.powerUps.smartBombCount, 1, 'Smart bomb count should increase');
});

testSuite.it('should handle damage and invincibility', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {},
        audio: { hit: null },
        gameOver: () => {}
    };

    const player = new Player(mockGame);

    // Test taking damage
    const initialLives = player.lives;
    player.takeDamage();
    testSuite.assertEquals(player.lives, initialLives - 1, 'Player should lose a life when damaged');
    testSuite.assertEquals(player.isInvincible, true, 'Player should become invincible after taking damage');

    // Try to take damage while invincible - should not work due to shield
    player.powerUps.shield = true;
    player.takeDamage();
    testSuite.assertEquals(player.lives, initialLives - 1, 'Player should not lose life while shielded');

    // Disable shield and try again - should not work due to invincibility
    player.powerUps.shield = false;
    player.takeDamage();
    testSuite.assertEquals(player.lives, initialLives - 1, 'Player should not lose life while invincible');
});

testSuite.it('should reset correctly', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {}
    };

    const player = new Player(mockGame);

    // Modify player state
    player.mode = 'tank';
    player.weaponLevel = 4;
    player.lives = 1;
    player.isInvincible = true;
    player.powerUps.speedBoost = true;
    player.powerUps.shield = true;
    player.powerUps.smartBombCount = 5;

    // Reset player
    player.reset();

    // Check reset values
    testSuite.assertEquals(player.mode, 'aircraft', 'Player should reset to aircraft mode');
    testSuite.assertEquals(player.weaponLevel, 1, 'Weapon level should reset to 1');
    testSuite.assertEquals(player.lives, 3, 'Player lives should reset to 3');
    testSuite.assertEquals(player.isInvincible, false, 'Player should not be invincible after reset');
    testSuite.assertEquals(player.powerUps.speedBoost, false, 'Speed boost should be disabled after reset');
    testSuite.assertEquals(player.powerUps.shield, false, 'Shield should be disabled after reset');
    testSuite.assertEquals(player.powerUps.smartBombCount, 0, 'Smart bomb count should be 0 after reset');
});
