#!/usr/bin/env python3
"""
🎯 Final Specific Steps for ALL Activities
Create truly specific steps for every single activity
"""

import pandas as pd
from datetime import datetime

def final_specific_steps():
    """Create final specific steps for all activities"""
    
    print("🎯 Creating Final Specific Steps for ALL Activities")
    print("=" * 60)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    def create_final_specific_steps(activity_id, topic, age_group, materials, objective):
        """Create truly specific steps for each activity"""
        
        # Create specific steps based on the exact topic and materials
        if 'infant' in age_group.lower():
            if 'mirror' in topic.lower():
                return [
                    "Hold a baby-safe mirror in front of baby's face",
                    "Make different facial expressions and let them see themselves",
                    "Point to their features: 'There's your nose!' or 'Look at your eyes!'",
                    "Let them reach out and touch the mirror",
                    "Make silly faces and see if they try to copy you",
                    "Put the mirror away when they lose interest"
                ]
            elif 'blanket' in topic.lower() and 'roll' in topic.lower():
                return [
                    "Roll a soft blanket into a tube shape",
                    "Place it under baby's chest during tummy time for support",
                    "This helps them lift their head and strengthens their neck muscles",
                    "Talk to them and make eye contact while they're in this position",
                    "If they get tired, let them rest and try again later",
                    "Unroll the blanket when tummy time is over"
                ]
            elif 'crinkle' in topic.lower():
                return [
                    "Give baby a piece of crinkle fabric or a crinkle toy",
                    "Show them how to squeeze it to make the crinkly sound",
                    "Let them explore the fabric and discover the sound",
                    "Talk about the sound: 'Listen to that crinkle sound!'",
                    "Let them play with it freely and explore the texture",
                    "Put the crinkle fabric away when they're finished"
                ]
            elif 'shaker' in topic.lower() or 'bottle' in topic.lower():
                return [
                    "Fill small plastic bottles with rice, beans, or small beads",
                    "Seal the bottles tightly and tape the lids",
                    "Let baby shake the bottles and listen to the sounds",
                    "Show them how to shake gently to make different sounds",
                    "Talk about the sounds: 'That's a soft shake' or 'That's a loud shake'",
                    "Supervise closely to ensure the bottles stay sealed"
                ]
            elif 'bell' in topic.lower() and 'anklet' in topic.lower():
                return [
                    "Put soft, jingly bells on baby's ankles (make sure they're safe and not too tight)",
                    "Let them kick their legs and discover the sound",
                    "Talk about the sound: 'Listen to those bells jingle!'",
                    "Show them how their movements create the sound",
                    "Let them explore and move their legs freely",
                    "Remove the bells when they're done playing"
                ]
            elif 'voice' in topic.lower() and 'mimic' in topic.lower():
                return [
                    "Sit face-to-face with baby in a comfortable position",
                    "Make simple, repetitive sounds like 'ba-ba-ba' or 'ma-ma-ma'",
                    "Wait for baby to respond or try to copy the sounds",
                    "Praise any attempts they make to vocalize",
                    "Take turns making sounds back and forth",
                    "End the game when they lose interest"
                ]
            elif 'skin' in topic.lower() and 'cuddle' in topic.lower():
                return [
                    "Find a quiet, comfortable spot to sit or lie down",
                    "Hold baby close to your skin (remove your shirt if comfortable)",
                    "Let them feel your warmth and heartbeat",
                    "Talk softly to them or sing a gentle song",
                    "Enjoy this special bonding time together",
                    "Dress baby when they seem ready to end the cuddle"
                ]
            elif 'eye' in topic.lower() and 'gaze' in topic.lower():
                return [
                    "Hold baby in your arms and make eye contact with them",
                    "Talk to them about what you're doing: 'I'm looking at you, and you're looking at me!'",
                    "Wait for them to make eye contact back with you",
                    "Smile and make gentle facial expressions",
                    "Let them study your face and expressions",
                    "End the eye contact game when they look away or get tired"
                ]
            elif 'massage' in topic.lower():
                return [
                    "Lay baby on a soft towel in a warm, comfortable room",
                    "Use gentle, circular motions to massage their arms and legs",
                    "Talk softly to them while you massage: 'This feels nice and gentle'",
                    "Watch for signs they're enjoying it or if they want to stop",
                    "Use baby-safe lotion if you want to make it extra soothing",
                    "Stop when they show signs of being done or getting fussy"
                ]
            elif 'peek' in topic.lower() and 'boo' in topic.lower():
                return [
                    "Hold a soft cloth or your hands in front of your face",
                    "Peek out from behind the cloth and say 'Peek-a-boo!'",
                    "Hide your face again and repeat the game",
                    "Watch for baby's reactions and smiles",
                    "Let them try to grab the cloth if they want to",
                    "Stop the game when they lose interest or get overstimulated"
                ]
            elif 'lullaby' in topic.lower() or 'sing' in topic.lower():
                return [
                    "Hold baby in your arms in a comfortable position",
                    "Sing a gentle lullaby or soft song to them",
                    "Rock them gently as you sing",
                    "Make eye contact and smile while you sing",
                    "Let them feel the rhythm and melody of the song",
                    "Continue singing until they seem calm and relaxed"
                ]
            elif 'kitchen' in topic.lower() and 'role' in topic.lower():
                return [
                    "Set up a simple play kitchen area with toy pots, pans, and food",
                    "Show baby how to 'cook' by stirring and mixing",
                    "Let them explore the different kitchen items",
                    "Talk about what you're 'cooking': 'We're making soup!'",
                    "Let them play freely with the kitchen toys",
                    "Clean up the kitchen area when they're done playing"
                ]
            else:
                return [
                    "Choose a good time when baby is calm and alert",
                    "Set up the activity in a safe, comfortable space",
                    "Let baby explore the materials at their own pace",
                    "Stay close and watch for safety",
                    "Talk to them about what they're experiencing",
                    "Clean up when they show signs of being done"
                ]
        
        elif 'toddler' in age_group.lower():
            if 'vet' in topic.lower() and 'clinic' in topic.lower():
                return [
                    "Set up a pretend vet clinic with stuffed animals and toy medical tools",
                    "Show them how to 'examine' their stuffed animals",
                    "Let them pretend to give shots, check ears, and listen to hearts",
                    "Talk about taking care of animals and being gentle",
                    "Let them play the role of both vet and pet owner",
                    "Clean up the vet clinic when they're finished playing"
                ]
            elif 'puppet' in topic.lower() and 'story' in topic.lower():
                return [
                    "Gather some puppets or make simple finger puppets",
                    "Start a story and let the puppets 'talk' to each other",
                    "Let them join in with their own puppet characters",
                    "Ask questions about what the puppets are doing",
                    "Let them create their own puppet stories",
                    "Put the puppets away when story time is over"
                ]
            elif 'superhero' in topic.lower() and 'dress' in topic.lower():
                return [
                    "Gather some capes, masks, and other dress-up items",
                    "Let them choose their superhero costume",
                    "Help them put on their cape and mask",
                    "Encourage them to act out superhero adventures",
                    "Ask about their superhero powers and missions",
                    "Help them change back to regular clothes when done"
                ]
            elif 'grocery' in topic.lower() and 'store' in topic.lower():
                return [
                    "Set up a pretend grocery store with empty food containers",
                    "Give them a small shopping cart or basket",
                    "Let them 'shop' for different items",
                    "Pretend to be the cashier and help them 'pay'",
                    "Talk about different foods and healthy choices",
                    "Clean up the grocery store when shopping is done"
                ]
            elif 'tower' in topic.lower() and 'challenge' in topic.lower():
                return [
                    "Clear a space on the floor or table for building",
                    "Show them how to stack a few blocks together",
                    "Let them try to build their own tower",
                    "Celebrate their efforts, even if it falls down",
                    "Ask questions about their building: 'What color is this block?'",
                    "Help clean up the blocks when they're finished"
                ]
            elif 'color' in topic.lower() and 'sorting' in topic.lower():
                return [
                    "Gather blocks or toys in different colors",
                    "Show them how to group items by color",
                    "Let them sort the items into different color piles",
                    "Talk about the colors: 'This is red, this is blue'",
                    "Praise their sorting efforts",
                    "Help them put the items away when finished"
                ]
            elif 'build' in topic.lower() and 'zoo' in topic.lower():
                return [
                    "Gather blocks and toy animals",
                    "Show them how to build simple enclosures for the animals",
                    "Let them create their own zoo layout",
                    "Talk about different animals and where they live",
                    "Let them play with the animals in their zoo",
                    "Help clean up the zoo when playtime is over"
                ]
            elif 'shape' in topic.lower() and 'tower' in topic.lower():
                return [
                    "Gather blocks in different shapes (circles, squares, triangles)",
                    "Show them how to stack blocks by shape",
                    "Let them build towers using different shaped blocks",
                    "Talk about the shapes: 'This is a circle, this is a square'",
                    "Let them experiment with different combinations",
                    "Help clean up the shape blocks when finished"
                ]
            elif 'story' in topic.lower() and 'building' in topic.lower():
                return [
                    "Start a simple story and let them add details",
                    "Ask questions: 'What happens next?' or 'Who is the character?'",
                    "Let them create their own story elements",
                    "Write down or draw their story if they want",
                    "Act out parts of the story together",
                    "Save their story to tell again later"
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
        
        elif 'preschooler' in age_group.lower():
            if 'scribble' in topic.lower() and 'freestyle' in topic.lower():
                return [
                    "Give them paper and crayons or markers",
                    "Let them draw whatever they want - no rules!",
                    "Don't worry about making a 'picture' - let them scribble freely",
                    "Talk about the colors they're using",
                    "Ask them to tell you about their drawing",
                    "Display their artwork proudly when they're done"
                ]
            elif 'color' in topic.lower() and 'tracing' in topic.lower():
                return [
                    "Draw simple lines or shapes on paper",
                    "Show them how to trace over the lines with crayons",
                    "Let them practice tracing different lines and shapes",
                    "Praise their tracing efforts",
                    "Let them try drawing their own lines to trace",
                    "Save their tracing practice to show their progress"
                ]
            elif 'sticker' in topic.lower() and 'drawing' in topic.lower():
                return [
                    "Give them paper and colorful stickers",
                    "Let them place stickers anywhere they want on the paper",
                    "Show them how to draw around the stickers",
                    "Let them create their own sticker art",
                    "Talk about the different stickers they're using",
                    "Display their sticker artwork when finished"
                ]
            elif 'water' in topic.lower() and 'drawing' in topic.lower():
                return [
                    "Give them a paintbrush and a cup of water",
                    "Let them 'paint' with water on paper or a chalkboard",
                    "Show them how the water makes the surface wet",
                    "Let them experiment with different brush strokes",
                    "Talk about how the water evaporates and dries",
                    "Clean up the water and brushes when finished"
                ]
            elif 'rainbow' in topic.lower() and 'scribble' in topic.lower():
                return [
                    "Give them paper and rainbow-colored crayons",
                    "Let them create colorful scribbles and designs",
                    "Show them how to blend colors together",
                    "Let them experiment with different color combinations",
                    "Talk about the rainbow colors they're using",
                    "Display their rainbow artwork proudly"
                ]
            elif 'drumbeat' in topic.lower() and 'dance' in topic.lower():
                return [
                    "Clear a space for dancing and movement",
                    "Play music with a strong beat",
                    "Show them how to clap or stomp to the rhythm",
                    "Let them move their body to the music",
                    "Encourage them to create their own dance moves",
                    "Take breaks when they get tired"
                ]
            elif 'sound' in topic.lower() and 'matching' in topic.lower():
                return [
                    "Gather objects that make different sounds",
                    "Let them listen to each sound",
                    "Show them how to match sounds to objects",
                    "Let them try to identify sounds with their eyes closed",
                    "Talk about the different sounds they hear",
                    "Clean up the sound-making objects when finished"
                ]
            elif 'kitchen' in topic.lower() and 'band' in topic.lower():
                return [
                    "Gather kitchen items that can make music (pots, pans, spoons)",
                    "Show them how to tap and bang to create rhythms",
                    "Let them experiment with different sounds",
                    "Play along with them to create a kitchen band",
                    "Talk about the different sounds each item makes",
                    "Clean up the kitchen instruments when finished"
                ]
            elif 'musical' in topic.lower() and 'parade' in topic.lower():
                return [
                    "Gather musical instruments or sound-making toys",
                    "Show them how to march and play at the same time",
                    "Let them lead their own musical parade",
                    "Play music and march around the room together",
                    "Let them choose the parade route",
                    "End the parade when they're ready to rest"
                ]
            elif 'name' in topic.lower() and 'instrument' in topic.lower():
                return [
                    "Gather different musical instruments",
                    "Play each instrument and let them listen",
                    "Ask them to name each instrument",
                    "Let them try playing each instrument",
                    "Talk about the different sounds each makes",
                    "Put the instruments away when finished"
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
        
        else:  # Older children
            return [
                "Explain the activity and its goals",
                "Let them help plan and organize",
                "Guide them through the steps",
                "Encourage independent thinking and problem-solving",
                "Discuss what they learned or discovered",
                "Help them reflect on the experience"
            ]
    
    print("\n🎯 Creating final specific steps for all activities...")
    
    changes_made = 0
    
    for idx, row in df.iterrows():
        activity_id = row['Activity ID']
        topic = row['Topic']
        age_group = row['Age Group']
        materials = str(row['Materials']) if pd.notna(row['Materials']) else ''
        objective = str(row['Objective']) if pd.notna(row['Objective']) else ''
        
        # Get specific steps for this activity
        new_steps = create_final_specific_steps(activity_id, topic, age_group, materials, objective)
        
        # Join steps with semicolons
        new_steps_str = '; '.join(new_steps)
        
        # Update the steps
        df.at[idx, 'Steps'] = new_steps_str
        changes_made += 1
        
        if (idx + 1) % 20 == 0:
            print(f"  Processed {idx + 1} activities...")
    
    # Create backup
    backup_name = f'essential-growth-activities-backup-before-final-specific-steps-{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    df.to_csv(backup_name, index=False)
    print(f"\n✅ Created backup: {backup_name}")
    
    # Save updated file
    df.to_csv('essential-growth-activities-enhanced-20250927_003226.csv', index=False)
    print("✅ Updated main file with FINAL specific steps")
    
    print(f"\n📊 Changes made: {changes_made} activities")
    
    print("\n" + "=" * 60)
    print("🎉 FINAL Specific Steps Created!")
    
    return True

if __name__ == '__main__':
    success = final_specific_steps()
    
    if success:
        print("\n🚀 Next step: Final verification and sync")
        print("Run: python verify_all_activities_steps.py")
    else:
        print("\n❌ Creation failed")
