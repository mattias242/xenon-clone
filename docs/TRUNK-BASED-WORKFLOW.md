# Trunk-Based Development Workflow
# ================================

## Overview
This project follows **Trunk-Based Development** (TBD) practices:
- Single main branch (main/trunk)
- Short-lived feature branches (hours/days, not weeks)
- Frequent commits to main
- No merge commits - use rebase instead

## Branch Strategy

### Main Branch (main)
- **Protected branch** - requires pull request for changes
- **Always deployable** - should pass all tests
- **Single source of truth** for the project

### Feature Branches
- **Short-lived** (1-2 days maximum)
- **Descriptive names**: `feat/xenon-authentic-mode`, `fix/enemy-collision`
- **Frequent rebases** onto main
- **Delete after merge**

## Commit Guidelines

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code restructuring
- **test**: Test additions/modifications
- **chore**: Maintenance tasks

### Examples
```
feat(player): Add dual-mode ship transformation

- Implement aircraft/tank switching with X key
- Add transformation animation and sound effects
- Update collision detection for both modes

Closes #42
```

```
fix(game): Fix collision detection edge case

- Handle projectiles at screen boundaries correctly
- Prevent false positives in collision checks
```

## Development Workflow

### Starting New Work
```bash
# 1. Ensure you're up to date
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feat/new-feature-name

# 3. Make changes and commit frequently
git add .
git commit -m "feat: Add initial implementation"
```

### During Development
```bash
# Frequent commits with clear messages
git add .
git commit -m "feat: Add transformation animation"

# Keep branch updated with main
git fetch origin main
git rebase origin/main

# If conflicts arise, resolve them
# Edit conflicted files, then:
git add .
git rebase --continue
```

### Finishing Feature
```bash
# Final commit
git add .
git commit -m "feat: Complete dual-mode ship system

- Aircraft and tank modes fully implemented
- Smooth transformation animations
- Updated controls and HUD"

# Push feature branch
git push origin feat/feature-name

# Create pull request on GitHub
# (Requires approval before merging)

# After PR approval, merge happens via GitHub
# Feature branch is deleted after merge
```

## Quality Gates

### Before Committing
- [ ] **Tests pass**: Run `testSuite.run()` in browser console
- [ ] **Code works**: Manual testing completed
- [ ] **No linting errors**: Code follows style guidelines
- [ ] **Clear commit message**: Describes what and why

### Before Merging to Main
- [ ] **All tests pass**
- [ ] **Code review approved**
- [ ] **No breaking changes**
- [ ] **Documentation updated**

## Pull Request Process

### Creating PR
1. **Small, focused changes** (one feature/fix per PR)
2. **Clear title** matching commit message format
3. **Detailed description** of changes and testing
4. **Links to related issues** if applicable

### PR Template
```
## Description
[Brief description of changes]

## Changes Made
- [ ] Feature 1: Description
- [ ] Feature 2: Description

## Testing
- [ ] Manual testing completed
- [ ] All existing tests pass
- [ ] New tests added if needed

## Related Issues
Closes #123
```

## Continuous Integration

### Automated Checks
- **Test suite runs** on every commit
- **Linting** checks code style
- **Build verification** ensures game runs
- **Cross-browser testing** (future enhancement)

### Manual Testing Checklist
- [ ] **Desktop Chrome**: Full game cycle
- [ ] **Desktop Firefox**: Core functionality
- [ ] **Mobile Safari**: Touch controls work
- [ ] **Mobile Chrome**: Responsive design
- [ ] **Game Over flow**: Restart functionality
- [ ] **All power-ups**: Collection and effects
- [ ] **All enemy types**: Spawn and behavior
- [ ] **Transform mechanics**: Aircraft ↔ Tank

## Best Practices

### Daily Workflow
1. **Start day**: `git pull origin main`
2. **Work in feature branch**
3. **Commit frequently** with clear messages
4. **Test thoroughly** before finishing
5. **Keep feature branches short**

### Code Quality
- **Small commits** (one logical change per commit)
- **Descriptive messages** (what + why)
- **Tests first** (TDD approach)
- **No commented code** in production
- **Consistent formatting**

### Team Collaboration
- **Communicate** about large changes
- **Review each other's code**
- **Help with conflicts**
- **Share knowledge**

## Emergency Fixes

For critical bugs requiring immediate attention:

```bash
# Create hotfix branch from main
git checkout -b hotfix/critical-bug

# Make minimal fix
git add .
git commit -m "fix: Critical collision bug in player damage"

# Push and create emergency PR
git push origin hotfix/critical-bug
```

## Tools and Commands

### Essential Commands
```bash
# Branch management
git checkout -b feat/new-feature
git branch -d feat/old-feature

# Keeping updated
git fetch origin main
git rebase origin/main

# Undoing mistakes
git reset --soft HEAD~1  # Undo last commit, keep changes
git reset --hard HEAD~1  # Undo last commit, discard changes
git reflog              # See history of branch changes
```

### Useful Aliases
```bash
# Add to ~/.gitconfig or ~/.zshrc
alias gco='git checkout'
alias gcb='git checkout -b'
alias gcm='git commit -m'
alias gst='git status'
alias gpl='git pull origin main'
alias gps='git push'
```

## Success Metrics

### Trunk-Based Development Goals
- ✅ **Fast feedback** (minutes, not hours)
- ✅ **Small batch sizes** (commits, not features)
- ✅ **High confidence** (tests and automation)
- ✅ **Easy rollbacks** (revert single commits)
- ✅ **Team collaboration** (shared main branch)

### Project Health Indicators
- **Test coverage** > 90%
- **Mean time to resolution** < 1 day
- **Deployment frequency** > daily
- **Change failure rate** < 5%

---

*This workflow ensures rapid, reliable development while maintaining code quality and team collaboration.*
