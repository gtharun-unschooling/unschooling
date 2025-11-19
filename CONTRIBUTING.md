# Contributing to Unschooling Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/unschooling.git
   cd unschooling
   ```

3. **Set up development environment:**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Code Style

### Frontend (React/JavaScript)
- Use Prettier for formatting (configured in `.prettierrc`)
- Follow ESLint rules (configured in `.eslintrc.js`)
- Use functional components with hooks
- Follow naming conventions: PascalCase for components, camelCase for functions

### Backend (Python)
- Follow PEP 8 style guide
- Use type hints where possible
- Maximum line length: 120 characters
- Use 4 spaces for indentation

### Git Commits
- Use clear, descriptive commit messages
- Follow conventional commits format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `style:` for formatting
  - `refactor:` for code refactoring
  - `test:` for tests
  - `chore:` for maintenance

## 🧪 Testing

Before submitting a PR:
- Run frontend tests: `npm test`
- Run backend tests: `pytest` (if available)
- Test manually in your local environment
- Ensure no console errors or warnings

## 📋 Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Update CHANGELOG.md** with your changes
3. **Ensure all tests pass**
4. **Request review** from maintainers
5. **Address feedback** promptly

## 🐛 Reporting Bugs

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (OS, browser, Node/Python versions)
- Screenshots if applicable

## 💡 Feature Requests

For feature requests:
- Check if the feature already exists
- Describe the use case
- Explain how it would benefit users
- Consider implementation complexity

## 📞 Questions?

- Open an issue for discussion
- Check existing documentation in `docs/`
- Review `README.md` for project overview

Thank you for contributing! 🎉

