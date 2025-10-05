class Player {
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 40;
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height - 20;
        this.speed = 5;
        this.lives = 3;
        this.maxLives = 3;
        this.shootCooldown = 0;
        this.shootCooldownMax = 15;
        this.isInvincible = false;
        this.invincibleTimer = 0;
        this.invincibleDuration = 120; // frames
    }

    update() {
        // Handle shooting cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }

        // Handle invincibility frames
        if (this.isInvincible) {
            this.invincibleTimer++;
            if (this.invincibleTimer >= this.invincibleDuration) {
                this.isInvincible = false;
                this.invincibleTimer = 0;
            }
        }
    }

    draw(context) {
        // Draw player ship
        context.save();
        
        // Draw only if not in invincible state or flashing effect
        if (!this.isInvincible || Math.floor(Date.now() / 100) % 2 === 0) {
            // Main body
            context.fillStyle = '#0f0';
            context.fillRect(this.x + this.width * 0.3, this.y, this.width * 0.4, this.height);
            
            // Wings
            context.beginPath();
            context.moveTo(this.x, this.y + this.height * 0.3);
            context.lineTo(this.x + this.width * 0.3, this.y + this.height * 0.3);
            context.lineTo(this.x + this.width * 0.3, this.y + this.height * 0.7);
            context.lineTo(this.x, this.y + this.height * 0.7);
            context.closePath();
            context.fill();
            
            context.beginPath();
            context.moveTo(this.x + this.width * 0.7, this.y + this.height * 0.3);
            context.lineTo(this.x + this.width, this.y + this.height * 0.3);
            context.lineTo(this.x + this.width, this.y + this.height * 0.7);
            context.lineTo(this.x + this.width * 0.7, this.y + this.height * 0.7);
            context.closePath();
            context.fill();
            
            // Cockpit
            context.fillStyle = '#0a0';
            context.fillRect(this.x + this.width * 0.4, this.y + this.height * 0.2, this.width * 0.2, this.height * 0.3);
        }
        
        context.restore();
    }

    shoot() {
        if (this.shootCooldown === 0) {
            const projectileX = this.x + this.width / 2 - 2.5;
            const projectileY = this.y;
            this.game.addProjectile(projectileX, projectileY, 0, -10, true);
            this.shootCooldown = this.shootCooldownMax;
            
            // Play shoot sound if available
            if (this.game.audio.shoot) {
                const shootSound = this.game.audio.shoot.cloneNode();
                shootSound.volume = 0.3;
                shootSound.play();
            }
        }
    }

    moveLeft() {
        this.x = Math.max(0, this.x - this.speed);
    }

    moveRight() {
        this.x = Math.min(this.game.width - this.width, this.x + this.speed);
    }

    moveUp() {
        this.y = Math.max(0, this.y - this.speed);
    }

    moveDown() {
        this.y = Math.min(this.game.height - this.height, this.y + this.speed);
    }

    takeDamage() {
        if (!this.isInvincible) {
            this.lives--;
            this.isInvincible = true;
            this.invincibleTimer = 0;
            
            // Play hit sound if available
            if (this.game.audio.hit) {
                const hitSound = this.game.audio.hit.cloneNode();
                hitSound.volume = 0.5;
                hitSound.play();
            }
            
            // Update lives display
            document.getElementById('lives').textContent = `Lives: ${this.lives}`;
            
            if (this.lives <= 0) {
                this.game.gameOver();
            }
            
            return true;
        }
        return false;
    }

    reset() {
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height - 20;
        this.lives = this.maxLives;
        this.isInvincible = false;
        this.invincibleTimer = 0;
        document.getElementById('lives').textContent = `Lives: ${this.lives}`;
    }
}
