#!/bin/bash

# Hop Hop Puff - Pre-Commit Hook Setup Script
# This script sets up cross-platform testing hooks for the repository

echo "🎮 Hop Hop Puff - Pre-Commit Hook Setup"
echo "======================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ ERROR: Not in a git repository"
    echo "   Run this script from the root of your git repository"
    exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Make sure the pre-commit hook is executable
if [ -f ".git/hooks/pre-commit" ]; then
    chmod +x .git/hooks/pre-commit
    echo "✅ Pre-commit hook is now executable"
else
    echo "❌ ERROR: Pre-commit hook not found at .git/hooks/pre-commit"
    echo "   The hook should be created automatically"
    exit 1
fi

# Check if tests directory exists
if [ ! -d "tests" ]; then
    echo "📁 Creating tests directory..."
    mkdir -p tests
    echo "✅ Tests directory created"
fi

# Move any test files from root to tests directory
if ls *test*.html 1> /dev/null 2>&1; then
    echo "📦 Moving test files to tests directory..."
    mv *test*.html tests/
    echo "✅ Test files moved to tests/"
fi

# Test the make test command
echo "🧪 Testing make test command..."
if command -v make >/dev/null 2>&1; then
    echo "✅ Make command available"
else
    echo "❌ ERROR: Make command not found"
    echo "   Install make to use pre-commit hooks"
    exit 1
fi

# Test if python is available for server
echo "🐍 Testing Python server..."
if command -v python3 >/dev/null 2>&1; then
    echo "✅ Python3 available for development server"
elif command -v python >/dev/null 2>&1; then
    echo "✅ Python available for development server"
else
    echo "❌ ERROR: Python not found"
    echo "   Install Python to run development server"
    exit 1
fi

# Test pre-commit hook manually
echo "🔍 Testing pre-commit hook..."
echo "   Running a dry-run of the pre-commit checks..."

# Check test file organization
if find . -maxdepth 1 -name "*test*.html" -type f | grep -q .; then
    echo "❌ WARNING: Test files found in root directory"
    echo "   Move them to tests/ directory"
else
    echo "✅ Test files properly organized in tests/"
fi

echo ""
echo "🎉 Pre-commit hook setup complete!"
echo ""
echo "Next steps:"
echo "1. Make changes to your code"
echo "2. Run: git add -A"
echo "3. Run: git commit -m 'Your message'"
echo "4. The pre-commit hook will automatically run tests"
echo ""
echo "Manual testing:"
echo "  make test              # Run comprehensive test suite"
echo "  make mobile-test       # Test mobile functionality"
echo "  make visual-test       # Test visual rendering"
echo ""
echo "The hook will prevent commits if tests fail!" 