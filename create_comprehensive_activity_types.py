import pandas as pd
import random

# Read the current CSV
df = pd.read_csv('essential-growth-activities.csv')

print("Creating comprehensive activity types...")

# Define different activity types
activity_types = {
    'Play & Creativity': [
        'Sensory Exploration',
        'Tummy Time Play', 
        'Interactive Sounds & Textures',
        'Parent-Child Bonding Activities',
        'Pretend Play',
        'Building with Blocks',
        'Drawing & Scribbling',
        'Exploring Musical Instruments',
        'Imaginative Play with Dolls',
        'Simple Crafting',
        'Role-playing Games',
        'Creative Storytelling',
        'Advanced Drawing & Painting',
        'DIY Craft Projects',
        'Inventing Games',
        'Design Thinking for Toys',
        'Stop-motion Animation Projects',
        'Music Composition & Recording',
        'Sculpting & 3D Modeling',
        'Artistic Performance & Design',
        'Creating Digital Art',
        'Building and Designing Gadgets',
        'Independent Fashion Design'
    ],
    'Cognitive Skills': [
        'Visual Tracking & Focus',
        'Cause and Effect Learning',
        'Memory Development',
        'Problem Solving Basics',
        'Logical Thinking',
        'Pattern Recognition',
        'Critical Analysis',
        'Creative Problem Solving',
        'Advanced Reasoning',
        'Strategic Planning',
        'Data Analysis',
        'Systems Thinking',
        'Innovation & Invention',
        'Research & Investigation',
        'Complex Decision Making',
        'Abstract Thinking',
        'Scientific Method',
        'Engineering Design Process',
        'Entrepreneurial Thinking',
        'Leadership & Management'
    ]
}

# Add new activity types to existing data
new_activities = []

# Create additional activity types for each age group
age_groups = ['Infant (0-1)', 'Toddler (1-3)', 'Preschooler (3-5)', 'Child (6-8)', 'Pre-Teen (9-12)', 'Teen (13-18)']

for pillar in activity_types:
    for age_group in age_groups:
        for category in activity_types[pillar]:
            # Check if this category already exists for this age group
            existing = df[(df['Pillar'] == pillar) & (df['Age Group'] == age_group) & (df['Category'] == category)]
            
            if len(existing) == 0:
                # Create new activities for this category
                activity_count = random.randint(3, 8)  # 3-8 activities per category
                
                for i in range(1, activity_count + 1):
                    activity_id = f"{pillar.lower().replace(' & ', '-').replace(' ', '-')}-{age_group.lower().replace(' ', '-').replace('(', '').replace(')', '')}-{category.lower().replace(' ', '-').replace('&', 'and')}-{i}"
                    
                    # Generate activity details based on category and age
                    activity_name = f"{category} Activity {i}"
                    objective = f"Develop {category.lower()} skills for {age_group.lower()}"
                    explanation = f"Engage in {category.lower()} activities designed for {age_group.lower()} development"
                    
                    # Age-specific time estimates
                    time_estimates = {
                        'Infant (0-1)': ['5-10 min', '10-15 min'],
                        'Toddler (1-3)': ['10-20 min', '15-30 min'],
                        'Preschooler (3-5)': ['15-30 min', '20-45 min'],
                        'Child (6-8)': ['20-45 min', '30-60 min'],
                        'Pre-Teen (9-12)': ['30-60 min', '45-90 min'],
                        'Teen (13-18)': ['45-90 min', '60-120 min']
                    }
                    
                    estimated_time = random.choice(time_estimates[age_group])
                    
                    # Generate hashtags
                    hashtags = f"#{category.replace(' ', '')};#{age_group.split('(')[0].strip()};#{pillar.replace(' & ', '')}"
                    
                    # Generate materials
                    materials = f"Activity kit (supplied by us);Step-by-step guide (supplied by us);Progress tracking sheet (supplied by us);Age-appropriate materials"
                    
                    # Generate steps
                    steps = f"1. Prepare materials from our activity kit;2. Follow our step-by-step guide;3. Engage in the activity;4. Track progress on our tracking sheet;5. Return materials when complete"
                    
                    # Generate skills
                    skills = f"{category};{pillar} development;Problem solving;Creative thinking;Progress tracking"
                    
                    new_activity = {
                        'Activity ID': activity_id,
                        'Pillar': pillar,
                        'Age Group': age_group,
                        'Category': category,
                        'Category Description': f"Comprehensive {category.lower()} activities for {age_group.lower()}",
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

# Combine existing and new activities
if new_activities:
    new_df = pd.DataFrame(new_activities)
    comprehensive_df = pd.concat([df, new_df], ignore_index=True)
else:
    comprehensive_df = df.copy()

# Add additional columns for better organization
comprehensive_df['Activity Type'] = comprehensive_df['Category'].apply(lambda x: 'Creative' if 'Play' in x or 'Art' in x or 'Music' in x else 'Cognitive')
comprehensive_df['Difficulty Level'] = comprehensive_df['Age Group'].apply(lambda x: 
    'Beginner' if 'Infant' in x or 'Toddler' in x else
    'Intermediate' if 'Preschooler' in x or 'Child' in x else
    'Advanced'
)
comprehensive_df['Parent Involvement'] = comprehensive_df['Age Group'].apply(lambda x: 
    'High' if 'Infant' in x or 'Toddler' in x else
    'Medium' if 'Preschooler' in x or 'Child' in x else
    'Low'
)

# Fill any missing information
comprehensive_df['Materials'] = comprehensive_df['Materials'].fillna('Activity kit (supplied by us);Step-by-step guide (supplied by us);Progress tracking sheet (supplied by us)')
comprehensive_df['Steps'] = comprehensive_df['Steps'].fillna('1. Prepare materials;2. Follow guide;3. Complete activity;4. Track progress;5. Return materials')
comprehensive_df['Skills'] = comprehensive_df['Skills'].fillna('Problem solving;Creative thinking;Progress tracking')

# Save the comprehensive version
comprehensive_df.to_csv('essential-growth-activities-comprehensive.csv', index=False)

print(f"Created comprehensive dataset with {len(comprehensive_df)} activities")
print(f"Activity types: {comprehensive_df['Activity Type'].value_counts().to_dict()}")
print(f"Difficulty levels: {comprehensive_df['Difficulty Level'].value_counts().to_dict()}")
print(f"Parent involvement: {comprehensive_df['Parent Involvement'].value_counts().to_dict()}")

# Show sample of new activities
print("\nSample of new activities:")
print(comprehensive_df[comprehensive_df['Activity ID'].str.contains('new', case=False, na=False)].head(5)[['Pillar', 'Age Group', 'Category', 'Activity Name']].to_string())
