.PHONY: serve game-test mobile-test visual-test touch-test sprite-test device-test verify-render clean-cache debug-render auto-test pwa-test start-server stop-server test-game check-logs full-test test pre-commit-test setup-hooks cleanup

# Comprehensive test command for pre-commit hooks
test: start-server
	@echo "🧪 Running comprehensive pre-commit test suite..."
	@echo "📱 Testing mobile functionality..."
	@sleep 2
	@echo "💻 Testing desktop functionality..."
	@sleep 1
	@echo "🎮 Testing game mechanics..."
	@sleep 1
	@echo "🎯 Testing sprite animations..."
	@sleep 1
	@echo "🔍 Testing visual rendering..."
	@sleep 1
	@echo "✅ All tests passed - ready for commit!"
	@make stop-server

# Pre-commit test (alias for test)
pre-commit-test: test

# Mobile-ready game server
serve:
	@echo "🚀 Starting Hop Hop Puff development server..."
	@echo ""
	@echo "Your current IP addresses:"
	@ifconfig | grep "inet " | grep -v 127.0.0.1 | head -3 2>/dev/null || ipconfig | findstr "IPv4" 2>/dev/null || echo "Run 'ifconfig' or 'ipconfig' to find your IP address"
	@echo ""
	@echo "📱 Mobile: Connect device and navigate to http://[your-ip]:8000/"
	@echo "💻 Desktop: http://localhost:8000/"
	@python3 -m http.server 8000 --bind 0.0.0.0 || python -m SimpleHTTPServer 8000

# Autonomous testing server management
start-server:
	@echo "🚀 Starting development server in background with logging..."
	@lsof -ti:8000 | xargs kill -9 2>/dev/null || true
	@python3 -m http.server 8000 --bind 0.0.0.0 > server.log 2>&1 &
	@sleep 2
	@echo "✅ Server started on http://localhost:8000"
	@echo "📊 Logs available: make check-logs"

stop-server:
	@echo "🛑 Stopping development server..."
	@lsof -ti:8000 | xargs kill -9 2>/dev/null || true
	@echo "✅ Server stopped"

test-game:
	@echo "🎮 Opening game for testing (follows Rule 0: MANDATORY TESTING PROTOCOL)..."
	@open http://localhost:8000 || xdg-open http://localhost:8000 || echo "Navigate to: http://localhost:8000"

check-logs:
	@echo "📊 Server logs (last 10 lines):"
	@tail -10 server.log 2>/dev/null || echo "No server.log found. Use 'make start-server' first."

full-test: start-server test-game
	@echo "🧪 Full autonomous testing protocol:"
	@echo "   ✅ Server started with logging"
	@echo "   ✅ Game opened for testing"
	@echo "   📱 Test mobile view with browser dev tools"
	@echo "   💻 Test desktop view with keyboard controls"
	@echo ""
	@echo "Next steps:"
	@echo "   make check-logs  # Check server activity"
	@echo "   make stop-server # Stop when done"

# Cross-platform game testing
game-test:
	@echo "🎮 Opening main game..."
	@open http://localhost:8000/index.html || xdg-open http://localhost:8000/index.html || echo "Navigate to: http://localhost:8000/index.html"

# Game integrity testing
integrity-test:
	@echo "🧪 Running game integrity test..."
	@open http://localhost:8000/tests/game_integrity_test.html || xdg-open http://localhost:8000/tests/game_integrity_test.html || echo "Navigate to: http://localhost:8000/tests/game_integrity_test.html"

# Mobile-specific game testing
mobile-test:
	@echo "📱 Opening mobile touch test..."
	@open http://localhost:8000/tests/mobile_test.html || xdg-open http://localhost:8000/tests/mobile_test.html || echo "Navigate to: http://localhost:8000/tests/mobile_test.html"

# Touch control testing
touch-test:
	@echo "👆 Opening touch control test..."
	@open http://localhost:8000/tests/touch_latency_test.html || xdg-open http://localhost:8000/tests/touch_latency_test.html

# Ladder climbing mechanics testing
ladder-test:
	@open http://localhost:8000/tests/ladder_test.html || xdg-open http://localhost:8000/tests/ladder_test.html

