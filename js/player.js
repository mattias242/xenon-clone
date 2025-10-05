/**
 * Player Class - Xenon Authentic Implementation
 * Features dual-mode ship system (Aircraft/Tank) like the original
 */

class Player {
    constructor(game) {
        this.game = game;

        // Ship modes
        this.mode = 'aircraft'; // 'aircraft' or 'tank'
        this.isTransforming = false;
        this.transformTimer = 0;
        this.transformDuration = 30; // frames for transformation animation

        // Aircraft mode properties
        this.aircraft = {
            width: 50,
            height: 40,
            speed: 6,
            shootCooldownMax: 12,
            weaponLevel: 1,
            maxWeaponLevel: 4
        };

        // Tank mode properties
        this.tank = {
            width: 60,
            height: 50,
            speed: 3,
            shootCooldownMax: 8,
            weaponLevel: 1,
            maxWeaponLevel: 4
        };

        // Current properties (based on mode)
        this.updateDimensions();
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height - 20;

        // Game properties
        this.speed = this.aircraft.speed;
        this.shootCooldown = 0;
        this.shootCooldownMax = this.aircraft.shootCooldownMax;
        this.lives = 3;
        this.maxLives = 5;
        this.isInvincible = false;
        this.invincibleTimer = 0;
        this.invincibleDuration = 180; // frames (3 seconds at 60fps)

        // Power-ups and weapons
        this.powerUps = {
            speedBoost: false,
            speedBoostTimer: 0,
            shield: false,
            shieldTimer: 0,
            smartBombCount: 0
        };

        // Weapon system
        this.weaponLevel = 1;
        this.maxWeaponLevel = 4;

        // Visual effects
        this.trailParticles = [];
        this.engineGlow = 0;
    }

    updateDimensions() {
        if (this.mode === 'aircraft') {
            this.width = this.aircraft.width;
            this.height = this.aircraft.height;
            this.speed = this.aircraft.speed;
            this.shootCooldownMax = this.aircraft.shootCooldownMax;
        } else {
            this.width = this.tank.width;
            this.height = this.tank.height;
            this.speed = this.tank.speed;
            this.shootCooldownMax = this.tank.shootCooldownMax;
        }
    }

    update() {
        // Handle transformation
        if (this.isTransforming) {
            this.transformTimer++;
            if (this.transformTimer >= this.transformDuration) {
                this.isTransforming = false;
                this.mode = this.mode === 'aircraft' ? 'tank' : 'aircraft';
                this.updateDimensions();
                this.transformTimer = 0;

                // Play transformation sound
                if (this.game.audio.transform) {
                    const transformSound = this.game.audio.transform.cloneNode();
                    transformSound.volume = 0.4;
                    transformSound.play();
                }
            }
        }

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

        // Handle speed boost timer
        if (this.powerUps.speedBoost) {
            this.powerUps.speedBoostTimer--;
            if (this.powerUps.speedBoostTimer <= 0) {
                this.powerUps.speedBoost = false;
                this.speed = this.mode === 'aircraft' ? this.aircraft.speed : this.tank.speed;
            }
        }

        // Handle shield timer
        if (this.powerUps.shield) {
            this.powerUps.shieldTimer--;
            if (this.powerUps.shieldTimer <= 0) {
                this.powerUps.shield = false;
            }
        }

        // Update engine glow effect
        this.engineGlow += 0.1;
        if (this.engineGlow > Math.PI * 2) {
            this.engineGlow = 0;
        }

        // Update trail particles
        for (let i = this.trailParticles.length - 1; i >= 0; i--) {
            this.trailParticles[i].alpha -= 0.02;
            if (this.trailParticles[i].alpha <= 0) {
                this.trailParticles.splice(i, 1);
            }
        }
    }

    draw(context) {
        // Draw trail particles
        context.save();
        for (const particle of this.trailParticles) {
            context.globalAlpha = particle.alpha;
            context.fillStyle = particle.color;
            context.beginPath();
            context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            context.fill();
        }
        context.restore();

        context.save();

        // Draw only if not in invincible state or flashing effect
        if (!this.isInvincible || Math.floor(Date.now() / 100) % 2 === 0) {
            // Draw ship based on mode and transformation state
            if (this.isTransforming) {
                this.drawTransformation(context);
            } else if (this.mode === 'aircraft') {
                this.drawAircraft(context);
            } else {
                this.drawTank(context);
            }
        }

        // Draw shield effect
        if (this.powerUps.shield) {
            const shieldAlpha = (this.powerUps.shieldTimer / 300) * 0.3; // Fade out effect
            context.globalAlpha = shieldAlpha;
            context.strokeStyle = '#00ffff';
            context.lineWidth = 3;
            context.beginPath();
            context.arc(this.x + this.width / 2, this.y + this.height / 2, Math.max(this.width, this.height) * 0.7, 0, Math.PI * 2);
            context.stroke();
        }

        context.restore();
    }

