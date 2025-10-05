/**
 * Enemy Tests
 * Tests for the Enemy class functionality
 */

testSuite.describe('Enemy Class');

testSuite.it('should initialize with correct type-based properties', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {},
        score: 0,
        createExplosion: () => {},
        createPowerUp: () => {}
    };

    // Test basic enemy
    const basicEnemy = new Enemy(mockGame, 400, 0, 'basic');
    testSuite.assertEquals(basicEnemy.type, 'basic', 'Enemy type should be basic');
    testSuite.assertEquals(basicEnemy.health, 1, 'Basic enemy should have 1 health');
    testSuite.assertEquals(basicEnemy.score, 100, 'Basic enemy should give 100 points');
    testSuite.assertEquals(basicEnemy.width, 50, 'Basic enemy should be 50px wide');
    testSuite.assertEquals(basicEnemy.height, 40, 'Basic enemy should be 40px tall');

    // Test fast enemy
    const fastEnemy = new Enemy(mockGame, 400, 0, 'fast');
    testSuite.assertEquals(fastEnemy.type, 'fast', 'Enemy type should be fast');
    testSuite.assertEquals(fastEnemy.health, 1, 'Fast enemy should have 1 health');
    testSuite.assertEquals(fastEnemy.score, 200, 'Fast enemy should give 200 points');
    testSuite.assertEquals(fastEnemy.width, 30, 'Fast enemy should be 30px wide');
    testSuite.assertEquals(fastEnemy.height, 30, 'Fast enemy should be 30px tall');
    testSuite.assertGreaterThan(fastEnemy.speedY, 3, 'Fast enemy should have higher speed');

    // Test tank enemy
    const tankEnemy = new Enemy(mockGame, 400, 0, 'tank');
    testSuite.assertEquals(tankEnemy.type, 'tank', 'Enemy type should be tank');
    testSuite.assertEquals(tankEnemy.health, 5, 'Tank enemy should have 5 health');
    testSuite.assertEquals(tankEnemy.maxHealth, 5, 'Tank enemy should have max health of 5');
    testSuite.assertEquals(tankEnemy.score, 1000, 'Tank enemy should give 1000 points');

    // Test shooter enemy
    const shooterEnemy = new Enemy(mockGame, 400, 0, 'shooter');
    testSuite.assertEquals(shooterEnemy.type, 'shooter', 'Enemy type should be shooter');
    testSuite.assertEquals(shooterEnemy.health, 2, 'Shooter enemy should have 2 health');
    testSuite.assertEquals(shooterEnemy.score, 500, 'Shooter enemy should give 500 points');
    testSuite.assertEquals(shooterEnemy.shootInterval, 120, 'Shooter should have shoot interval');
});

testSuite.it('should start at correct position', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {},
        score: 0,
        createExplosion: () => {},
        createPowerUp: () => {}
    };

    const enemy = new Enemy(mockGame, 400, 100, 'basic');

    // Should be centered horizontally at the specified x position
    testSuite.assertEquals(enemy.x, 400 - 25, 'Enemy should be centered at spawn x position');
    testSuite.assertEquals(enemy.y, 100, 'Enemy should start at spawn y position');
});

testSuite.it('should update position correctly', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {},
        score: 0,
        createExplosion: () => {},
        createPowerUp: () => {}
    };

    const enemy = new Enemy(mockGame, 400, 100, 'basic');

    const initialY = enemy.y;
    enemy.update(16.67); // ~60fps frame time

    testSuite.assertGreaterThan(enemy.y, initialY, 'Enemy should move down each frame');
    testSuite.assertNotEquals(enemy.x, 400 - 25, 'Enemy should have horizontal movement variation');
});

testSuite.it('should handle taking damage correctly', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {},
        score: 0,
        createExplosion: () => {},
        createPowerUp: () => {}
    };

    // Test basic enemy (1 health)
    const basicEnemy = new Enemy(mockGame, 400, 100, 'basic');
    const result1 = basicEnemy.takeDamage(1);
    testSuite.assertEquals(result1, true, 'Taking damage should return true when enemy dies');
    testSuite.assertEquals(basicEnemy.markedForDeletion, true, 'Enemy should be marked for deletion when dead');
    testSuite.assertEquals(mockGame.score, 100, 'Game score should increase by enemy value');

    // Test tank enemy (5 health)
    const tankEnemy = new Enemy(mockGame, 400, 100, 'tank');
    let result2 = tankEnemy.takeDamage(2);
    testSuite.assertEquals(result2, false, 'Tank should not die from 2 damage');
    testSuite.assertEquals(tankEnemy.markedForDeletion, false, 'Tank should not be marked for deletion');
    testSuite.assertEquals(tankEnemy.health, 3, 'Tank should have 3 health remaining');

    // Finish off tank
    result2 = tankEnemy.takeDamage(3);
    testSuite.assertEquals(result2, true, 'Tank should die from final damage');
    testSuite.assertEquals(tankEnemy.markedForDeletion, true, 'Tank should be marked for deletion');
    testSuite.assertEquals(mockGame.score, 1100, 'Game score should increase by tank value (1000)');
});

testSuite.it('should mark for deletion when off screen', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {},
        score: 0,
        createExplosion: () => {},
        createPowerUp: () => {}
    };

    const enemy = new Enemy(mockGame, 400, 100, 'basic');

    // Move enemy off screen
    enemy.y = 700; // Below screen height

    enemy.update(16.67);
    testSuite.assertEquals(enemy.markedForDeletion, true, 'Enemy should be marked for deletion when below screen');

    // Test horizontal boundaries
    const enemy2 = new Enemy(mockGame, 400, 100, 'basic');
    enemy2.x = -100; // Left of screen

    enemy2.update(16.67);
    testSuite.assertEquals(enemy2.markedForDeletion, true, 'Enemy should be marked for deletion when left of screen');

    const enemy3 = new Enemy(mockGame, 400, 100, 'basic');
    enemy3.x = 900; // Right of screen

    enemy3.update(16.67);
    testSuite.assertEquals(enemy3.markedForDeletion, true, 'Enemy should be marked for deletion when right of screen');
});

testSuite.it('should shoot for shooter enemies', () => {
    const mockGame = {
        width: 800,
        height: 600,
        addProjectile: () => {},
        score: 0,
        createExplosion: () => {},
        createPowerUp: () => {},
        audio: { enemyShoot: null }
    };

    const shooterEnemy = new Enemy(mockGame, 400, 100, 'shooter');

    // Mock addProjectile to count calls
    let projectileCount = 0;
    mockGame.addProjectile = () => {
        projectileCount++;
    };

    // Initially shouldn't shoot
    shooterEnemy.shootTimer = 0;
    shooterEnemy.shoot();
    testSuite.assertEquals(projectileCount, 1, 'Shooter should fire projectile');

    // Test that it doesn't shoot again immediately
    shooterEnemy.shoot();
    testSuite.assertEquals(projectileCount, 1, 'Shooter should not fire again during cooldown');
});
