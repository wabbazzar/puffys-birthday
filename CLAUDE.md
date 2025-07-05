# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hop Hop Puff is a mobile-first HTML5 game built with Phaser.js where Puffy the cat climbs through kitchen platforms to reach beef jerky at the top. This is a cat-themed reimagining of Donkey Kong with responsive design and cross-platform support.

## 🚨 MANDATORY TESTING PROTOCOL (CRITICAL - NO EXCEPTIONS)

### Test-First Development Rules
- **EVERY change MUST be tested immediately after implementation**
- **NEVER deliver code without visual verification on both mobile and desktop**
- **Start local server and test both mobile and desktop views before moving to next change**
- **Use browser dev tools to simulate mobile devices (320px-428px)**
- **Test all interactive elements (joystick, buttons, keyboard) on both platforms**
- **Verify animations, movement, and game mechanics work at 60 FPS**
- **If anything is broken, fix it before moving to next change**
- **Document what was tested and what works/doesn't work**
- **NO EXCEPTIONS - Testing is not optional, it's mandatory**

### Mandatory Commit and Push Protocol
- **EVERY working change MUST be committed AND pushed immediately**
- **Use `git add -A && git commit -m "Description" && git push` after each successful implementation**
- **NEVER leave uncommitted changes sitting locally**
- **Push to remote repository ensures backup and collaboration**
- **Descriptive commit messages with clear explanations**
- **If push fails, resolve conflicts immediately before continuing**
- **NO EXCEPTIONS - Every change must be version controlled and backed up**

## Testing Infrastructure & Commands

### Essential Testing Commands
- `make serve` - Start mobile-ready development server on port 8000 (binds to 0.0.0.0)
- `make full-test` - Complete autonomous testing workflow (start server + open game)
- `make game-test` - Open main game for testing
- `make mobile-test` - Test mobile touch controls and virtual D-pad
- `make stop-server` - Stop background development server

### Cross-Platform Visual Testing
- `make visual-test` - Test cross-platform Phaser.js canvas rendering
- `make touch-test` - Test touch event handling and latency (<50ms requirement)
- `make sprite-test` - Test Puffy 4x4 sprite animations (all 16 frames)
- `make sprite-debug` - Debug sprite loading and frame detection
- `make ladder-test` - Test ladder climbing mechanics
- `make physics-test` - Test physics isolation
- `make verify-render` - Verify render pipeline across platforms
- `make auto-test` - Automated cross-platform test suite

### Mobile-Specific Testing
- `make touch-latency-test` - Measure touch response time (<50ms)
- `make device-test` - Show mobile device connection instructions
- `make pwa-test` - Test Progressive Web App installation
- `make mobile-debug` - Debug mobile-specific issues

### Performance & Debugging
- `make check-logs` - View server activity logs
- `make clean-cache` - Show cache clearing instructions for mobile/desktop
- `make debug-render` - Debug render pipeline issues
- `make fps-test` - Monitor frame rate on mobile and desktop
- `make memory-test` - Check memory usage and leaks

## Test-First Development Workflow

### Phase 0: Test Infrastructure Setup (MANDATORY FIRST)
1. **Create Visual Test Harness Before Any Code**
   ```bash
   make serve
   make visual-test  # Verify basic canvas rendering
   make mobile-test  # Test mobile viewport (320px-428px)
   ```

2. **Mobile-First Visual Verification**
   - Test on mobile browser dev tools FIRST
   - Verify touch event detection
   - Check 44px+ touch targets
   - Test gesture recognition vs accidental touches
   - Verify 60 FPS performance on mobile

3. **Desktop Enhancement Testing**
   - Test desktop viewport (1024px+) AFTER mobile works
   - Verify keyboard controls don't break mobile
   - Test mouse interactions alongside touch
   - Ensure unified input handling works

### Phase 1: Mobile-First Feature Implementation
1. **Write Mobile Visual Test First**
   ```bash
   # Before implementing any feature:
   make mobile-test     # Test mobile interaction
   make touch-test      # Verify touch responsiveness
   make sprite-test     # Test sprite rendering
   ```

2. **Implement Mobile-First Feature**
   - Touch controls MUST work before keyboard
   - Virtual D-pad functionality takes priority
   - Test on mobile viewport before desktop
   - Verify visual feedback within 50ms

3. **Add Desktop Enhancement**
   - Add keyboard/mouse support AFTER mobile works
   - Test unified input handling
   - Verify desktop doesn't break mobile functionality

### Phase 2: Cross-Platform Integration Testing
1. **Visual Verification Protocol**
   ```bash
   make visual-test     # Cross-platform rendering
   make verify-render   # Render pipeline verification
   make auto-test       # Automated test suite
   ```

2. **Performance Testing**
   ```bash
   make fps-test        # 60 FPS on mobile and desktop
   make memory-test     # Memory usage stability
   make touch-latency-test  # <50ms touch response
   ```

3. **Cross-Platform Debugging**
   ```bash
   make debug-render    # Debug rendering issues
   make mobile-debug    # Mobile-specific debugging
   make clean-cache     # Cache-busting verification
   ```