    drawAircraft(context) {
        // Main body
        context.fillStyle = this.isInvincible ? '#ff0000' : '#00ff00';
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
        context.fillStyle = '#00aa00';
        context.fillRect(this.x + this.width * 0.4, this.y + this.height * 0.2, this.width * 0.2, this.height * 0.3);

        // Engine glow
        const glowAlpha = (Math.sin(this.engineGlow) + 1) * 0.3 + 0.2;
        context.globalAlpha = glowAlpha;
        context.fillStyle = '#ffff00';
        context.fillRect(this.x + this.width * 0.35, this.y + this.height - 5, this.width * 0.3, 8);

        // Weapon indicator
        this.drawWeaponLevel(context);

        // Add trail particle
        if (Math.random() < 0.3) {
            this.trailParticles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height,
                size: Math.random() * 2 + 1,
                color: '#00ff00',
                alpha: 0.6
            });
        }
    }

    drawTank(context) {
        // Main body (wider and more robust)
        context.fillStyle = this.isInvincible ? '#ff0000' : '#00ff00';
        context.fillRect(this.x + this.width * 0.2, this.y, this.width * 0.6, this.height);

        // Tank treads
        context.fillStyle = '#333333';
        context.fillRect(this.x, this.y + this.height * 0.7, this.width, this.height * 0.3);

        // Turret base
        context.fillStyle = '#00aa00';
        context.fillRect(this.x + this.width * 0.35, this.y + this.height * 0.3, this.width * 0.3, this.height * 0.4);

        // Cannon
        context.fillStyle = '#666666';
        context.fillRect(this.x + this.width * 0.4, this.y - 5, this.width * 0.2, 15);

        // Weapon indicator
        this.drawWeaponLevel(context);

        // Add exhaust particles
        if (Math.random() < 0.2) {
            this.trailParticles.push({
                x: this.x + Math.random() * this.width,
                y: this.y + this.height,
                size: Math.random() * 3 + 1,
                color: '#666666',
                alpha: 0.4
            });
        }
    }

    drawTransformation(context) {
        const progress = this.transformTimer / this.transformDuration;

        if (progress < 0.5) {
            // Landing/taking off animation
            this.drawAircraft(context);
            // Add landing gear/ground effect
            const groundY = this.y + this.height;
            context.fillStyle = '#666666';
            context.fillRect(this.x - 5, groundY - 5, this.width + 10, 10);
        } else {
            // Transforming to other mode
            const tankProgress = (progress - 0.5) * 2;
            this.drawTank(context);
        }
    }

    drawWeaponLevel(context) {
        // Draw weapon level indicator
        const barWidth = 20;
        const barHeight = 4;
        const barX = this.x + this.width / 2 - barWidth / 2;
        const barY = this.y - 12;

        // Background
        context.fillStyle = '#333333';
        context.fillRect(barX, barY, barWidth, barHeight);

        // Current level
        const levelWidth = (this.weaponLevel / this.maxWeaponLevel) * barWidth;
        context.fillStyle = '#00ff00';
        context.fillRect(barX, barY, levelWidth, barHeight);

        // Level text
        context.fillStyle = '#ffffff';
        context.font = '8px monospace';
        context.textAlign = 'center';
        context.fillText(`L${this.weaponLevel}`, this.x + this.width / 2, barY - 2);
    }

    shoot() {
        if (this.shootCooldown === 0 && !this.isTransforming) {
            const shootX = this.x + this.width / 2;

            // Different shooting patterns based on weapon level and mode
            if (this.mode === 'aircraft') {
                this.shootAircraft( shootX);
            } else {
                this.shootTank(shootX);
            }

            this.shootCooldown = this.shootCooldownMax;

            // Play shoot sound
            if (this.game.audio.shoot) {
                const shootSound = this.game.audio.shoot.cloneNode();
                shootSound.volume = 0.3;
                shootSound.play();
            }
        }
    }

    shootAircraft(shootX) {
        const baseY = this.y;

        switch (this.weaponLevel) {
            case 1:
                // Single shot
                this.game.addProjectile(shootX - 2.5, baseY, 0, -12, true);
                break;
            case 2:
                // Dual shots
                this.game.addProjectile(shootX - 8, baseY, -1, -12, true);
                this.game.addProjectile(shootX + 3, baseY, 1, -12, true);
                break;
            case 3:
                // Triple spread
                this.game.addProjectile(shootX - 10, baseY, -2, -12, true);
                this.game.addProjectile(shootX - 2.5, baseY, 0, -12, true);
                this.game.addProjectile(shootX + 5, baseY, 2, -12, true);
                break;
            case 4:
                // Wide spread with increased fire rate
                this.game.addProjectile(shootX - 15, baseY, -3, -12, true);
                this.game.addProjectile(shootX - 5, baseY, -1, -12, true);
                this.game.addProjectile(shootX + 2.5, baseY, 1, -12, true);
                this.game.addProjectile(shootX + 12, baseY, 3, -12, true);
                break;
        }
    }

    shootTank(shootX) {
        // Tank shoots upward at an angle
        const baseY = this.y;

        switch (this.weaponLevel) {
            case 1:
                // Single shot upward
                this.game.addProjectile(shootX - 2.5, baseY, 0, -8, true);
                break;
            case 2:
                // Dual shots upward
                this.game.addProjectile(shootX - 8, baseY, -1, -8, true);
                this.game.addProjectile(shootX + 3, baseY, 1, -8, true);
                break;
            case 3:
                // Triple shots upward
                this.game.addProjectile(shootX - 10, baseY, -2, -8, true);
                this.game.addProjectile(shootX - 2.5, baseY, 0, -8, true);
                this.game.addProjectile(shootX + 5, baseY, 2, -8, true);
                break;
            case 4:
                // Wide spread upward
                this.game.addProjectile(shootX - 15, baseY, -3, -8, true);
                this.game.addProjectile(shootX - 5, baseY, -1, -8, true);
                this.game.addProjectile(shootX + 2.5, baseY, 1, -8, true);
                this.game.addProjectile(shootX + 12, baseY, 3, -8, true);
                break;
        }
    }

    transform() {
        if (!this.isTransforming && !this.game.gameOver) {
            this.isTransforming = true;
            this.transformTimer = 0;
        }
    }

    moveLeft() {
        const newX = this.x - this.speed;
        this.x = Math.max(0, newX);
    }

    moveRight() {
        const newX = this.x + this.speed;
        this.x = Math.min(this.game.width - this.width, newX);
    }

    moveUp() {
        // In Xenon, player can move up but not down (auto-scroll handles down movement)
        const newY = this.y - this.speed;
        this.y = Math.max(0, newY);
    }

    moveDown() {
        // In Xenon, player can move down but not up (auto-scroll handles up movement)
        const newY = this.y + this.speed;
        this.y = Math.min(this.game.height - this.height, newY);
    }

    takeDamage() {
        if (this.isInvincible || this.powerUps.shield) {
            return false;
        }

        this.lives--;
        this.isInvincible = true;
        this.invincibleTimer = 0;

        // Play hit sound
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

    applyPowerUp(powerUp) {
        switch (powerUp.type) {
            case 'speed':
                this.powerUps.speedBoost = true;
                this.powerUps.speedBoostTimer = 600; // 10 seconds
                this.speed = (this.mode === 'aircraft' ? this.aircraft.speed : this.tank.speed) * 1.5;

                if (this.game.audio.powerup) {
                    const powerupSound = this.game.audio.powerup.cloneNode();
                    powerupSound.volume = 0.5;
                    powerupSound.play();
                }
                break;

            case 'weapon':
                if (this.weaponLevel < this.maxWeaponLevel) {
                    this.weaponLevel++;

                    if (this.game.audio.powerup) {
                        const powerupSound = this.game.audio.powerup.cloneNode();
                        powerupSound.volume = 0.5;
                        powerupSound.play();
                    }
                }
                break;

            case 'shield':
                this.powerUps.shield = true;
                this.powerUps.shieldTimer = 300; // 5 seconds

                if (this.game.audio.powerup) {
                    const powerupSound = this.game.audio.powerup.cloneNode();
                    powerupSound.volume = 0.5;
                    powerupSound.play();
                }
                break;

            case 'smartbomb':
                this.powerUps.smartBombCount++;

                if (this.game.audio.powerup) {
                    const powerupSound = this.game.audio.powerup.cloneNode();
                    powerupSound.volume = 0.5;
                    powerupSound.play();
                }
                break;

            case 'extraLife':
                this.lives = Math.min(this.maxLives, this.lives + 1);
                document.getElementById('lives').textContent = `Lives: ${this.lives}`;

                if (this.game.audio.powerup) {
                    const powerupSound = this.game.audio.powerup.cloneNode();
                    powerupSound.volume = 0.5;
                    powerupSound.play();
                }
                break;
        }
    }

    useSmartBomb() {
        if (this.powerUps.smartBombCount > 0) {
            this.powerUps.smartBombCount--;
            this.game.useSmartBomb();

            if (this.game.audio.smartbomb) {
                const smartbombSound = this.game.audio.smartbomb.cloneNode();
                smartbombSound.volume = 0.6;
                smartbombSound.play();
            }
        }
    }

    reset() {
        this.mode = 'aircraft';
        this.isTransforming = false;
        this.transformTimer = 0;
        this.updateDimensions();
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height - 20;
        this.lives = 3;
        this.isInvincible = false;
        this.invincibleTimer = 0;
        this.weaponLevel = 1;

        // Reset power-ups
        this.powerUps = {
            speedBoost: false,
            speedBoostTimer: 0,
            shield: false,
            shieldTimer: 0,
            smartBombCount: 0
        };

        // Clear trail particles
        this.trailParticles = [];

        document.getElementById('lives').textContent = `Lives: ${this.lives}`;
    }
}
