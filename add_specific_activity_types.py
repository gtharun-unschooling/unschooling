import pandas as pd

# Read the current CSV
df = pd.read_csv('essential-growth-activities.csv')

print("Adding specific activity types and filling missing information...")

# Define specific new activity types to add
new_activity_types = {
    'Play & Creativity': {
        'Infant (0-1)': [
            'Gentle Music & Rhythms',
            'Soft Toy Exploration', 
            'Colorful Visual Stimulation',
            'Gentle Movement & Dance'
        ],
        'Toddler (1-3)': [
            'Finger Painting Fun',
            'Simple Instrument Play',
            'Dress-up & Pretend',
            'Building with Soft Blocks'
        ],
        'Preschooler (3-5)': [
            'Story Creation & Acting',
            'Nature Art & Crafts',
            'Simple Cooking & Baking',
            'Music & Movement Games'
        ],
        'Child (6-8)': [
            'Advanced Art Techniques',
            'Musical Instrument Learning',
            'Drama & Performance',
            'Creative Writing & Poetry'
        ],
        'Pre-Teen (9-12)': [
            'Digital Art & Design',
            'Music Production & Recording',
            'Theater & Performance Arts',
            'Advanced Crafting & DIY'
        ],
        'Teen (13-18)': [
            'Professional Art Techniques',
            'Music Composition & Production',
            'Film & Video Creation',
            'Fashion Design & Styling'
        ]
    },
    'Cognitive Skills': {
        'Infant (0-1)': [
            'Basic Cause & Effect',
            'Object Permanence Games',
            'Simple Pattern Recognition',
            'Attention & Focus Building'
        ],
        'Toddler (1-3)': [
            'Shape & Color Sorting',
            'Simple Puzzle Solving',
            'Memory Games',
            'Basic Counting & Numbers'
        ],
        'Preschooler (3-5)': [
            'Advanced Puzzle Solving',
            'Logical Thinking Games',
            'Pattern Recognition',
            'Basic Math Concepts'
        ],
        'Child (6-8)': [
            'Strategic Thinking Games',
            'Problem-Solving Challenges',
            'Critical Analysis',
            'Advanced Math & Logic'
        ],
        'Pre-Teen (9-12)': [
            'Complex Problem Solving',
            'Scientific Method & Research',
            'Data Analysis & Statistics',
            'Advanced Reasoning'
        ],
        'Teen (13-18)': [
            'Advanced Critical Thinking',
            'Research & Investigation',
            'Complex Decision Making',
            'Innovation & Entrepreneurship'
        ]
    }
}

# Create new activities
new_activities = []
activity_counter = 1

for pillar, age_groups in new_activity_types.items():
    for age_group, categories in age_groups.items():
        for category in categories:
            # Create 3-5 activities per category
            num_activities = 4
            
            for i in range(1, num_activities + 1):
                activity_id = f"{pillar.lower().replace(' & ', '-').replace(' ', '-')}-{age_group.lower().replace(' ', '-').replace('(', '').replace(')', '')}-{category.lower().replace(' ', '-').replace('&', 'and')}-{i}"
                
                # Generate activity details
                activity_name = f"{category} Activity {i}"
                objective = f"Develop {category.lower()} skills through engaging activities"
                explanation = f"Comprehensive {category.lower()} activity designed for {age_group.lower()} cognitive development"
                
                # Age-specific time estimates
                time_estimates = {
                    'Infant (0-1)': ['5-10 min', '10-15 min'],
                    'Toddler (1-3)': ['10-20 min', '15-30 min'],
                    'Preschooler (3-5)': ['15-30 min', '20-45 min'],
                    'Child (6-8)': ['20-45 min', '30-60 min'],
                    'Pre-Teen (9-12)': ['30-60 min', '45-90 min'],
                    'Teen (13-18)': ['45-90 min', '60-120 min']
                }
                
                estimated_time = time_estimates[age_group][i % 2]
                
                # Generate specific hashtags
                hashtags = f"#{category.replace(' ', '')};#{age_group.split('(')[0].strip()};#{pillar.replace(' & ', '')};#Learning"
                
                # Generate comprehensive materials
                materials = f"Activity kit (supplied by us);Step-by-step guide (supplied by us);Progress tracking sheet (supplied by us);Age-appropriate materials;Safety equipment (if needed)"
                
                # Generate detailed steps
                steps = f"1. Prepare materials from our activity kit;2. Read our step-by-step guide;3. Set up the activity space;4. Engage in the activity with child;5. Track progress on our tracking sheet;6. Clean up and return materials"
                
                # Generate comprehensive skills
                skills = f"{category};{pillar} development;Problem solving;Creative thinking;Progress tracking;Parent-child bonding"
                
                new_activity = {
                    'Activity ID': activity_id,
                    'Pillar': pillar,
                    'Age Group': age_group,
                    'Category': category,
                    'Category Description': f"Comprehensive {category.lower()} activities for {age_group.lower()} development",
                    'Topic Number': i,
                    'Topic': activity_name,
                    'Activity Name': activity_name,
                    'Objective': objective,
                    'Explanation': explanation,
                    'Age': age_group,
                    'Estimated Time': estimated_time,
                    'Hashtags': hashtags,
                    'Materials': materials,
                    'Steps': steps,
                    'Skills': skills
                }
                
                new_activities.append(new_activity)
                activity_counter += 1