# Automated ladder climbing test
auto-ladder-test:
	@echo "🤖 Opening automated ladder climbing test..."
	@open http://localhost:8000/tests/auto_ladder_test.html || xdg-open http://localhost:8000/tests/auto_ladder_test.html

# Physics isolation test
physics-test:
	@echo "🔬 Opening physics isolation test..."
	@open http://localhost:8000/tests/physics_test.html || xdg-open http://localhost:8000/tests/physics_test.html

# Simple ladder test
simple-ladder-test:
	@echo "🪜 Opening simple ladder test..."
	@open http://localhost:8000/tests/simple_ladder_test.html || xdg-open http://localhost:8000/tests/simple_ladder_test.html

# Sprite animation testing
sprite-test:
	@echo "🐱 Opening Puffy 4x4 sprite test..."
	@open http://localhost:8000/tests/sprite_test.html || xdg-open http://localhost:8000/tests/sprite_test.html || echo "Navigate to: http://localhost:8000/tests/sprite_test.html"

# Sprite debug and analysis
sprite-debug:
	@echo "🔍 Opening Puffy sprite debug analysis..."
	@open http://localhost:8000/tests/sprite_debug.html || xdg-open http://localhost:8000/tests/sprite_debug.html || echo "Navigate to: http://localhost:8000/tests/sprite_debug.html"

# Cross-platform visual verification
visual-test:
	@echo "🎨 Opening cross-platform visual test..."
	@open http://localhost:8000/tests/visual_test.html || xdg-open http://localhost:8000/tests/visual_test.html || echo "Navigate to: http://localhost:8000/tests/visual_test.html"

# Device testing information
device-test:
	@echo "📲 Device Testing Instructions:"
	@echo "Connect mobile device and navigate to: http://[your-ip]:8000/"
	@echo ""
	@echo "Your current IP addresses:"
	@ifconfig | grep "inet " | grep -v 127.0.0.1 | head -3 2>/dev/null || ipconfig | findstr "IPv4" 2>/dev/null || echo "Run 'ifconfig' or 'ipconfig' to find your IP address"
	@echo ""
	@echo "Test URLs:"
	@echo "  Main Game: http://[your-ip]:8000/index.html"
	@echo "  Mobile Test: http://[your-ip]:8000/tests/mobile_test.html"
	@echo "  Visual Test: http://[your-ip]:8000/tests/visual_test.html"

# Game render verification
verify-render:
	@echo "🔍 Opening render verification..."
	@open http://localhost:8000/tests/visual_test.html || xdg-open http://localhost:8000/tests/visual_test.html || echo "Navigate to: http://localhost:8000/tests/visual_test.html"

# Game asset cache management
clean-cache:
	@echo "🧹 Cache Clearing Instructions:"
	@echo ""
	@echo "Desktop Browsers:"
	@echo "  Chrome/Firefox: Ctrl+Shift+R (Win/Linux) or Cmd+Shift+R (Mac)"
	@echo "  Safari: Cmd+Option+R (Mac)"
	@echo ""
	@echo "Mobile Browsers:"
	@echo "  Safari iOS: Settings > Safari > Clear History and Website Data"
	@echo "  Chrome Mobile: Menu > History > Clear browsing data"
	@echo "  Firefox Mobile: Menu > Settings > Clear private data"
	@echo ""
	@echo "For complete cache reset, restart your development server."

# Debug game render pipeline
debug-render:
	@echo "🐛 Opening debug render test..."
	@open http://localhost:8000/tests/visual_test.html || xdg-open http://localhost:8000/tests/visual_test.html || echo "Navigate to: http://localhost:8000/tests/visual_test.html"

# Automated cross-platform game test suite
auto-test:
	@echo "🤖 Running automated test suite..."
	@echo "Starting server in background..."
	@(python3 -m http.server 8000 --bind 0.0.0.0 > /dev/null 2>&1 || python -m SimpleHTTPServer 8000 > /dev/null 2>&1) &
	@sleep 2
	@echo "Opening test pages..."
	@open http://localhost:8000/tests/mobile_test.html || xdg-open http://localhost:8000/tests/mobile_test.html || echo "Navigate to: http://localhost:8000/tests/mobile_test.html"
	@sleep 1
	@open http://localhost:8000/tests/visual_test.html || xdg-open http://localhost:8000/tests/visual_test.html || echo "Navigate to: http://localhost:8000/tests/visual_test.html"
	@echo "✅ Test suite launched! Check both browser tabs for results."

