class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Game state
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.paused = false;
        this.lastTime = 0;
        this.accumulator = 0;
        this.timeStep = 1000/60; // 60 FPS
        
        // Game objects
        this.player = new Player(this);
        this.projectiles = [];
        this.enemies = [];
        this.particles = [];
        this.powerUps = [];
        this.explosions = [];
        
        // Game settings
        this.enemySpawnTimer = 0;
        this.enemySpawnInterval = 120; // frames (increased from 60 to spawn less frequently)
        this.difficultyIncreaseInterval = 15000; // ms (increased from 10000 to slow difficulty ramp)
        this.lastDifficultyIncrease = 0;
        
        // Input handling
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
            ArrowDown: false,
            ' ': false,
            p: false
        };
        
        // Audio
        this.audio = {
            shoot: null,
            explosion: null,
            hit: null,
            powerup: null,
            enemyShoot: null
        };
        
        // Initialize audio
        this.initAudio();
        
        // Bind methods
        this.handleInput = this.handleInput.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.togglePause = this.togglePause.bind(this);
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    initAudio() {
        // Create audio elements
        this.audio.shoot = new Audio();
        this.audio.shoot.src = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...'; // Short laser sound
        
        this.audio.explosion = new Audio();
        this.audio.explosion.src = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...'; // Explosion sound
        
        this.audio.hit = new Audio();
        this.audio.hit.src = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...'; // Hit sound
        
        this.audio.powerup = new Audio();
        this.audio.powerup.src = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...'; // Powerup sound
        
        this.audio.enemyShoot = new Audio();
        this.audio.enemyShoot.src = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...'; // Enemy shoot sound
    }
    
    setupEventListeners() {
        // Keyboard input
        window.addEventListener('keydown', (e) => {
            if (e.code in this.keys) {
                this.keys[e.code] = true;
                
                // Space to shoot
                if (e.code === ' ' && !this.gameOver) {
                    this.player.shoot();
                }
                
                // P to pause
                if (e.code === 'p') {
                    this.togglePause();
                }
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (e.code in this.keys) {
                this.keys[e.code] = false;
            }
        });
        
        // Touch controls for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleTouch(touch);
        }, false);
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleTouch(touch);
        }, false);
        
        this.canvas.addEventListener('touchend', () => {
            this.keys[' '] = false;
        }, false);
    }
    
    handleTouch(touch) {
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Move player to touch position
        this.player.x = Math.max(0, Math.min(x - this.player.width / 2, this.width - this.player.width));
        this.player.y = Math.max(0, Math.min(y - this.player.height / 2, this.height - this.player.height));
        
        // Shoot if touching the bottom half of the screen
        if (y > this.height / 2) {
            this.keys[' '] = true;
            if (!this.gameOver) {
                this.player.shoot();
            }
        } else {
            this.keys[' '] = false;
        }
    }
    
    handleInput() {
        if (this.paused || this.gameOver) return;
        
        // Player movement
        if (this.keys.ArrowLeft) this.player.moveLeft();
        if (this.keys.ArrowRight) this.player.moveRight();
        if (this.keys.ArrowUp) this.player.moveUp();
        if (this.keys.ArrowDown) this.player.moveDown();
        
        // Continuous shooting when space is held
        if (this.keys[' ']) {
            this.player.shoot();
        }
    }
    
    update(deltaTime) {
        if (this.paused || this.gameOver) return;
        
        // Update player
        this.player.update();
        
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].update();
            
            // Remove projectiles that are off screen
            if (this.projectiles[i].markedForDeletion) {
                this.projectiles.splice(i, 1);
                continue;
            }
            
            // Check for collisions with enemies (player projectiles only)
            if (this.projectiles[i].isPlayerProjectile) {
                for (let j = this.enemies.length - 1; j >= 0; j--) {
                    if (this.checkCollision(this.projectiles[i], this.enemies[j])) {
                        const enemy = this.enemies[j];
                        if (enemy.takeDamage(this.projectiles[i].damage)) {
                            this.enemies.splice(j, 1);
                        }
                        this.projectiles.splice(i, 1);
                        break;
                    }
                }
            } 
            // Check for collisions with player (enemy projectiles only)
            else if (this.checkCollision(this.projectiles[i], this.player) && !this.player.isInvincible) {
                this.player.takeDamage();
                this.projectiles.splice(i, 1);
            }
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(deltaTime);
            
            // Remove enemies that are marked for deletion
            if (this.enemies[i].markedForDeletion) {
                this.enemies.splice(i, 1);
                continue;
            }
            
            // Check for collision with player
            if (this.checkCollision(this.player, this.enemies[i]) && !this.player.isInvincible) {
                if (this.player.takeDamage()) {
                    // Player is dead
                    this.enemies.splice(i, 1);
                    break;
                }
            }
        }
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].markedForDeletion) {
                this.particles.splice(i, 1);
            }
        }
        
        // Update power-ups
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            this.powerUps[i].update();
            
            // Remove power-ups that are off screen
            if (this.powerUps[i].y > this.height) {
                this.powerUps.splice(i, 1);
                continue;
            }
            
            // Check for collision with player
            if (this.checkCollision(this.player, this.powerUps[i])) {
                this.powerUps[i].apply(this.player);
                this.powerUps.splice(i, 1);
                
                // Play power-up sound if available
                if (this.audio.powerup) {
                    const powerupSound = this.audio.powerup.cloneNode();
                    powerupSound.volume = 0.5;
                    powerupSound.play();
                }
            }
        }
        
        // Update explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            this.explosions[i].update();
            if (this.explosions[i].markedForDeletion) {
                this.explosions.splice(i, 1);
            }
        }
        
        // Spawn enemies
        this.enemySpawnTimer += deltaTime;
        if (this.enemySpawnTimer > this.enemySpawnInterval) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
            
            // Randomly adjust spawn interval for some variety
            this.enemySpawnInterval = Math.max(30, 90 - this.level * 2 + Math.random() * 30);
        }
        
        // Increase difficulty over time
        this.lastDifficultyIncrease += deltaTime;
        if (this.lastDifficultyIncrease >= this.difficultyIncreaseInterval) {
            this.increaseDifficulty();
            this.lastDifficultyIncrease = 0;
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw starfield background
        this.drawStarfield();
        
        // Draw all game objects
        this.powerUps.forEach(powerUp => powerUp.draw(this.ctx));
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.projectiles.forEach(projectile => projectile.draw(this.ctx));
        this.player.draw(this.ctx);
        this.particles.forEach(particle => particle.draw(this.ctx));
        this.explosions.forEach(explosion => explosion.draw(this.ctx));
        
        // Draw HUD
        this.drawHUD();
        
        // Draw pause overlay if game is paused
        if (this.paused) {
            this.drawPauseScreen();
        }
        
        // Draw game over screen if game is over
        if (this.gameOver) {
            this.drawGameOver();
        }
    }
    
    drawStarfield() {
        // Simple starfield background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw stars (cached for better performance)
        if (!this.stars) {
            this.stars = [];
            for (let i = 0; i < 200; i++) {
                this.stars.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    size: Math.random() * 1.5,
                    speed: 0.1 + Math.random() * 0.5
                });
            }
        }
        
        // Update and draw stars
        this.ctx.fillStyle = '#fff';
        for (const star of this.stars) {
            star.y += star.speed;
            if (star.y > this.height) {
                star.y = 0;
                star.x = Math.random() * this.width;
            }
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawHUD() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(10, 10, 150, 80);
        
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = '20px "Courier New", monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 20, 35);
        this.ctx.fillText(`Level: ${this.level}`, 20, 65);
        this.ctx.fillText(`Lives: ${this.player.lives}`, 20, 95);
    }
    
    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = '48px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
        
        this.ctx.font = '24px "Courier New", monospace';
        this.ctx.fillText('Press P to resume', this.width / 2, this.height / 2 + 40);
    }
    
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#f00';
        this.ctx.font = '48px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 40);
        
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = '24px "Courier New", monospace';
        this.ctx.fillText(`Final Score: ${this.score}`, this.width / 2, this.height / 2 + 20);
        this.ctx.fillText('Press R to restart', this.width / 2, this.height / 2 + 60);
    }
    
    spawnEnemy() {
        const x = Math.random() * (this.width - 50) + 25;
        const y = -50;
        
        // Randomly choose enemy type based on level
        const rand = Math.random();
        let type;
        
        if (this.level < 3) {
            type = 'basic';
        } else if (this.level < 6) {
            if (rand < 0.8) type = 'basic';
            else type = 'fast';
        } else if (this.level < 10) {
            if (rand < 0.6) type = 'basic';
            else if (rand < 0.9) type = 'fast';
            else type = 'tank';
        } else {
            if (rand < 0.5) type = 'basic';
            else if (rand < 0.8) type = 'fast';
            else if (rand < 0.95) type = 'tank';
            else type = 'shooter';
        }
        
        this.enemies.push(new Enemy(this, x, y, type));
    }
    
    createExplosion(x, y, type = 'basic') {
        let particleCount, size, speed, color1, color2;
        
        switch (type) {
            case 'tank':
                particleCount = 50;
                size = 4;
                speed = 3;
                color1 = '#f0f';
                color2 = '#f9f';
                break;
            case 'shooter':
                particleCount = 30;
                size = 3;
                speed = 2.5;
                color1 = '#0ff';
                color2 = '#9ff';
                break;
            case 'fast':
                particleCount = 20;
                size = 2;
                speed = 2;
                color1 = '#ff0';
                color2 = '#ff9';
                break;
            default: // basic
                particleCount = 30;
                size = 3;
                speed = 2;
                color1 = '#f00';
                color2 = '#f99';
        }
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = {
                x: Math.cos(angle) * (Math.random() * speed + 1),
                y: Math.sin(angle) * (Math.random() * speed + 1)
            };
            
            this.particles.push(new Particle(
                x,
                y,
                Math.random() * size + 1,
                Math.random() > 0.5 ? color1 : color2,
                velocity,
                Math.random() * 0.2 - 0.1,
                Math.random() * 0.2 - 0.1,
                0.02
            ));
        }
    }
    
    createPowerUp(x, y) {
        const powerUps = [
            { type: 'extraLife', color: '#0f0', text: '1UP' },
            { type: 'weaponUpgrade', color: '#0ff', text: 'POW' },
            { type: 'shield', color: '#00f', text: 'SHLD' },
            { type: 'slowMotion', color: '#f0f', text: 'SLOW' }
        ];
        
        const powerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
        this.powerUps.push(new PowerUp(x, y, powerUp.type, powerUp.color, powerUp.text));
    }
    
    addProjectile(x, y, speedX, speedY, isPlayerProjectile, damage = 1) {
        const width = isPlayerProjectile ? 5 : 8;
        const height = isPlayerProjectile ? 15 : 8;
        this.projectiles.push(new Projectile(this, x, y, width, height, speedX, speedY, isPlayerProjectile, damage));
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    increaseDifficulty() {
        this.level++;
        document.getElementById('level').textContent = `Level: ${this.level}`;
        
        // Increase enemy speed and spawn rate based on level
        this.enemySpawnInterval = Math.max(20, this.enemySpawnInterval - 2);
        
        // Every 5 levels, increase max enemies and add more variety
        if (this.level % 5 === 0) {
            // Add more enemies per wave
            for (let i = 0; i < 2; i++) {
                setTimeout(() => this.spawnEnemy(), i * 500);
            }
        }
    }
    
    togglePause() {
        this.paused = !this.paused;
        
        if (!this.paused && !this.gameOver) {
            this.lastTime = performance.now();
            this.gameLoop(performance.now());
        }
    }
    
    gameOver() {
        this.gameOver = true;
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over').style.display = 'flex';
    }
    
    reset() {
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.paused = false;
        this.lastTime = 0;
        this.accumulator = 0;
        this.enemySpawnTimer = 0;
        this.lastDifficultyIncrease = 0;
        
        // Clear all game objects
        this.projectiles = [];
        this.enemies = [];
        this.particles = [];
        this.powerUps = [];
        this.explosions = [];
        
        // Reset player
        this.player.reset();
        
        // Reset UI
        document.getElementById('score').textContent = 'Score: 0';
        document.getElementById('level').textContent = 'Level: 1';
        document.getElementById('lives').textContent = 'Lives: 3';
        document.getElementById('game-over').style.display = 'none';
    }
    
    start() {
        this.reset();
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
    
    gameLoop(timestamp) {
        if (this.gameOver) return;
        
        // Calculate delta time
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Update game state
        this.accumulator += deltaTime;
        while (this.accumulator >= this.timeStep) {
            this.handleInput();
            this.update(this.timeStep);
            this.accumulator -= this.timeStep;
        }
        
        // Render
        this.draw();
        
        // Continue the game loop
        if (!this.paused) {
            requestAnimationFrame(this.gameLoop);
        }
    }
}

// Particle class for visual effects
class Particle {
    constructor(x, y, size, color, velocity, rotationSpeed = 0, scaleSpeed = 0, gravity = 0) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = rotationSpeed;
        this.scale = 1;
        this.scaleSpeed = scaleSpeed;
        this.gravity = gravity;
        this.friction = 0.98;
        this.alpha = 1;
        this.markedForDeletion = false;
    }
    
    update() {
        // Update position
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        
        // Apply gravity
        this.velocity.y += this.gravity;
        
        // Update rotation and scale
        this.rotation += this.rotationSpeed;
        this.scale += this.scaleSpeed;
        
        // Fade out
        this.alpha -= 0.01;
        
        // Mark for deletion when fully transparent
        if (this.alpha <= 0) {
            this.markedForDeletion = true;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        
        // Draw a simple square particle
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        
        ctx.restore();
    }
}

// Power-up class
class PowerUp {
    constructor(x, y, type, color, text) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        this.text = text;
        this.width = 40;
        this.height = 40;
        this.speed = 1.5;
        this.angle = 0;
        this.pulseSpeed = 0.05;
        this.pulseSize = 1;
        this.markedForDeletion = false;
    }
    
    update() {
        // Move down
        this.y += this.speed;
        
        // Pulsing effect
        this.angle += this.pulseSpeed;
        this.pulseSize = 1 + Math.sin(this.angle) * 0.1;
    }
    
    draw(ctx) {
        ctx.save();
        
        // Draw glow
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2,
            this.y + this.height / 2,
            0,
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2 * 1.5
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2 * 1.5,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw power-up body
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(this.pulseSize, this.pulseSize);
        
        // Draw different shapes based on type
        switch (this.type) {
            case 'extraLife':
                this.drawHeart(ctx);
                break;
            case 'weaponUpgrade':
                this.drawStar(ctx);
                break;
            case 'shield':
                this.drawShield(ctx);
                break;
            case 'slowMotion':
                this.drawClock(ctx);
                break;
            default:
                this.drawDiamond(ctx);
        }
        
        ctx.restore();
        
        // Draw text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        
        ctx.restore();
    }
    
    drawHeart(ctx) {
        const x = -this.width / 2;
        const y = -this.height / 2;
        const w = this.width;
        const h = this.height;
        
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y + h / 5);
        ctx.bezierCurveTo(
            x + (1.1 * w) / 2, y,
            x + w, y,
            x + w, y + h / 3
        );
        ctx.bezierCurveTo(
            x + w, y + h / 2,
            x + w / 2, y + h,
            x + w / 2, y + h
        );
        ctx.bezierCurveTo(
            x + w / 2, y + h,
            x, y + h / 2,
            x, y + h / 3
        );
        ctx.bezierCurveTo(
            x, y,
            x + (w - 1.1 * w / 2), y,
            x + w / 2, y + h / 5
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    drawStar(ctx) {
        const x = -this.width / 2;
        const y = -this.height / 2;
        const w = this.width;
        const h = this.height;
        
        ctx.beginPath();
        const spikes = 5;
        const outerRadius = Math.min(w, h) / 2;
        const innerRadius = outerRadius * 0.4;
        let rot = Math.PI / 2 * 3;
        let xPos = 0;
        let yPos = 0;
        const step = Math.PI / spikes;
        
        ctx.beginPath();
        ctx.moveTo(0, 0 - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            xPos = Math.cos(rot) * outerRadius;
            yPos = Math.sin(rot) * outerRadius;
            ctx.lineTo(xPos, yPos);
            rot += step;
            
            xPos = Math.cos(rot) * innerRadius;
            yPos = Math.sin(rot) * innerRadius;
            ctx.lineTo(xPos, yPos);
            rot += step;
        }
        
        ctx.lineTo(0, 0 - outerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    drawShield(ctx) {
        const x = -this.width / 2;
        const y = -this.height / 2;
        const w = this.width;
        const h = this.height;
        
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + h / 3);
        ctx.quadraticCurveTo(x + w, y + h * 2/3, x + w / 2, y + h);
        ctx.quadraticCurveTo(x, y + h * 2/3, x, y + h / 3);
        ctx.quadraticCurveTo(x, y, x + w / 2, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    drawClock(ctx) {
        const x = -this.width / 2;
        const y = -this.height / 2;
        const w = this.width;
        const h = this.height;
        
        // Draw clock face
        ctx.beginPath();
        ctx.arc(0, 0, w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw clock hands
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        
        // Hour hand
        ctx.save();
        ctx.rotate(-Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.3, 0);
        ctx.stroke();
        
        // Minute hand
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -h * 0.4);
        ctx.stroke();
        ctx.restore();
    }
    
    drawDiamond(ctx) {
        const x = -this.width / 2;
        const y = -this.height / 2;
        const w = this.width;
        const h = this.height;
        
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h / 2);
        ctx.lineTo(x + w / 2, y + h);
        ctx.lineTo(x, y + h / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    apply(player) {
        switch (this.type) {
            case 'extraLife':
                player.lives = Math.min(player.maxLives, player.lives + 1);
                document.getElementById('lives').textContent = `Lives: ${player.lives}`;
                break;
                
            case 'weaponUpgrade':
                // In a more complete game, this would upgrade the player's weapon
                player.shootCooldownMax = Math.max(5, player.shootCooldownMax - 2);
                break;
                
            case 'shield':
                // Make player temporarily invincible
                player.isInvincible = true;
                player.invincibleTimer = 0;
                break;
                
            case 'slowMotion':
                // Slow down enemies for a short time
                // This would be implemented in the game's update loop
                break;
        }
    }
}
