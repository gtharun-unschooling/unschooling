#!/usr/bin/env python3
"""
🔧 Fix Steps Instructions
Create clear, detailed, and comprehensive step-by-step instructions
"""

import pandas as pd
from datetime import datetime

def fix_steps_instructions():
    """Fix steps with clear, detailed instructions"""
    
    print("🔧 Fixing Steps Instructions")
    print("=" * 50)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    def create_detailed_steps(topic, age_group, materials, objective):
        """Create detailed, clear steps for any activity"""
        
        # Age-appropriate language and supervision level
        if 'infant' in age_group.lower():
            supervision = "Always supervise closely and ensure baby's safety"
            language = "Use simple, gentle words and describe what you're doing"
        elif 'toddler' in age_group.lower():
            supervision = "Supervise actively and guide when needed"
            language = "Use clear, simple instructions and demonstrate first"
        elif 'preschooler' in age_group.lower():
            supervision = "Supervise and provide guidance as needed"
            language = "Give clear instructions and let them explore independently"
        else:
            supervision = "Provide guidance and support as needed"
            language = "Give detailed instructions and encourage independent thinking"
        
        # Create comprehensive steps based on activity type
        if 'texture' in topic.lower() or 'sensory' in topic.lower():
            return [
                f"Prepare the activity area by ensuring it's clean and safe for {age_group.lower()}",
                f"Gather all materials: {materials}",
                f"Set up the textured items in an organized manner within easy reach",
                f"Introduce the activity to the child by explaining what they will be exploring",
                f"Demonstrate how to safely touch and explore the different textures",
                f"Encourage the child to explore each texture at their own pace",
                f"Describe what the child is feeling and experiencing as they explore",
                f"Ask open-ended questions about what they notice and how it feels",
                f"Allow plenty of time for exploration and discovery",
                f"Clean up materials together and discuss what was learned",
                f"{supervision}",
                f"{language}"
            ]
        
        elif 'music' in topic.lower() or 'sound' in topic.lower():
            return [
                f"Prepare the activity space by ensuring it's quiet and free from distractions",
                f"Gather all musical materials: {materials}",
                f"Set up the musical instruments or sound-making objects in an accessible way",
                f"Introduce the activity by explaining what sounds will be explored",
                f"Demonstrate how to use each instrument or sound-making object safely",
                f"Encourage the child to experiment with different sounds and rhythms",
                f"Play along with the child and create music together",
                f"Discuss the different sounds, rhythms, and patterns being created",
                f"Allow time for free exploration and creative expression",
                f"Clean up instruments together and discuss the musical experience",
                f"{supervision}",
                f"{language}"
            ]
        
        elif 'art' in topic.lower() or 'creative' in topic.lower() or 'drawing' in topic.lower():
            return [
                f"Prepare the workspace by covering surfaces and ensuring good lighting",
                f"Gather all art materials: {materials}",
                f"Set up the art supplies in an organized and accessible manner",
                f"Introduce the activity by explaining the creative project or technique",
                f"Demonstrate the basic techniques or methods to be used",
                f"Encourage the child to experiment with different colors, shapes, and techniques",
                f"Provide guidance and support as the child creates their artwork",
                f"Discuss the creative process and ask about their artistic choices",
                f"Allow time for the child to complete their artwork at their own pace",
                f"Display or share the finished artwork and celebrate their creativity",
                f"Clean up art materials together and discuss what was learned",
                f"{supervision}",
                f"{language}"
            ]
        
        elif 'building' in topic.lower() or 'construction' in topic.lower() or 'tower' in topic.lower():
            return [
                f"Prepare a clear, flat surface for building activities",
                f"Gather all building materials: {materials}",
                f"Organize the building blocks or materials by size, shape, or color",
                f"Introduce the building challenge or project to the child",
                f"Demonstrate basic building techniques and stability principles",
                f"Encourage the child to plan their structure before building",
                f"Support the child as they construct their building or creation",
                f"Discuss engineering concepts like balance, stability, and structure",
                f"Allow time for the child to experiment and rebuild if needed",
                f"Celebrate the completed structure and discuss what was learned",
                f"Clean up building materials together and discuss the building process",
                f"{supervision}",
                f"{language}"
            ]
        
        elif 'story' in topic.lower() or 'imagination' in topic.lower() or 'role play' in topic.lower():
            return [
                f"Prepare a comfortable space for storytelling and imaginative play",
                f"Gather all story materials: {materials}",
                f"Set up the story props, characters, or role-play items",
                f"Introduce the story theme or role-play scenario to the child",
                f"Begin the story or role-play by setting the scene and characters",
                f"Encourage the child to participate in the story or role-play",
                f"Ask questions to help develop the story or character development",
                f"Allow the child to take the lead in storytelling or role-play",
                f"Discuss the story elements, characters, and plot development",
                f"Encourage creative thinking and alternative story endings",
                f"Clean up story materials together and discuss the imaginative experience",
                f"{supervision}",
                f"{language}"
            ]
        
        elif 'movement' in topic.lower() or 'dance' in topic.lower() or 'physical' in topic.lower():
            return [
                f"Prepare a safe, open space for movement and physical activity",
                f"Gather all movement materials: {materials}",
                f"Set up any equipment or props needed for the movement activity",
                f"Introduce the movement activity by explaining the goals and benefits",
                f"Demonstrate the basic movements or dance steps to be learned",
                f"Encourage the child to practice the movements at their own pace",
                f"Provide positive feedback and encouragement during the activity",
                f"Discuss the importance of physical activity and movement",
                f"Allow time for free movement and creative expression",
                f"Cool down together and discuss how the movement felt",
                f"Clean up any equipment and discuss the physical activity experience",
                f"{supervision}",
                f"{language}"
            ]
        
        else:
            # Generic comprehensive steps for any activity
            return [
                f"Prepare the activity area by ensuring it's clean, safe, and appropriate for {age_group.lower()}",
                f"Gather all necessary materials: {materials}",
                f"Set up the activity materials in an organized and accessible manner",
                f"Introduce the activity to the child by explaining the objectives and what they will learn",
                f"Demonstrate the basic techniques or methods to be used in the activity",
                f"Guide the child through the activity step-by-step, providing support as needed",
                f"Encourage the child to explore and experiment with the activity materials",
                f"Ask open-ended questions to promote thinking and discussion",
                f"Allow time for the child to complete the activity at their own pace",
                f"Discuss what was learned and celebrate the child's efforts and achievements",
                f"Clean up materials together and discuss the overall experience",
                f"{supervision}",
                f"{language}"
            ]
    
    print("\n📋 Creating detailed steps...")
    
    changes_made = 0
    
    for idx, row in df.iterrows():
        activity_id = row['Activity ID']
        topic = row['Topic']
        age_group = row['Age Group']
        materials = str(row['Materials']) if pd.notna(row['Materials']) else ''
        objective = str(row['Objective']) if pd.notna(row['Objective']) else ''
        
        # Create detailed steps
        new_steps = create_detailed_steps(topic, age_group, materials, objective)
        
        # Join steps with semicolons
        new_steps_str = '; '.join(new_steps)
        
        # Update the steps
        df.at[idx, 'Steps'] = new_steps_str
        changes_made += 1
        
        if (idx + 1) % 20 == 0:
            print(f"  Processed {idx + 1} activities...")
    
    # Create backup
    backup_name = f'essential-growth-activities-backup-before-steps-fix-{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    df.to_csv(backup_name, index=False)
    print(f"\n✅ Created backup: {backup_name}")
    
    # Save updated file
    df.to_csv('essential-growth-activities-enhanced-20250927_003226.csv', index=False)
    print("✅ Updated main file with detailed steps")
    
    print(f"\n📊 Changes made: {changes_made} activities")
    
    # Show examples of new detailed steps
    print(f"\n📋 Examples of new detailed steps:")
    
    for i in range(min(3, len(df))):
        row = df.iloc[i]
        steps = row['Steps']
        step_items = [item.strip() for item in steps.split(';') if item.strip()]
        
        print(f"\n{i+1}. {row['Topic']} ({row['Age Group']})")
        print(f"   Steps ({len(step_items)} total):")
        for j, step in enumerate(step_items[:5], 1):
            print(f"      {j}. {step}")
        if len(step_items) > 5:
            print(f"      ... and {len(step_items) - 5} more steps")
    
    print("\n" + "=" * 50)
    print("🎉 Steps Instructions Fixed!")
    
    return True

if __name__ == '__main__':
    success = fix_steps_instructions()
    
    if success:
        print("\n🚀 Next step: Sync to Google Sheets")
        print("Run: python upload_with_proper_sa.py")
    else:
        print("\n❌ Fix failed")