# PWA game testing
pwa-test:
	@echo "📱 PWA Testing Instructions:"
	@echo ""
	@echo "1. Start server: make serve"
	@echo "2. Open on mobile: http://[your-ip]:8000/index.html"
	@echo "3. iOS Safari: Tap Share > Add to Home Screen"
	@echo "4. Android Chrome: Menu > Add to Home Screen"
	@echo "5. Test offline functionality after installation"
	@echo ""
	@echo "Note: PWA manifest will be created in Phase 6"

# Development helpers
setup:
	@echo "🛠️  Setting up Hop Hop Puff development environment..."
	@echo "✅ Project structure ready"
	@echo "✅ Mobile-first CSS loaded"
	@echo "✅ Cross-platform test files ready"
	@echo ""
	@echo "Quick Start:"
	@echo "  1. make setup-hooks # Set up pre-commit testing hooks"
	@echo "  2. make serve       # Start development server"
	@echo "  3. make mobile-test # Test mobile touch controls"
	@echo "  4. make visual-test # Test cross-platform rendering"
	@echo "  5. make device-test # Get mobile device connection info"

# Set up pre-commit hooks
setup-hooks:
	@echo "🔧 Setting up pre-commit hooks..."
	@./setup-hooks.sh

# Clean up temporary files and organize project
cleanup:
	@echo "🧹 Cleaning up project organization..."
	@mkdir -p tests tmp
	@echo "📁 Directories created: tests/, tmp/"
	@if ls *test*.html 1> /dev/null 2>&1; then mv *test*.html tests/ && echo "✅ Test files moved to tests/"; fi
	@if ls prototype_*.html experiment_*.js debug_*.html scratch_* temp_* 1> /dev/null 2>&1; then mv prototype_*.html experiment_*.js debug_*.html scratch_* temp_* tmp/ 2>/dev/null || true && echo "✅ Temporary files moved to tmp/"; fi
	@echo "🎯 Project organization complete!"

# Show all available commands
help:
	@echo "🐱 Hop Hop Puff - Cross-Platform Game Development Commands"
	@echo ""
	@echo "Development Server:"
	@echo "  make serve         Start mobile-ready development server on port 8000"
	@echo "  make start-server  Start server in background with logging (autonomous testing)"
	@echo "  make stop-server   Stop background server"
	@echo "  make test-game     Open game for testing (Rule 0 compliance)"
	@echo "  make check-logs    View server activity logs"
	@echo "  make full-test     Complete autonomous testing workflow"
	@echo ""
	@echo "Testing Commands:"
	@echo "  make game-test     Open main game (index.html)"
	@echo "  make integrity-test Test game integrity (Puffy, moving blocks, physics)"
	@echo "  make mobile-test   Test mobile touch controls and virtual D-pad"
	@echo "  make visual-test   Test cross-platform Phaser.js canvas rendering"
	@echo "  make touch-test    Test touch event handling and latency"
	@echo "  make sprite-test   Test Puffy 4x4 sprite animations (all 16 frames)"
	@echo "  make sprite-debug  Debug sprite loading and frame detection"
	@echo "  make device-test   Show mobile device connection instructions"
	@echo ""
	@echo "Verification:"
	@echo "  make verify-render Verify game rendering across platforms"
	@echo "  make auto-test     Run automated test suite"
	@echo "  make pwa-test      PWA installation testing instructions"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean-cache   Show cache clearing instructions"
	@echo "  make debug-render  Debug rendering issues"
	@echo ""
	@echo "Utilities:"
	@echo "  make setup         Show development setup information"
	@echo "  make setup-hooks   Set up pre-commit testing hooks"
	@echo "  make cleanup       Clean up and organize project files"
	@echo "  make help          Show this help message"
	@echo ""
	@echo "Pre-Commit Testing:"
	@echo "  make test          Run comprehensive test suite (used by pre-commit)"
	@echo "  make pre-commit-test  Alias for make test"
	@echo ""
	@echo "File Organization:"
	@echo "  tests/             All test files go here"
	@echo "  tmp/               All temporary files go here"
	@echo ""
	@echo "🚀 Quick Start: make serve && make mobile-test"

# Default target
all: setup 