# Combine existing and new activities
if new_activities:
    new_df = pd.DataFrame(new_activities)
    enhanced_df = pd.concat([df, new_df], ignore_index=True)
else:
    enhanced_df = df.copy()

# Add additional organizational columns
enhanced_df['Activity Type'] = enhanced_df['Category'].apply(lambda x: 
    'Creative' if any(word in x.lower() for word in ['art', 'music', 'drama', 'craft', 'design', 'creative', 'drawing', 'painting']) else
    'Cognitive' if any(word in x.lower() for word in ['thinking', 'problem', 'logic', 'memory', 'focus', 'analysis', 'reasoning']) else
    'Physical' if any(word in x.lower() for word in ['movement', 'dance', 'exercise', 'sports', 'motor']) else
    'Social' if any(word in x.lower() for word in ['bonding', 'social', 'communication', 'sharing']) else
    'Mixed'
)

enhanced_df['Difficulty Level'] = enhanced_df['Age Group'].apply(lambda x: 
    'Beginner' if 'Infant' in x or 'Toddler' in x else
    'Intermediate' if 'Preschooler' in x or 'Child' in x else
    'Advanced'
)

enhanced_df['Parent Involvement'] = enhanced_df['Age Group'].apply(lambda x: 
    'High' if 'Infant' in x or 'Toddler' in x else
    'Medium' if 'Preschooler' in x or 'Child' in x else
    'Low'
)

# Fill any missing information with comprehensive defaults
enhanced_df['Materials'] = enhanced_df['Materials'].fillna('Activity kit (supplied by us);Step-by-step guide (supplied by us);Progress tracking sheet (supplied by us);Age-appropriate materials')
enhanced_df['Steps'] = enhanced_df['Steps'].fillna('1. Prepare materials from our activity kit;2. Follow our step-by-step guide;3. Engage in the activity;4. Track progress on our tracking sheet;5. Return materials when complete')
enhanced_df['Skills'] = enhanced_df['Skills'].fillna('Problem solving;Creative thinking;Progress tracking;Parent-child bonding')

# Save the enhanced version
enhanced_df.to_csv('essential-growth-activities-enhanced.csv', index=False)

print(f"Enhanced dataset created with {len(enhanced_df)} activities")
print(f"Original activities: {len(df)}")
print(f"New activities added: {len(new_activities)}")
print(f"Activity types: {enhanced_df['Activity Type'].value_counts().to_dict()}")
print(f"Difficulty levels: {enhanced_df['Difficulty Level'].value_counts().to_dict()}")
print(f"Parent involvement: {enhanced_df['Parent Involvement'].value_counts().to_dict()}")

# Show sample of new activities
print("\nSample of new activities by pillar:")
for pillar in ['Play & Creativity', 'Cognitive Skills']:
    pillar_activities = enhanced_df[enhanced_df['Pillar'] == pillar]
    print(f"\n{pillar} - {len(pillar_activities)} activities")
    print(pillar_activities[['Age Group', 'Category', 'Activity Name']].head(3).to_string())