## Testing Protocols by Feature

### Character Movement Testing
```bash
# Test sequence for character movement:
make sprite-test     # Verify 4x4 sprite sheet loading
make mobile-test     # Test virtual D-pad movement
make touch-test      # Verify touch responsiveness
make physics-test    # Test movement physics
make ladder-test     # Test ladder climbing
make game-test       # Full integration test
```

### Platform System Testing
```bash
# Test sequence for platform/ladder system:
make visual-test     # Platform rendering verification
make physics-test    # Collision detection testing
make ladder-test     # Ladder climbing mechanics
make mobile-test     # Mobile platform interaction
make game-test       # Full platform navigation
```

### Hazard System Testing
```bash
# Test sequence for hazards (when implemented):
make physics-test    # Hazard collision detection
make fps-test        # Performance with multiple hazards
make memory-test     # Memory cleanup verification
make mobile-test     # Mobile hazard interaction
make game-test       # Full hazard integration
```

## Cross-Platform Testing Requirements

### Mobile Testing Checklist
- [ ] **Viewport**: Game renders correctly on 320px-428px screens
- [ ] **Touch Controls**: Virtual D-pad responds within 50ms
- [ ] **Performance**: Maintains 60 FPS during gameplay
- [ ] **Touch Targets**: All interactive elements 44px+ minimum
- [ ] **Gestures**: Proper touch vs swipe vs tap recognition
- [ ] **Cache**: Asset loading works with mobile cache policies
- [ ] **PWA**: Installation and offline functionality
- [ ] **Battery**: Optimized for mobile battery usage

### Desktop Testing Checklist
- [ ] **Scaling**: Game scales properly on 1024px+ screens
- [ ] **Keyboard**: WASD and arrow key controls work
- [ ] **Mouse**: Mouse interactions don't interfere with touch
- [ ] **Performance**: Enhanced performance on desktop hardware
- [ ] **Accessibility**: Keyboard navigation for all UI elements
- [ ] **Fullscreen**: Optional fullscreen mode works
- [ ] **Cache**: Desktop browser cache management
- [ ] **Multi-window**: Game works with multiple browser windows

### Cross-Platform Integration Testing
- [ ] **Unified Input**: Single methods handle touch/mouse/keyboard
- [ ] **State Persistence**: Game state saves across platforms
- [ ] **Performance Parity**: Consistent 60 FPS across platforms
- [ ] **Visual Consistency**: Same visual experience on all devices
- [ ] **Asset Loading**: Consistent asset caching and loading
- [ ] **Error Handling**: Graceful degradation across platforms

## Architecture

### Core Structure
```
hop-hop-puff/
├── index.html              # Main game entry point with mobile-first design
├── game/
│   ├── main.js            # Core Phaser.js game engine with mobile optimization
│   └── sprites/
│       └── PuffySprite.js # Character sprite management with 4x4 frame system
├── assets/
│   ├── puffy_4_by_4.png   # 4x4 sprite sheet (16 frames)
│   └── [other assets]
├── styles/
│   ├── mobile.css         # Mobile-first styling
│   └── desktop.css        # Desktop enhancements
├── tests/                  # ALL test files organized in dedicated directory
│   ├── mobile_test.html   # Mobile touch control testing
│   ├── visual_test.html   # Cross-platform visual verification
│   ├── sprite_test.html   # Sprite animation testing
│   ├── physics_test.html  # Physics and collision testing
│   └── [other test files] # Additional specialized test files
├── .git/hooks/
│   └── pre-commit         # Pre-commit hook running make test
├── .pre-commit-config.yaml # Pre-commit configuration
└── Makefile               # Cross-platform testing commands
```

### Game Engine (game/main.js)
- **Phaser.js 3.70.0** with mobile-first responsive scaling
- **Vector2 class** for joystick mathematics
- **MovementButton class** for touch controls with 44px+ touch targets
- **Unified input handling** supporting both touch and keyboard
- **60 FPS target** with performance optimization for mobile

### Character System (game/sprites/PuffySprite.js)
- **4x4 sprite sheet** with dynamic frame detection (16 total frames)
- **Frame layout**: Row 0 (up), Row 1 (left), Row 2 (down), Row 3 (right/flipped left)
- **Display size**: 48x48 pixels, **Hitbox**: 32x32 pixels (centered)
- **Speed**: 100 pixels per second with smooth analog movement
- **Animation system** with direction-based sprite selection and horizontal flipping

### Mobile-First Design
- **Responsive scaling** using Phaser.Scale.FIT mode
- **Touch controls** with virtual D-pad and haptic feedback
- **Cache-busting** system for mobile browsers
- **PWA ready** with manifest and mobile meta tags

## Technical Specifications

### Performance Requirements
- **60 FPS** on mobile and desktop (NON-NEGOTIABLE)
- **Touch response time** <50ms (MANDATORY)
- **Smooth physics** with Phaser.js arcade physics system
- **Gravity**: 300 pixels/second² for platform jumping
- **Memory management** for mobile browsers
- **Battery optimization** for mobile devices

