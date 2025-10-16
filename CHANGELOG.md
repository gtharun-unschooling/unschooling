# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Yellow circular profile button with user initials
- Standardized MinimalBackButton component across all pages
- Full-height hamburger menu slide on mobile

### Changed
- Reduced navbar height from 1rem to 0.5rem padding (desktop)
- Reduced navbar height to 0.25rem padding (mobile)
- Optimized hamburger menu with 2px line spacing
- Updated mobile menu fonts to 1.1rem for better readability
- Hamburger button reduced to 36px height (from 48px)

### Fixed
- Profile button text vertical centering issue
- Back button creating extra space on pages (removed paddingTop: 5rem)
- Hamburger menu full-height coverage on mobile
- Profile dropdown positioning on mobile (adjusted to 52px from 70px)
- Plan data structure - backend now saves weekly_plan correctly
- CustomisedWeeklyPlan component now reads from subcollections

---

## [1.2.0] - 2024-10-01

### Added
- Customized weekly plan feature
- Plan generation with 4-week structure
- Month selector for plans
- Mobile-friendly plan card display

### Changed
- Migrated plan storage from nested objects to subcollections
- Updated frontend to read plans from subcollections

### Fixed
- Plan data structure (moved from nested to subcollections)
- Firebase document size limit issues

---

## [1.1.0] - 2024-09-15

### Added
- Payment integration
- Profile creation flow

---

## [1.0.0] - 2024-09-01

### Added
- Initial production release
- User authentication with Google Sign-In
- Basic learning plan generation
- Firebase integration

