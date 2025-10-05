class Projectile {
    constructor(game, x, y, width, height, speedX, speedY, isPlayerProjectile, damage = 1) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = speedX;
        this.speedY = speedY;
        this.isPlayerProjectile = isPlayerProjectile;
        this.damage = damage;
        this.markedForDeletion = false;
        this.trailParticles = [];
        this.trailTimer = 0;
        this.trailInterval = 2; // Add a trail particle every X frames
    }

    update() {
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Update trail particles
        this.trailTimer++;
        if (this.trailTimer >= this.trailInterval) {
            this.trailTimer = 0;
            this.addTrailParticle();
        }
        
        // Update existing trail particles
        for (let i = this.trailParticles.length - 1; i >= 0; i--) {
            this.trailParticles[i].alpha -= 0.05;
            this.trailParticles[i].size *= 0.95;
            if (this.trailParticles[i].alpha <= 0.1) {
                this.trailParticles.splice(i, 1);
            }
        }
        
        // Check if projectile is off screen
        if (this.y < 0 || this.y > this.game.height || 
            this.x < 0 || this.x > this.game.width) {
            this.markedForDeletion = true;
        }
    }
    
    addTrailParticle() {
        const particle = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            size: Math.random() * 3 + 2,
            color: this.isPlayerProjectile ? '#0ff' : '#f0f',
            alpha: 0.7,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        };
        this.trailParticles.push(particle);
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
            
            // Update particle position for next frame
            particle.x += particle.speedX;
            particle.y += particle.speedY;
        }
        context.globalAlpha = 1;
        context.restore();
        
        // Draw the projectile
        context.save();
        
        if (this.isPlayerProjectile) {
            // Player projectile (laser)
            const gradient = context.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
            gradient.addColorStop(0, '#00ffff');
            gradient.addColorStop(0.5, '#00aaff');
            gradient.addColorStop(1, '#0066ff');
            
            context.fillStyle = gradient;
            context.shadowColor = '#00ffff';
            context.shadowBlur = 10;
            context.fillRect(this.x, this.y, this.width, this.height);
            
            // Glow effect
            context.globalCompositeOperation = 'lighter';
            context.globalAlpha = 0.5;
            context.fillStyle = '#00ffff';
            context.fillRect(this.x - 2, this.y - 5, this.width + 4, this.height + 10);
        } else {
            // Enemy projectile (energy ball)
            const gradient = context.createRadialGradient(
                this.x + this.width / 2, 
                this.y + this.height / 2, 
                0,
                this.x + this.width / 2, 
                this.y + this.height / 2, 
                Math.max(this.width, this.height) / 2
            );
            gradient.addColorStop(0, '#ff00ff');
            gradient.addColorStop(0.7, '#cc00cc');
            gradient.addColorStop(1, '#990099');
            
            context.fillStyle = gradient;
            context.beginPath();
            context.arc(
                this.x + this.width / 2, 
                this.y + this.height / 2, 
                Math.max(this.width, this.height) / 2, 
                0, 
                Math.PI * 2
            );
            context.fill();
            
            // Glow effect
            context.globalCompositeOperation = 'lighter';
            context.globalAlpha = 0.3;
            context.fillStyle = '#ff00ff';
            context.arc(
                this.x + this.width / 2, 
                this.y + this.height / 2, 
                Math.max(this.width, this.height) / 2 * 1.5, 
                0, 
                Math.PI * 2
            );
            context.fill();
        }
        
        context.restore();
    }
}
