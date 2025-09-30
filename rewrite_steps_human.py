#!/usr/bin/env python3
"""
✍️ Rewrite Steps - Human & Parent-Friendly
Create natural, easy-to-understand steps written by humans for parents
"""

import pandas as pd
from datetime import datetime

def rewrite_steps_human():
    """Rewrite steps to be human, natural, and parent-friendly"""
    
    print("✍️ Rewriting Steps - Human & Parent-Friendly")
    print("=" * 60)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    def create_human_steps(topic, age_group, materials, objective):
        """Create natural, human steps for parents"""
        
        # Age-appropriate approach
        if 'infant' in age_group.lower():
            return create_infant_steps(topic, materials)
        elif 'toddler' in age_group.lower():
            return create_toddler_steps(topic, materials)
        elif 'preschooler' in age_group.lower():
            return create_preschooler_steps(topic, materials)
        else:
            return create_child_steps(topic, materials)
    
    def create_infant_steps(topic, materials):
        """Create steps for infant activities"""
        
        if 'texture' in topic.lower() or 'sensory' in topic.lower():
            return [
                "Find a quiet spot where baby can focus",
                "Place the textured items within baby's reach",
                "Let baby explore with their hands - no pressure!",
                "Talk about what they're feeling: 'That's soft!' or 'That's bumpy!'",
                "Watch for signs they're done (looking away, fussing)",
                "Clean up together when they're finished"
            ]
        
        elif 'music' in topic.lower() or 'sound' in topic.lower():
            return [
                "Choose a calm time when baby is alert",
                "Start with gentle sounds - no sudden loud noises",
                "Sing or hum along with the music",
                "Watch baby's reactions and follow their lead",
                "If they seem overwhelmed, take a break",
                "End when baby shows signs of being done"
            ]
        
        elif 'tummy' in topic.lower():
            return [
                "Pick a time when baby is happy and alert",
                "Start with just a few minutes - don't push it",
                "Get down on their level and make eye contact",
                "Talk to them and encourage them",
                "If they get fussy, it's okay to stop",
                "Try again later when they're in a better mood"
            ]
        
        else:
            return [
                "Choose a good time when baby is calm and alert",
                "Set up the activity in a safe, comfortable space",
                "Let baby explore at their own pace",
                "Stay close and watch for safety",
                "Talk to them about what they're doing",
                "Clean up when they're finished"
            ]
    
    def create_toddler_steps(topic, materials):
        """Create steps for toddler activities"""
        
        if 'building' in topic.lower() or 'tower' in topic.lower():
            return [
                "Clear a space on the floor or table",
                "Show them how to stack a few blocks",
                "Let them try - expect some falling down!",
                "Celebrate their efforts, even if it's not perfect",
                "Ask questions: 'What color is this block?'",
                "Help clean up together when they're done"
            ]
        
        elif 'art' in topic.lower() or 'drawing' in topic.lower():
            return [
                "Cover the table with newspaper or a mat",
                "Give them the art supplies and let them explore",
                "Don't worry about making a 'picture' - let them scribble",
                "Talk about the colors they're using",
                "Display their artwork proudly",
                "Clean up together - make it part of the fun"
            ]
        
        elif 'music' in topic.lower() or 'dance' in topic.lower():
            return [
                "Clear some space for moving around",
                "Start with simple movements - clapping, stomping",
                "Play music they like and move with them",
                "Don't worry about being perfect - just have fun",
                "Take breaks when they get tired",
                "End with a calm song or quiet time"
            ]
        
        else:
            return [
                "Set up the activity in a safe space",
                "Show them what to do, then let them try",
                "Stay nearby to help if needed",
                "Praise their efforts and creativity",
                "Let them explore and experiment",
                "Clean up together when finished"
            ]
    
    def create_preschooler_steps(topic, materials):
        """Create steps for preschooler activities"""
        
        if 'story' in topic.lower() or 'imagination' in topic.lower():
            return [
                "Find a comfortable spot to sit together",
                "Start the story and let them add details",
                "Ask questions: 'What happens next?' or 'How does the character feel?'",
                "Let them take turns being the storyteller",
                "Don't worry about perfect grammar - focus on creativity",
                "Write down or draw their story if they want"
            ]
        
        elif 'science' in topic.lower() or 'experiment' in topic.lower():
            return [
                "Gather all the materials together",
                "Explain what you're going to do in simple terms",
                "Let them help with the steps",
                "Ask them to predict what might happen",
                "Watch and discuss what actually happens",
                "Talk about why it happened (in simple terms)"
            ]
        
        elif 'art' in topic.lower() or 'craft' in topic.lower():
            return [
                "Set up a workspace with all materials ready",
                "Show them the basic technique",
                "Let them create their own version",
                "Ask about their choices: 'Why did you pick that color?'",
                "Help with tricky parts if they ask",
                "Display their finished work proudly"
            ]
        
        else:
            return [
                "Explain what you're going to do together",
                "Let them help gather and set up materials",
                "Show them the steps, then let them try",
                "Ask questions and encourage their thinking",
                "Help when they need it, but let them lead",
                "Talk about what they learned or created"
            ]
    
    def create_child_steps(topic, materials):
        """Create steps for older child activities"""
        
        if 'problem' in topic.lower() or 'challenge' in topic.lower():
            return [
                "Read through the challenge together",
                "Brainstorm possible solutions",
                "Let them try their ideas",
                "If something doesn't work, ask 'What could we try differently?'",
                "Celebrate their problem-solving efforts",
                "Discuss what they learned from the process"
            ]
        
        elif 'creative' in topic.lower() or 'design' in topic.lower():
            return [
                "Discuss the project and what they want to create",
                "Plan the steps together",
                "Let them take the lead in the creative process",
                "Offer suggestions if they get stuck",
                "Ask about their design choices",
                "Help them reflect on what they created"
            ]
        
        else:
            return [
                "Explain the activity and its goals",
                "Let them help plan and organize",
                "Guide them through the steps",
                "Encourage independent thinking and problem-solving",
                "Discuss what they learned or discovered",
                "Help them reflect on the experience"
            ]
    
    print("\n✍️ Rewriting steps to be human and natural...")
    
    changes_made = 0
    
    for idx, row in df.iterrows():
        topic = row['Topic']
        age_group = row['Age Group']
        materials = str(row['Materials']) if pd.notna(row['Materials']) else ''
        objective = str(row['Objective']) if pd.notna(row['Objective']) else ''
        
        # Create human steps
        new_steps = create_human_steps(topic, age_group, materials, objective)
        
        # Join steps with semicolons
        new_steps_str = '; '.join(new_steps)
        
        # Update the steps
        df.at[idx, 'Steps'] = new_steps_str
        changes_made += 1
        
        if (idx + 1) % 20 == 0:
            print(f"  Processed {idx + 1} activities...")
    
    # Create backup
    backup_name = f'essential-growth-activities-backup-before-human-steps-{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    df.to_csv(backup_name, index=False)
    print(f"\n✅ Created backup: {backup_name}")
    
    # Save updated file
    df.to_csv('essential-growth-activities-enhanced-20250927_003226.csv', index=False)
    print("✅ Updated main file with human-friendly steps")
    
    print(f"\n📊 Changes made: {changes_made} activities")
    
    # Show examples of new human steps
    print(f"\n📋 Examples of New Human Steps:")
    
    for i in range(min(5, len(df))):
        row = df.iloc[i]
        steps = row['Steps']
        step_items = [item.strip() for item in steps.split(';') if item.strip()]
        
        print(f"\n{i+1}. {row['Topic']} ({row['Age Group']})")
        print(f"   Steps ({len(step_items)} total):")
        for j, step in enumerate(step_items, 1):
            print(f"      {j}. {step}")
    
    print("\n" + "=" * 60)
    print("🎉 Steps Rewritten - Human & Parent-Friendly!")
    
    return True

if __name__ == '__main__':
    success = rewrite_steps_human()
    
    if success:
        print("\n🚀 Next step: Sync to Google Sheets")
        print("Run: python upload_with_proper_sa.py")
    else:
        print("\n❌ Rewrite failed")
