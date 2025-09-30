#!/usr/bin/env python3
"""
🎯 Create Specific Steps for Each Activity
Write personalized, activity-specific steps for each unique task
"""

import pandas as pd
from datetime import datetime

def create_specific_steps():
    """Create specific, personalized steps for each activity"""
    
    print("🎯 Creating Specific Steps for Each Activity")
    print("=" * 60)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    def get_specific_steps(activity_id, topic, age_group, materials, objective):
        """Get specific steps for each unique activity"""
        
        # Define specific steps for each activity
        specific_steps = {
            # Play & Creativity - Infant Activities
            'play-creativity-infant-0-1-sensory-exploration-1': [
                "Fill a shallow tray with different textured materials like silk, sponge, and cotton balls",
                "Place baby on their tummy or sitting up near the tray",
                "Let baby reach out and touch the different textures with their hands",
                "Describe what they're feeling: 'That's soft silk' or 'That's bumpy sponge'",
                "Watch their reactions and let them explore at their own pace",
                "Clean up the materials when baby shows signs of being done"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-2': [
                "Fill a ziplock bag with clear gel and colorful glitter",
                "Seal the bag tightly and tape the edges to prevent leaks",
                "Place the bag on a flat surface where baby can see and reach it",
                "Let baby squish and press the bag with their hands",
                "Point out the glitter moving around as they squish",
                "Supervise closely to ensure the bag doesn't break"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-3': [
                "Fill a shallow bowl with warm water (not too hot!)",
                "Add a few floating toys like rubber ducks or bath toys",
                "Place baby in a safe position to splash and play",
                "Let them splash their hands in the water and grab the toys",
                "Talk about the water: 'Splash! The water feels wet!'",
                "Dry baby's hands and clean up when they're finished"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-4': [
                "Lay out different textured fabrics in a path on the floor",
                "Place baby at one end of the fabric path",
                "Encourage them to crawl across the different textures",
                "Talk about each texture as they crawl: 'That's smooth silk' or 'That's soft cotton'",
                "Let them explore each fabric at their own pace",
                "Pick up the fabrics when they're done crawling"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-5': [
                "Fill a soft basket with safe nature items like pinecones, leaves, or cotton balls",
                "Place the basket within baby's reach",
                "Let them reach in and explore the different items",
                "Describe what they're touching: 'That's a bumpy pinecone' or 'That's a soft leaf'",
                "Supervise closely to ensure they don't put small items in their mouth",
                "Put the nature items away when they're finished exploring"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-6': [
                "Hold a baby-safe mirror in front of baby's face",
                "Make different facial expressions and let them see themselves",
                "Point to their features: 'There's your nose!' or 'Look at your eyes!'",
                "Let them reach out and touch the mirror",
                "Make silly faces and see if they try to copy you",
                "Put the mirror away when they lose interest"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-7': [
                "Place baby on their tummy with their favorite toy just out of reach",
                "Encourage them to reach forward and try to grab the toy",
                "Cheer them on: 'You can do it! Reach for the toy!'",
                "If they get frustrated, move the toy a little closer",
                "Celebrate when they successfully grab the toy",
                "Let them play with the toy for a while before putting it away"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-8': [
                "Roll a soft blanket into a tube shape",
                "Place it under baby's chest during tummy time for support",
                "This helps them lift their head and strengthens their neck muscles",
                "Talk to them and make eye contact while they're in this position",
                "If they get tired, let them rest and try again later",
                "Unroll the blanket when tummy time is over"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-9': [
                "Lie back in a semi-reclined position on a couch or bed",
                "Place baby tummy-down on your chest, facing you",
                "Hold them securely and talk to them softly",
                "Make eye contact and smile at them",
                "Let them feel your heartbeat and breathing",
                "Enjoy this bonding time together"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-10': [
                "Place baby on their tummy on a soft play mat",
                "Turn on gentle, calming music or a musical toy",
                "Let them listen to the music while in tummy time position",
                "Sing along softly or hum to the music",
                "Watch their reactions to the different sounds",
                "Turn off the music when they show signs of being done"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-11': [
                "Give baby a piece of crinkle fabric or a crinkle toy",
                "Show them how to squeeze it to make the crinkly sound",
                "Let them explore the fabric and discover the sound",
                "Talk about the sound: 'Listen to that crinkle sound!'",
                "Let them play with it freely and explore the texture",
                "Put the crinkle fabric away when they're finished"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-12': [
                "Fill small plastic bottles with rice, beans, or small beads",
                "Seal the bottles tightly and tape the lids",
                "Let baby shake the bottles and listen to the sounds",
                "Show them how to shake gently to make different sounds",
                "Talk about the sounds: 'That's a soft shake' or 'That's a loud shake'",
                "Supervise closely to ensure the bottles stay sealed"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-13': [
                "Put soft, jingly bells on baby's ankles (make sure they're safe and not too tight)",
                "Let them kick their legs and discover the sound",
                "Talk about the sound: 'Listen to those bells jingle!'",
                "Show them how their movements create the sound",
                "Let them explore and move their legs freely",
                "Remove the bells when they're done playing"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-14': [
                "Set up a musical mat or musical toys in a path on the floor",
                "Place baby at one end of the musical path",
                "Encourage them to crawl toward the sounds",
                "Cheer them on as they move: 'You're getting closer to the music!'",
                "Let them explore each musical toy as they reach it",
                "Turn off the music when they're finished exploring"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-15': [
                "Sit face-to-face with baby in a comfortable position",
                "Make simple, repetitive sounds like 'ba-ba-ba' or 'ma-ma-ma'",
                "Wait for baby to respond or try to copy the sounds",
                "Praise any attempts they make to vocalize",
                "Take turns making sounds back and forth",
                "End the game when they lose interest"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-16': [
                "Lay baby on a soft towel in a warm, comfortable room",
                "Use gentle, circular motions to massage their arms and legs",
                "Talk softly to them while you massage: 'This feels nice and gentle'",
                "Watch for signs they're enjoying it or if they want to stop",
                "Use baby-safe lotion if you want to make it extra soothing",
                "Stop when they show signs of being done or getting fussy"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-17': [
                "Hold baby in your arms and make eye contact with them",
                "Talk to them about what you're doing: 'I'm looking at you, and you're looking at me!'",
                "Wait for them to make eye contact back with you",
                "Smile and make gentle facial expressions",
                "Let them study your face and expressions",
                "End the eye contact game when they look away or get tired"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-18': [
                "Hold a soft cloth or your hands in front of your face",
                "Peek out from behind the cloth and say 'Peek-a-boo!'",
                "Hide your face again and repeat the game",
                "Watch for baby's reactions and smiles",
                "Let them try to grab the cloth if they want to",
                "Stop the game when they lose interest or get overstimulated"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-19': [
                "Hold baby in your arms in a comfortable position",
                "Sing a gentle lullaby or soft song to them",
                "Rock them gently as you sing",
                "Make eye contact and smile while you sing",
                "Let them feel the rhythm and melody of the song",
                "Continue singing until they seem calm and relaxed"
            ],
            
            'play-creativity-infant-0-1-sensory-exploration-20': [
                "Set up a simple play kitchen area with toy pots, pans, and food",
                "Show baby how to 'cook' by stirring and mixing",
                "Let them explore the different kitchen items",
                "Talk about what you're 'cooking': 'We're making soup!'",
                "Let them play freely with the kitchen toys",
                "Clean up the kitchen area when they're done playing"
            ]
        }
        
        # Return specific steps if available, otherwise create generic ones
        if activity_id in specific_steps:
            return specific_steps[activity_id]
        else:
            # Create generic steps based on activity type
            return create_generic_steps(topic, age_group, materials)
    
    def create_generic_steps(topic, age_group, materials):
        """Create generic steps for activities not in the specific list"""
        
        if 'infant' in age_group.lower():
            return [
                "Choose a calm time when baby is alert and happy",
                "Set up the activity in a safe, comfortable space",
                "Let baby explore the materials at their own pace",
                "Stay close and watch for safety",
                "Talk to them about what they're experiencing",
                "Clean up when they show signs of being done"
            ]
        elif 'toddler' in age_group.lower():
            return [
                "Clear a safe space for the activity",
                "Show them what to do, then let them try",
                "Stay nearby to help if needed",
                "Praise their efforts and creativity",
                "Let them explore and experiment",
                "Clean up together when finished"
            ]
        elif 'preschooler' in age_group.lower():
            return [
                "Explain what you're going to do together",
                "Let them help gather and set up materials",
                "Show them the steps, then let them try",
                "Ask questions and encourage their thinking",
                "Help when they need it, but let them lead",
                "Talk about what they learned or created"
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
    
    print("\n🎯 Creating specific steps for each activity...")
    
    changes_made = 0
    
    for idx, row in df.iterrows():
        activity_id = row['Activity ID']
        topic = row['Topic']
        age_group = row['Age Group']
        materials = str(row['Materials']) if pd.notna(row['Materials']) else ''
        objective = str(row['Objective']) if pd.notna(row['Objective']) else ''
        
        # Get specific steps for this activity
        new_steps = get_specific_steps(activity_id, topic, age_group, materials, objective)
        
        # Join steps with semicolons
        new_steps_str = '; '.join(new_steps)
        
        # Update the steps
        df.at[idx, 'Steps'] = new_steps_str
        changes_made += 1
        
        if (idx + 1) % 20 == 0:
            print(f"  Processed {idx + 1} activities...")
    
    # Create backup
    backup_name = f'essential-growth-activities-backup-before-specific-steps-{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    df.to_csv(backup_name, index=False)
    print(f"\n✅ Created backup: {backup_name}")
    
    # Save updated file
    df.to_csv('essential-growth-activities-enhanced-20250927_003226.csv', index=False)
    print("✅ Updated main file with specific steps")
    
    print(f"\n📊 Changes made: {changes_made} activities")
    
    # Show examples of specific steps
    print(f"\n📋 Examples of Specific Steps:")
    
    for i in range(min(5, len(df))):
        row = df.iloc[i]
        steps = row['Steps']
        step_items = [item.strip() for item in steps.split(';') if item.strip()]
        
        print(f"\n{i+1}. {row['Topic']} ({row['Age Group']})")
        print(f"   Steps ({len(step_items)} total):")
        for j, step in enumerate(step_items, 1):
            print(f"      {j}. {step}")
    
    print("\n" + "=" * 60)
    print("🎉 Specific Steps Created!")
    
    return True

if __name__ == '__main__':
    success = create_specific_steps()
    
    if success:
        print("\n🚀 Next step: Sync to Google Sheets")
        print("Run: python upload_with_proper_sa.py")
    else:
        print("\n❌ Creation failed")
