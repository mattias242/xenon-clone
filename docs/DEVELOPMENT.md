# Xenon Clone - Development Configuration

## Project Structure
```
xenon-clone/
├── .github/workflows/     # CI/CD pipelines
│   └── ci-cd.yml         # GitHub Actions workflow
├── js/                   # Source code
├── css/                  # Stylesheets
├── tests/                # Test suite
├── docs/                 # Documentation
│   └── TRUNK-BASED-WORKFLOW.md
├── .gitignore           # Git ignore rules
├── .editorconfig        # Editor configuration
├── package.json         # Node.js dependencies (future)
└── README.md           # Project documentation
```

## Development Tools Setup

### Required Tools
- **Git** - Version control
- **Modern browser** - For testing (Chrome/Firefox)
- **Text editor/IDE** - VS Code, WebStorm, etc.

### Optional Tools (Recommended)
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Live Server** - Development server

## Quick Start

```bash
# 1. Clone and setup
git clone https://github.com/mattias242/xenon-clone.git
cd xenon-clone

# 2. Start development server (optional)
# Install live-server: npm install -g live-server
# live-server

# 3. Open in browser
open index.html

# 4. Run tests in browser console
# Open Developer Tools → Console
# Type: testSuite.run()
```

## Testing

### Running Tests
1. **Open** `index.html` in browser
2. **Open Developer Console** (F12)
3. **Run**: `testSuite.run()`

### Test Categories
- **Player Tests**: Ship mechanics, transformation, power-ups
- **Enemy Tests**: AI behavior, collision detection
- **Projectile Tests**: Movement, collision, effects
- **Game Tests**: State management, game loop, scoring

## Git Workflow

### Daily Development
```bash
# Start your day
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/new-feature

# Work and commit frequently
git add .
git commit -m "feat: Add feature description"

# Keep branch updated
git fetch origin main
git rebase origin/main

# Push for review
git push origin feat/new-feature
```

### After Feature Complete
1. **Create Pull Request** on GitHub
2. **Request review** from team
3. **Address feedback**
4. **Merge when approved**
5. **Delete feature branch**

## Code Style Guidelines

### JavaScript
- **ES6+ syntax** (const/let, arrow functions, etc.)
- **Consistent indentation** (2 spaces)
- **Clear variable names** (camelCase)
- **JSDoc comments** for classes and methods
- **No console.log** in production code

### CSS
- **Consistent naming** (kebab-case)
- **Logical organization** (base, layout, components)
- **Mobile-first** responsive design
- **Consistent units** (px for fixed, em/rem for scalable)

### HTML
- **Semantic markup** when possible
- **Valid HTML5**
- **Consistent indentation** (2 spaces)
- **Meaningful attributes** (alt text, etc.)

## Performance Guidelines

### Game Performance
- **60 FPS target** for smooth gameplay
- **Efficient collision detection**
- **Object pooling** for projectiles and particles
- **Minimal DOM manipulation**

### Code Performance
- **No blocking operations** in game loop
- **Efficient algorithms** for game logic
- **Minimal memory allocations** per frame
- **Event delegation** for UI interactions

## Debugging

### Browser DevTools
- **Console**: JavaScript errors and logging
- **Sources**: Set breakpoints and step through code
- **Performance**: Profile game loop performance
- **Memory**: Monitor memory usage

### Debug Techniques
```javascript
// Temporary logging (remove before commit)
console.log('Player position:', this.x, this.y);

// Performance profiling
console.time('Frame time');
// ... frame logic ...
console.timeEnd('Frame time');

// Debug collision boxes
ctx.strokeStyle = '#ff0000';
ctx.strokeRect(this.x, this.y, this.width, this.height);
```

## Deployment

### Development
- **Local testing**: Open index.html directly
- **Live server**: For development with auto-reload
- **Mobile testing**: Use browser dev tools device emulation

### Production (Future)
- **GitHub Pages**: Static hosting
- **CDN**: For faster asset loading
- **PWA**: Offline capability
- **Analytics**: Track gameplay metrics

## Contributing Guidelines

### Before Starting Work
1. **Check existing issues** on GitHub
2. **Create issue** for new features/bugs
3. **Get assignment** or self-assign
4. **Follow workflow** outlined in TRUNK-BASED-WORKFLOW.md

### Code Review Checklist
- [ ] **Tests pass** (run test suite)
- [ ] **No linting errors**
- [ ] **Code style consistent**
- [ ] **Documentation updated**
- [ ] **Manual testing completed**
- [ ] **No console errors**

### After Merge
- [ ] **Feature branch deleted**
- [ ] **Main branch tested**
- [ ] **Documentation updated if needed**
- [ ] **Team notified of changes**

## Project Health

### Weekly Checks
- **All tests passing**
- **No broken features**
- **Performance benchmarks met**
- **Code coverage maintained**
- **Dependencies updated**

### Release Checklist
- [ ] **All tests pass**
- [ ] **Manual testing complete**
- [ ] **Documentation updated**
- [ ] **Performance verified**
- [ ] **Cross-browser testing**
- [ ] **Mobile compatibility**
- [ ] **README updated**
- [ ] **Version bumped**

---

*This configuration ensures consistent, high-quality development practices for the Xenon Clone project.*
