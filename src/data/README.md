# Data Structure Documentation

## Overview
This directory contains organized learning content for both **Niches** and **Essential Growth** pillars.

## Structure

```
src/data/
├── niches/                    # Niche-based learning content
│   ├── index.json            # Main niches index
│   ├── finance/              # Finance niche
│   │   ├── index.json        # Niche metadata
│   │   └── topics.json       # Topics and activities
│   ├── communication/        # Communication niche
│   ├── ai/                   # AI niche
│   └── ...                   # Other niches
│
├── essential-growth/         # Essential Growth pillars
│   ├── index.json           # Main pillars index
│   ├── play-creativity/     # Play & Creativity pillar
│   │   ├── index.json       # Pillar metadata
│   │   └── activities.json  # Activities and topics
│   ├── cognitive-skills/    # Cognitive Skills pillar
│   └── ...                  # Other pillars
│
└── README.md               # This file
```

## Data Types

### Niches
- **Purpose**: Subject-specific learning content
- **Structure**: Each niche has topics with activities
- **Age Groups**: 3-5, 6-8, 9-12, 13-15, 16-18
- **Content**: Topics, activities, materials, assessments

### Essential Growth
- **Purpose**: Holistic development pillars
- **Structure**: Each pillar has topics with activities
- **Age Groups**: 3-5, 6-8, 9-12, 13-15, 16-18
- **Content**: Activities, materials, assessments, parent guides

## File Formats

### Index Files
- **Purpose**: Metadata and structure information
- **Contains**: Basic info, categories, age groups, content types

### Topic/Activity Files
- **Purpose**: Actual learning content
- **Contains**: Activities, materials, steps, learning objectives

## Usage

```javascript
import { loadEssentialGrowthPillar, loadNiche } from '../utils/dataLoader';

// Load a specific pillar
const playCreativity = await loadEssentialGrowthPillar('play-creativity');

// Load a specific niche
const finance = await loadNiche('finance');
```

## Benefits

1. **Organized**: Clear separation between niches and essential growth
2. **Scalable**: Easy to add new niches/pillars
3. **Maintainable**: Each niche/pillar is self-contained
4. **Flexible**: Can load individual pieces or full datasets
5. **Version Control**: Easy to track changes per niche/pillar

## Future Enhancements

- Add progress tracking data
- Include assessment rubrics
- Add parent guide content
- Include multimedia resources
- Add localization support
