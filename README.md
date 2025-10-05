# Xenon Clone

A simplified web-based clone of the classic Amiga game Xenon, built with vanilla JavaScript and HTML5 Canvas.

![Game Screenshot](screenshot.png)

## 🎮 Features

- **Classic Shoot 'em Up Gameplay**: Vertical scrolling shooter inspired by the Amiga classic
- **Multiple Enemy Types**: 
  - Basic enemies with random movement patterns
  - Fast enemies for quick challenges
  - Tank enemies with high health
  - Shooter enemies that fire back
- **Power-ups**: Collect various power-ups including extra lives, weapon upgrades, and shields
- **Progressive Difficulty**: Game gets harder as you advance through levels
- **Visual Effects**: Particle explosions, projectile trails, and smooth animations
- **Responsive Controls**: Works on both desktop (keyboard) and mobile (touch)
- **Retro Aesthetic**: Green monochrome UI with classic arcade feel

## 🕹️ How to Play

### Desktop Controls
- **Arrow Keys**: Move your spaceship
- **Space**: Shoot
- **P**: Pause/Resume game
- **R**: Restart after game over

### Mobile Controls
- **Touch**: Tap and drag to move your ship
- **Auto-fire**: Ship automatically fires when touching the screen

## 🚀 Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/xenon-clone.git
   ```

2. Open `index.html` in a modern web browser

3. Click "Start Game" and enjoy!

No build process or dependencies required - just open and play!

## 📁 Project Structure

```
xenon-clone/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Game styling
├── js/
│   ├── game.js         # Core game logic and management
│   ├── player.js       # Player ship class
│   ├── enemy.js        # Enemy ship classes
│   ├── projectile.js   # Projectile and weapon system
│   └── main.js         # Game initialization
└── assets/
    ├── images/         # (Future: sprite images)
    └── sounds/         # (Future: sound effects)
```

## 🎯 Game Mechanics

### Enemy Types
- **Basic (Red)**: Standard enemy with wavy movement - 100 points
- **Fast (Yellow)**: Quick moving enemy - 200 points
- **Tank (Magenta)**: High health, slow moving - 1000 points
- **Shooter (Cyan)**: Fires projectiles at the player - 500 points

### Power-ups
- **1UP (Green)**: Extra life
- **POW (Cyan)**: Weapon upgrade (faster fire rate)
- **SHLD (Blue)**: Temporary invincibility
- **SLOW (Magenta)**: Slow motion effect

### Scoring
- Destroy enemies to earn points
- Higher difficulty enemies give more points
- Survive longer to increase your level and score multiplier

## 🛠️ Technologies Used

- **HTML5 Canvas**: For rendering graphics
- **Vanilla JavaScript**: No frameworks, pure JS
- **CSS3**: For UI styling

## 🎨 Future Enhancements

- [ ] Add sound effects and background music
- [ ] Implement boss battles
- [ ] Add more weapon types
- [ ] Create different level backgrounds
- [ ] Add high score persistence (localStorage)
- [ ] Implement combo system
- [ ] Add more power-up types
- [ ] Create sprite-based graphics

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Credits

Inspired by the classic Amiga game **Xenon** by The Bitmap Brothers.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

Made with ❤️ for retro gaming enthusiasts
