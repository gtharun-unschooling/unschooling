// Data loading utilities for organized content structure

// Load Essential Growth pillar data
export const loadEssentialGrowthPillar = async (pillarSlug) => {
  try {
    const indexResponse = await fetch(`/data/essential-growth/${pillarSlug}/index.json`);
    const activitiesResponse = await fetch(`/data/essential-growth/${pillarSlug}/activities.json`);
    
    const index = await indexResponse.json();
    const activities = await activitiesResponse.json();
    
    return {
      ...index,
      activities
    };
  } catch (error) {
    console.error(`Error loading Essential Growth pillar ${pillarSlug}:`, error);
    return null;
  }
};

// Load all Essential Growth pillars
export const loadAllEssentialGrowthPillars = async () => {
  try {
    const response = await fetch('/data/essential-growth/index.json');
    const index = await response.json();
    
    const pillars = await Promise.all(
      index.pillars.map(async (pillar) => {
        const pillarData = await loadEssentialGrowthPillar(pillar.slug);
        return pillarData;
      })
    );
    
    return pillars.filter(pillar => pillar !== null);
  } catch (error) {
    console.error('Error loading Essential Growth pillars:', error);
    return [];
  }
};

// Load Niche data
export const loadNiche = async (nicheSlug) => {
  try {
    const indexResponse = await fetch(`/data/niches/${nicheSlug}/index.json`);
    const topicsResponse = await fetch(`/data/niches/${nicheSlug}/topics.json`);
    
    const index = await indexResponse.json();
    const topics = await topicsResponse.json();
    
    return {
      ...index,
      topics
    };
  } catch (error) {
    console.error(`Error loading niche ${nicheSlug}:`, error);
    return null;
  }
};

// Load all Niches
export const loadAllNiches = async () => {
  try {
    const response = await fetch('/src/data/niches/index.json');
    const index = await response.json();
    
    // For now, return the index structure
    // In the future, we can load individual niche data as needed
    return index;
  } catch (error) {
    console.error('Error loading niches:', error);
    return null;
  }
};

// Get activities by age group
export const getActivitiesByAgeGroup = (activities, ageGroup) => {
  return activities.filter(activity => activity.ageGroup === ageGroup);
};

// Get topics by age group  
export const getTopicsByAgeGroup = (topics, ageGroup) => {
  return topics.filter(topic => topic.age === ageGroup);
};