### Sprite System Details
- **Source**: 4x4 sprite sheet with automatic dimension detection
- **Animations**: 16fps for walking, 4fps for idle states
- **Frame mapping**: Pre-calculated for optimal performance
- **Collision**: Bottom pixels determine platform landing
- **Mobile optimization**: Texture atlasing and efficient rendering

### Testing Infrastructure
- **Comprehensive test suite** with specialized HTML test files
- **Cross-platform testing** for mobile and desktop
- **Performance monitoring** with FPS tracking
- **Touch latency testing** for mobile optimization
- **Visual verification harness** for both platforms
- **Automated test runner** for continuous integration

## Cross-Platform Debugging Procedures

### Mobile-Specific Debugging
1. **Touch Issues**: Test on mobile browser dev tools first
2. **Performance Problems**: Check mobile browser performance tab
3. **Virtual D-pad Not Responding**:
   - Verify touch event listeners attached
   - Check CSS touch-action properties
   - Validate touch target sizes (44px+)
4. **Sprite Animation Stuttering**:
   - Test Phaser.js performance on mobile
   - Check texture memory usage
   - Verify 60 FPS maintenance

### Desktop-Specific Debugging
1. **Keyboard Controls Not Working**:
   - Verify keyboard event listeners
   - Check focus management on game canvas
   - Test key repeat rates
2. **Scaling Issues on Large Screens**:
   - Check Phaser.js scale configuration
   - Verify CSS responsive design
   - Test on various desktop resolutions

### Cross-Platform Issues
1. **Collision Detection Inconsistent**:
   - Test hitbox visualization on both platforms
   - Verify pixel-perfect collision at different scales
   - Check for floating point precision issues
2. **Performance Degradation**:
   - Profile on both mobile and desktop
   - Check memory leaks in hazard spawning
   - Verify garbage collection efficiency

## Mandatory Testing Workflow

### Before Every Code Change
1. **Git Status Check**: `git status` to see uncommitted changes
2. **Server Running**: `make serve` to start development server
3. **Mobile Test First**: `make mobile-test` to verify mobile functionality
4. **Desktop Test Second**: `make game-test` to verify desktop functionality

### After Every Code Change
1. **Visual Verification**: Test the specific feature on both platforms
2. **Performance Check**: Verify 60 FPS maintained
3. **Cross-Platform Test**: Ensure change doesn't break other platform
4. **Pre-Commit Testing**: Git hooks automatically run `make test` before commit
5. **Commit and Push**: `git add -A && git commit -m "Description" && git push`

### Before Moving to Next Feature
1. **Full Test Suite**: `make auto-test` for comprehensive testing
2. **Performance Verification**: `make fps-test` and `make memory-test`
3. **Mobile Device Test**: Test on actual mobile device
4. **Documentation Update**: Update test results and known issues

## Pre-Commit Testing System

### Automatic Pre-Commit Hooks
The repository includes Git hooks that automatically run before each commit:

1. **Test File Organization Check**: Ensures all test files are in `tests/` directory
2. **Mobile-First Implementation Check**: Warns about desktop-only code
3. **Performance Requirements Check**: Verifies 60 FPS compliance
4. **Comprehensive Test Suite**: Runs `make test` to verify all functionality

### Pre-Commit Hook Features
- **Automatic execution**: Runs every time you commit
- **Commit blocking**: Prevents commits if tests fail
- **Cross-platform validation**: Ensures mobile and desktop compatibility
- **Performance verification**: Checks 60 FPS requirements
- **Test organization**: Enforces `tests/` directory structure

### Manual Pre-Commit Testing
You can manually run the pre-commit tests:
```bash
make test              # Run comprehensive test suite
make pre-commit-test   # Alias for make test
```

### Pre-Commit Hook Setup
The hooks are automatically configured in `.git/hooks/pre-commit` and include:
- Cross-platform testing validation
- Mobile-first implementation checks
- Performance requirement verification
- Test file organization enforcement

## Important Notes

- **Mobile-first approach**: All development prioritizes mobile experience
- **Test-first development**: Create tests before implementing features
- **Test organization**: ALL test files must be in `tests/` directory
- **Pre-commit testing**: Git hooks run `make test` before allowing commits
- **No package.json**: Pure HTML5 game using CDN-hosted Phaser.js
- **Cache-busting**: Essential for mobile browsers and game asset updates
- **Touch-first controls**: Virtual D-pad with keyboard fallback for desktop
- **Performance critical**: 60 FPS requirement across all platforms
- **Git-driven development**: Commit and push after every successful change
- **Visual verification mandatory**: Never trust console logs alone

## Game Mechanics

- **Objective**: Guide Puffy from bottom to top of kitchen platforms
- **Lives system**: 3 lives with level restart on death
- **Platform structure**: 6 horizontal levels with 2-3 ladders each
- **Controls**: Virtual D-pad (mobile) or WASD (desktop)
- **Physics**: Gravity-based with platform collision detection
- **Performance**: 60 FPS on mobile devices drives all optimization decisions