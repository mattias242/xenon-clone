# Xenon Clone - Authentic Recreation

A faithful web-based recreation of the classic Amiga game **Xenon** (1988), featuring the iconic dual-mode ship system and authentic gameplay mechanics.

## 🎮 Authentic Xenon Features

- **Dual-Mode Ship System**: Transform between Aircraft and Tank modes (X key)
- **Auto-Scrolling Gameplay**: Screen scrolls vertically at constant pace
- **Progressive Weapon System**: 4 weapon levels with different firing patterns
- **Smart Bomb System**: Screen-clearing bombs (Z key)
- **Authentic Power-ups**: Speed, Weapon, Shield, Smart Bomb, Extra Life
- **Enemy Variety**: Different enemy types with unique behaviors
- **Visual Effects**: Particle explosions, screen shake, engine glow
- **Responsive Controls**: Works on both desktop (keyboard) and mobile (touch)

## 🕹️ Controls

### Desktop
- **Arrow Keys**: Move ship
- **Space**: Shoot
- **X**: Transform between Aircraft/Tank modes
- **Z**: Use Smart Bomb
- **P**: Pause/Resume
- **R**: Restart after game over

### Mobile
- **Touch & Drag**: Move ship
- **Touch Bottom**: Shoot
- **Touch Left Side**: Smart Bomb
- **Touch Right Side**: Transform
- **Tap**: Restart after game over

## 🚀 Ship Modes

### Aircraft Mode (Default)
- **Faster movement** (6 pixels/frame)
- **Shoots straight ahead**
- **More vulnerable** to ground enemies
- **Better for dodging** aerial threats

### Tank Mode (Press X)
- **Slower movement** (3 pixels/frame)
- **Shoots upward at angle**
- **More protected** from aerial enemies
- **Better firepower** against ground targets

## 🔫 Weapon Progression

**Level 1**: Single shot
**Level 2**: Dual shots
**Level 3**: Triple spread
**Level 4**: Wide spread with increased fire rate

## 💥 Power-ups

- **SPD (Yellow)**: Speed boost (10 seconds)
- **POW (Cyan)**: Weapon upgrade
- **SHLD (Blue)**: Temporary shield (5 seconds)
- **BOMB (Magenta)**: Smart bomb
- **1UP (Green)**: Extra life

## 🎯 Gameplay

The game features **auto-scrolling** - the screen moves upward at a constant pace, creating tension as enemies approach from above. Use the **dual-mode system** strategically:

- **Aircraft mode** for speed and aerial combat
- **Tank mode** for ground-based threats and precision shooting
- **Smart bombs** to clear overwhelming situations
- **Weapon upgrades** to increase firepower

## 🛠️ Technical Implementation

- **Pure JavaScript**: No frameworks, vanilla implementation
- **HTML5 Canvas**: Hardware-accelerated rendering
- **60 FPS Game Loop**: Smooth, responsive gameplay
- **Collision Detection**: Precise hit detection
- **Particle Effects**: Visual feedback for explosions
- **Screen Shake**: Impact feedback for smart bombs
- **Responsive Design**: Works on desktop and mobile

## 📁 Project Structure

```
xenon-clone/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Game styling
├── js/
│   ├── game.js         # Core game logic and management
│   ├── player.js       # Dual-mode ship system
│   ├── enemy.js        # Enemy AI and behaviors
│   ├── projectile.js   # Projectile and weapon system
│   └── main.js         # Game initialization
└── tests/              # TDD test suite
    ├── test-framework.js
    ├── player-tests.js
    ├── enemy-tests.js
    ├── projectile-tests.js
    └── game-tests.js
```

## 🧪 Testing

This project uses **Test Driven Development (TDD)** with comprehensive test coverage:

```javascript
// Run tests in browser console
testSuite.run();
```

## 🎨 Future Enhancements

- [ ] Sound effects and chiptune music
- [ ] Multiple level themes (Industrial, Organic, Crystal, etc.)
- [ ] Boss battles
- [ ] High score persistence
- [ ] More enemy types and formations
- [ ] Sprite-based graphics
- [ ] Level editor

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Credits

Faithfully recreated from **Xenon** (1988) by The Bitmap Brothers for the Commodore Amiga.

---

Made with ❤️ for retro gaming enthusiasts and fans of The Bitmap Brothers
