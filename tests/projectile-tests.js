/**
 * Projectile Tests
 * Tests for the Projectile class functionality
 */

testSuite.describe('Projectile Class');

testSuite.it('should initialize with correct properties', () => {
    const mockGame = {
        width: 800,
        height: 600
    };

    // Test player projectile
    const playerProjectile = new Projectile(mockGame, 100, 100, 5, 15, 0, -10, true, 1);

    testSuite.assertEquals(playerProjectile.x, 100, 'Projectile should start at correct x position');
    testSuite.assertEquals(playerProjectile.y, 100, 'Projectile should start at correct y position');
    testSuite.assertEquals(playerProjectile.width, 5, 'Player projectile should have correct width');
    testSuite.assertEquals(playerProjectile.height, 15, 'Player projectile should have correct height');
    testSuite.assertEquals(playerProjectile.speedX, 0, 'Player projectile should have no horizontal speed');
    testSuite.assertEquals(playerProjectile.speedY, -10, 'Player projectile should move up');
    testSuite.assertEquals(playerProjectile.isPlayerProjectile, true, 'Should be marked as player projectile');
    testSuite.assertEquals(playerProjectile.damage, 1, 'Should have correct damage');

    // Test enemy projectile
    const enemyProjectile = new Projectile(mockGame, 200, 200, 8, 8, 0, 5, false, 1);

    testSuite.assertEquals(enemyProjectile.isPlayerProjectile, false, 'Should be marked as enemy projectile');
    testSuite.assertEquals(enemyProjectile.speedY, 5, 'Enemy projectile should move down');
});

testSuite.it('should update position correctly', () => {
    const mockGame = {
        width: 800,
        height: 600
    };

    const projectile = new Projectile(mockGame, 100, 100, 5, 15, 2, -3, true, 1);

    projectile.update();

    testSuite.assertEquals(projectile.x, 102, 'Projectile should move horizontally by speedX');
    testSuite.assertEquals(projectile.y, 97, 'Projectile should move vertically by speedY');
});

testSuite.it('should mark for deletion when off screen', () => {
    const mockGame = {
        width: 800,
        height: 600
    };

    // Test off top of screen
    const projectile1 = new Projectile(mockGame, 100, 10, 5, 15, 0, -10, true, 1);
    projectile1.update();
    testSuite.assertEquals(projectile1.markedForDeletion, true, 'Projectile should be marked for deletion when above screen');

    // Test off bottom of screen
    const projectile2 = new Projectile(mockGame, 100, 590, 5, 15, 0, 10, false, 1);
    projectile2.update();
    testSuite.assertEquals(projectile2.markedForDeletion, true, 'Projectile should be marked for deletion when below screen');

    // Test off left of screen
    const projectile3 = new Projectile(mockGame, 5, 100, 5, 15, -10, 0, true, 1);
    projectile3.update();
    testSuite.assertEquals(projectile3.markedForDeletion, true, 'Projectile should be marked for deletion when left of screen');

    // Test off right of screen
    const projectile4 = new Projectile(mockGame, 795, 100, 5, 15, 10, 0, true, 1);
    projectile4.update();
    testSuite.assertEquals(projectile4.markedForDeletion, true, 'Projectile should be marked for deletion when right of screen');

    // Test projectile still on screen
    const projectile5 = new Projectile(mockGame, 400, 300, 5, 15, 0, 0, true, 1);
    projectile5.update();
    testSuite.assertEquals(projectile5.markedForDeletion, false, 'Projectile should not be marked for deletion when on screen');
});

testSuite.it('should handle trail particles', () => {
    const mockGame = {
        width: 800,
        height: 600
    };

    const projectile = new Projectile(mockGame, 100, 100, 5, 15, 0, -10, true, 1);

    testSuite.assertEquals(projectile.trailParticles.length, 0, 'Should start with no trail particles');

    // Add a trail particle
    projectile.addTrailParticle();
    testSuite.assertEquals(projectile.trailParticles.length, 1, 'Should add trail particle');
    testSuite.assertEquals(projectile.trailParticles[0].x, 102.5, 'Trail particle should be positioned at projectile center');
    testSuite.assertEquals(projectile.trailParticles[0].y, 107.5, 'Trail particle should be positioned at projectile center');

    // Update to process trail particles
    projectile.update();
    testSuite.assertLessThan(projectile.trailParticles[0].alpha, 0.7, 'Trail particle alpha should decrease');
});
