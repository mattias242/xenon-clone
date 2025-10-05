class Enemy {
    constructor(game, x, y, type = 'basic') {
        this.game = game;
        this.type = type;
        this.markedForDeletion = false;
        this.frameX = 0;
        this.frameY = 0;
        this.frameTimer = 0;
        this.frameInterval = 1000/20; // 20fps
        
        // Set properties based on enemy type
        switch (this.type) {
            case 'fast':
                this.width = 30;
                this.height = 30;
                this.speedX = 0;
                this.speedY = 3 + Math.random() * 2;
                this.health = 1;
                this.score = 200;
                this.color = '#ff0';
                break;
            case 'tank':
                this.width = 70;
                this.height = 60;
                this.speedX = 0;
                this.speedY = 0.5 + Math.random() * 0.5;
                this.health = 5;
                this.maxHealth = 5;
                this.score = 1000;
                this.color = '#f0f';
                break;
            case 'shooter':
                this.width = 40;
                this.height = 40;
                this.speedX = 0;
                this.speedY = 1 + Math.random();
                this.health = 2;
                this.score = 500;
                this.shootInterval = 120; // frames
                this.shootTimer = Math.floor(Math.random() * this.shootInterval);
                this.color = '#0ff';
                break;
            default: // basic
                this.width = 50;
                this.height = 40;
                this.speedX = Math.random() * 4 - 2; // Random horizontal movement
                this.speedY = 1 + Math.random() * 1.5;
                this.health = 1;
                this.score = 100;
                this.color = '#f00';
        }
        
        this.x = x - this.width / 2; // Center the enemy at the x position
        this.y = y;
        
        // For movement patterns
        this.angle = 0;
        this.va = Math.random() * 0.1 - 0.05; // Random angle velocity
        this.amplitude = Math.random() * 3 + 1; // Random movement amplitude
    }
    
    update(deltaTime) {
        // Update position based on movement pattern
        this.angle += this.va;
        this.x += Math.sin(this.angle) * this.amplitude;
        this.y += this.speedY;
        
        // Handle shooting for shooter enemies
        if (this.type === 'shooter') {
            this.shootTimer++;
            if (this.shootTimer >= this.shootInterval) {
                this.shoot();
                this.shootTimer = 0;
            }
        }
        
        // Check if enemy is off screen
        if (this.y > this.game.height || 
            this.x < -this.width || 
            this.x > this.game.width) {
            this.markedForDeletion = true;
        }
    }
    
    draw(context) {
        // Draw enemy based on type
        context.save();
        
        // Draw different enemy types
        switch (this.type) {
            case 'fast':
                // Draw fast enemy (small triangle)
                context.fillStyle = this.color;
                context.beginPath();
                context.moveTo(this.x + this.width / 2, this.y);
                context.lineTo(this.x + this.width, this.y + this.height);
                context.lineTo(this.x, this.y + this.height);
                context.closePath();
                context.fill();
                break;
                
            case 'tank':
                // Draw tank enemy (large rectangle with details)
                // Main body
                context.fillStyle = this.color;
                context.fillRect(this.x, this.y, this.width, this.height);
                
                // Health bar
                const healthBarWidth = this.width * 0.8;
                const healthBarHeight = 5;
                const healthBarX = this.x + (this.width - healthBarWidth) / 2;
                const healthBarY = this.y - 10;
                
                // Background of health bar
                context.fillStyle = '#333';
                context.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
                
                // Current health
                const healthWidth = (this.health / this.maxHealth) * healthBarWidth;
                context.fillStyle = '#0f0';
                context.fillRect(healthBarX, healthBarY, healthWidth, healthBarHeight);
                
                // Details
                context.fillStyle = '#000';
                context.fillRect(this.x + 10, this.y + 10, 10, 10);
                context.fillRect(this.x + this.width - 20, this.y + 10, 10, 10);
                break;
                
            case 'shooter':
                // Draw shooter enemy (diamond shape)
                context.fillStyle = this.color;
                context.beginPath();
                context.moveTo(this.x + this.width / 2, this.y);
                context.lineTo(this.x + this.width, this.y + this.height / 2);
                context.lineTo(this.x + this.width / 2, this.y + this.height);
                context.lineTo(this.x, this.y + this.height / 2);
                context.closePath();
                context.fill();
                break;
                
            default: // basic
                // Draw basic enemy (simple shape)
                context.fillStyle = this.color;
                context.fillRect(this.x, this.y, this.width, this.height);
                
                // Add some details
                context.fillStyle = '#000';
                context.fillRect(this.x + 5, this.y + 5, 10, 5);
                context.fillRect(this.x + this.width - 15, this.y + 5, 10, 5);
        }
        
        context.restore();
    }
    
    shoot() {
        if (this.type === 'shooter') {
            const projectileX = this.x + this.width / 2 - 2.5;
            const projectileY = this.y + this.height;
            this.game.addProjectile(projectileX, projectileY, 0, 5, false);
            
            // Play enemy shoot sound if available
            if (this.game.audio.enemyShoot) {
                const shootSound = this.game.audio.enemyShoot.cloneNode();
                shootSound.volume = 0.2;
                shootSound.play();
            }
        }
    }
    
    takeDamage(amount = 1) {
        this.health -= amount;
        if (this.health <= 0) {
            this.markedForDeletion = true;
            this.game.score += this.score;
            document.getElementById('score').textContent = `Score: ${this.game.score}`;
            
            // Play explosion sound if available
            if (this.game.audio.explosion) {
                const explosionSound = this.game.audio.explosion.cloneNode();
                explosionSound.volume = 0.3;
                explosionSound.play();
            }
            
            // Create explosion effect
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, this.type);
            
            // Chance to drop power-up
            if (Math.random() < 0.1) { // 10% chance for power-up
                this.game.createPowerUp(this.x + this.width / 2, this.y + this.height / 2);
            }
            
            return true;
        }
        return false;
    }
}
