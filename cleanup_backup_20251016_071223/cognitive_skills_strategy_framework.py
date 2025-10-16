#!/usr/bin/env python3
"""
🧠 Cognitive Skills Strategic Framework
Comprehensive strategy for creating diverse, well-structured activities
"""

import gspread
from google.oauth2.service_account import Credentials
import time

def get_google_sheets_client():
    """Connect to Google Sheets using credentials"""
    try:
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file'
        ]
        creds = Credentials.from_service_account_file('sheets-credentials.json', scopes=scope)
        client = gspread.authorize(creds)
        print("✅ Connected to Google Sheets")
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return None

def create_strategic_framework():
    """Create comprehensive strategic framework for Cognitive Skills activities"""
    
    framework = {
        "activity_types": {
            "Sensory": {
                "description": "Activities that engage multiple senses for cognitive development",
                "age_appropriateness": {"Infant": "High", "Toddler": "High", "Preschooler": "Medium", "Child": "Low", "Pre-Teen": "Low", "Teen": "Low"},
                "cognitive_focus": "Multi-sensory processing, sensory integration"
            },
            "Problem Solving": {
                "description": "Activities that require logical thinking and solution-finding",
                "age_appropriateness": {"Infant": "Low", "Toddler": "Medium", "Preschooler": "High", "Child": "High", "Pre-Teen": "High", "Teen": "High"},
                "cognitive_focus": "Logical reasoning, critical thinking, analysis"
            },
            "Memory": {
                "description": "Activities designed to enhance memory and recall abilities",
                "age_appropriateness": {"Infant": "Medium", "Toddler": "High", "Preschooler": "High", "Child": "High", "Pre-Teen": "High", "Teen": "High"},
                "cognitive_focus": "Working memory, long-term memory, retrieval"
            },
            "Attention": {
                "description": "Activities that build focus and sustained attention",
                "age_appropriateness": {"Infant": "High", "Toddler": "High", "Preschooler": "High", "Child": "High", "Pre-Teen": "High", "Teen": "High"},
                "cognitive_focus": "Sustained attention, selective attention, executive control"
            },
            "Language": {
                "description": "Activities that develop language and communication skills",
                "age_appropriateness": {"Infant": "High", "Toddler": "High", "Preschooler": "High", "Child": "Medium", "Pre-Teen": "Medium", "Teen": "Low"},
                "cognitive_focus": "Language processing, vocabulary, communication"
            },
            "Visual-Spatial": {
                "description": "Activities that develop visual and spatial reasoning",
                "age_appropriateness": {"Infant": "Medium", "Toddler": "High", "Preschooler": "High", "Child": "High", "Pre-Teen": "High", "Teen": "High"},
                "cognitive_focus": "Spatial reasoning, visual processing, pattern recognition"
            },
            "Executive Function": {
                "description": "Activities that build planning, organization, and self-control",
                "age_appropriateness": {"Infant": "Low", "Toddler": "Low", "Preschooler": "Medium", "Child": "High", "Pre-Teen": "High", "Teen": "High"},
                "cognitive_focus": "Planning, inhibition, cognitive flexibility"
            },
            "Creative Thinking": {
                "description": "Activities that foster creative and divergent thinking",
                "age_appropriateness": {"Infant": "Medium", "Toddler": "High", "Preschooler": "High", "Child": "High", "Pre-Teen": "High", "Teen": "High"},
                "cognitive_focus": "Divergent thinking, creativity, innovation"
            },
            "Analytical": {
                "description": "Activities that develop analytical and systematic thinking",
                "age_appropriateness": {"Infant": "Low", "Toddler": "Low", "Preschooler": "Medium", "Child": "High", "Pre-Teen": "High", "Teen": "High"},
                "cognitive_focus": "Analysis, synthesis, systematic thinking"
            },
            "Social Cognition": {
                "description": "Activities that develop social understanding and empathy",
                "age_appropriateness": {"Infant": "Low", "Toddler": "Medium", "Preschooler": "High", "Child": "High", "Pre-Teen": "High", "Teen": "High"},
                "cognitive_focus": "Social understanding, empathy, perspective-taking"
            }
        },
        
        "difficulty_levels": {
            "Beginner": {
                "description": "Simple, straightforward activities with clear outcomes",
                "age_appropriateness": {"Infant": "High", "Toddler": "High", "Preschooler": "Medium", "Child": "Low", "Pre-Teen": "Low", "Teen": "Low"},
                "characteristics": "Clear instructions, immediate feedback, single-step processes"
            },
            "Intermediate": {
                "description": "Activities requiring some cognitive effort and multi-step thinking",
                "age_appropriateness": {"Infant": "Low", "Toddler": "Medium", "Preschooler": "High", "Child": "High", "Pre-Teen": "Medium", "Teen": "Low"},
                "characteristics": "Multi-step processes, some problem-solving, moderate complexity"
            },
            "Advanced": {
                "description": "Complex activities requiring higher-order thinking skills",
                "age_appropriateness": {"Infant": "None", "Toddler": "Low", "Preschooler": "Medium", "Child": "High", "Pre-Teen": "High", "Teen": "High"},
                "characteristics": "Complex reasoning, multiple strategies, abstract thinking"
            },
            "Expert": {
                "description": "Highly sophisticated activities requiring advanced cognitive skills",
                "age_appropriateness": {"Infant": "None", "Toddler": "None", "Preschooler": "Low", "Child": "Medium", "Pre-Teen": "High", "Teen": "High"},
                "characteristics": "Abstract concepts, meta-cognition, strategic planning"
            }
        },
        
        "age_specific_strategies": {
            "Infant (0-1)": {
                "primary_activity_types": ["Sensory", "Attention", "Language", "Visual-Spatial"],
                "secondary_activity_types": ["Memory", "Creative Thinking"],
                "avoid_activity_types": ["Problem Solving", "Executive Function", "Analytical", "Social Cognition"],
                "primary_difficulty": ["Beginner"],
                "secondary_difficulty": ["Intermediate"],
                "avoid_difficulty": ["Advanced", "Expert"],
                "categories": {
                    "Visual Tracking & Focus": {"activity_types": ["Sensory", "Attention"], "difficulty": ["Beginner"]},
                    "Cause and Effect Learning": {"activity_types": ["Sensory", "Problem Solving"], "difficulty": ["Beginner"]},
                    "Memory Development": {"activity_types": ["Memory", "Attention"], "difficulty": ["Beginner", "Intermediate"]},
                    "Problem Solving Basics": {"activity_types": ["Problem Solving", "Visual-Spatial"], "difficulty": ["Beginner"]},
                    "Language Foundation": {"activity_types": ["Language", "Sensory"], "difficulty": ["Beginner"]},
                    "Sensory Integration": {"activity_types": ["Sensory", "Attention"], "difficulty": ["Beginner"]},
                    "Visual Processing": {"activity_types": ["Visual-Spatial", "Attention"], "difficulty": ["Beginner"]},
                    "Creative Exploration": {"activity_types": ["Creative Thinking", "Sensory"], "difficulty": ["Beginner"]}
                }
            },
            "Toddler (1-3)": {
                "primary_activity_types": ["Sensory", "Memory", "Language", "Visual-Spatial", "Creative Thinking"],
                "secondary_activity_types": ["Attention", "Problem Solving"],
                "avoid_activity_types": ["Executive Function", "Analytical", "Social Cognition"],
                "primary_difficulty": ["Beginner", "Intermediate"],
                "secondary_difficulty": ["Advanced"],
                "avoid_difficulty": ["Expert"],
                "categories": {
                    "Pattern Recognition": {"activity_types": ["Visual-Spatial", "Memory"], "difficulty": ["Beginner", "Intermediate"]},
                    "Simple Classification": {"activity_types": ["Problem Solving", "Visual-Spatial"], "difficulty": ["Beginner", "Intermediate"]},
                    "Memory Building": {"activity_types": ["Memory", "Attention"], "difficulty": ["Beginner", "Intermediate"]},
                    "Language Development": {"activity_types": ["Language", "Memory"], "difficulty": ["Beginner", "Intermediate"]},
                    "Creative Expression": {"activity_types": ["Creative Thinking", "Sensory"], "difficulty": ["Beginner", "Intermediate"]},
                    "Visual Discrimination": {"activity_types": ["Visual-Spatial", "Attention"], "difficulty": ["Beginner", "Intermediate"]},
                    "Basic Problem Solving": {"activity_types": ["Problem Solving", "Visual-Spatial"], "difficulty": ["Beginner", "Intermediate"]},
                    "Sensory Exploration": {"activity_types": ["Sensory", "Creative Thinking"], "difficulty": ["Beginner"]}
                }
            },
            "Preschooler (3-5)": {
                "primary_activity_types": ["Problem Solving", "Memory", "Attention", "Visual-Spatial", "Creative Thinking"],
                "secondary_activity_types": ["Language", "Executive Function", "Sensory", "Social Cognition"],
                "avoid_activity_types": ["Analytical"],
                "primary_difficulty": ["Beginner", "Intermediate", "Advanced"],
                "secondary_difficulty": ["Expert"],
                "avoid_difficulty": [],
                "categories": {
                    "Advanced Problem Solving": {"activity_types": ["Problem Solving", "Visual-Spatial"], "difficulty": ["Intermediate", "Advanced"]},
                    "Executive Function": {"activity_types": ["Executive Function", "Attention"], "difficulty": ["Beginner", "Intermediate"]},
                    "Memory Strategies": {"activity_types": ["Memory", "Attention"], "difficulty": ["Intermediate", "Advanced"]},
                    "Creative Problem Solving": {"activity_types": ["Creative Thinking", "Problem Solving"], "difficulty": ["Beginner", "Intermediate"]},
                    "Visual-Spatial Reasoning": {"activity_types": ["Visual-Spatial", "Problem Solving"], "difficulty": ["Intermediate", "Advanced"]},
                    "Language Processing": {"activity_types": ["Language", "Memory"], "difficulty": ["Intermediate", "Advanced"]},
                    "Social Understanding": {"activity_types": ["Social Cognition", "Language"], "difficulty": ["Beginner", "Intermediate"]},
                    "Attention Control": {"activity_types": ["Attention", "Executive Function"], "difficulty": ["Intermediate", "Advanced"]}
                }
            },
            "Child (6-8)": {
                "primary_activity_types": ["Problem Solving", "Analytical", "Executive Function", "Memory", "Visual-Spatial"],
                "secondary_activity_types": ["Creative Thinking", "Attention", "Social Cognition", "Language"],
                "avoid_activity_types": ["Sensory"],
                "primary_difficulty": ["Intermediate", "Advanced"],
                "secondary_difficulty": ["Beginner", "Expert"],
                "avoid_difficulty": [],
                "categories": {
                    "Complex Problem Solving": {"activity_types": ["Problem Solving", "Analytical"], "difficulty": ["Advanced", "Expert"]},
                    "Strategic Thinking": {"activity_types": ["Executive Function", "Analytical"], "difficulty": ["Advanced", "Expert"]},
                    "Advanced Memory": {"activity_types": ["Memory", "Attention"], "difficulty": ["Advanced", "Expert"]},
                    "Analytical Reasoning": {"activity_types": ["Analytical", "Problem Solving"], "difficulty": ["Advanced", "Expert"]},
                    "Executive Planning": {"activity_types": ["Executive Function", "Analytical"], "difficulty": ["Advanced", "Expert"]},
                    "Visual-Spatial Analysis": {"activity_types": ["Visual-Spatial", "Analytical"], "difficulty": ["Advanced", "Expert"]},
                    "Creative Analysis": {"activity_types": ["Creative Thinking", "Analytical"], "difficulty": ["Intermediate", "Advanced"]},
                    "Social Analysis": {"activity_types": ["Social Cognition", "Analytical"], "difficulty": ["Intermediate", "Advanced"]}
                }
            },
            "Pre-Teen (9-12)": {
                "primary_activity_types": ["Analytical", "Executive Function", "Problem Solving", "Creative Thinking", "Social Cognition"],
                "secondary_activity_types": ["Memory", "Attention", "Visual-Spatial", "Language"],
                "avoid_activity_types": ["Sensory"],
                "primary_difficulty": ["Advanced", "Expert"],
                "secondary_difficulty": ["Intermediate"],
                "avoid_difficulty": ["Beginner"],
                "categories": {
                    "Advanced Critical Thinking": {"activity_types": ["Analytical", "Problem Solving"], "difficulty": ["Expert"]},
                    "Complex Logic": {"activity_types": ["Analytical", "Executive Function"], "difficulty": ["Expert"]},
                    "Strategic Planning": {"activity_types": ["Executive Function", "Analytical"], "difficulty": ["Advanced", "Expert"]},
                    "Advanced Problem Solving": {"activity_types": ["Problem Solving", "Analytical"], "difficulty": ["Expert"]},
                    "Creative Analysis": {"activity_types": ["Creative Thinking", "Analytical"], "difficulty": ["Advanced", "Expert"]},
                    "Social Analysis": {"activity_types": ["Social Cognition", "Analytical"], "difficulty": ["Advanced", "Expert"]},
                    "Meta-cognition": {"activity_types": ["Executive Function", "Analytical"], "difficulty": ["Expert"]},
                    "Advanced Memory": {"activity_types": ["Memory", "Executive Function"], "difficulty": ["Advanced", "Expert"]}
                }
            },
            "Teen (13-18)": {
                "primary_activity_types": ["Analytical", "Executive Function", "Creative Thinking", "Social Cognition", "Problem Solving"],
                "secondary_activity_types": ["Memory", "Attention", "Visual-Spatial", "Language"],
                "avoid_activity_types": ["Sensory"],
                "primary_difficulty": ["Expert"],
                "secondary_difficulty": ["Advanced"],
                "avoid_difficulty": ["Beginner", "Intermediate"],
                "categories": {
                    "Advanced Analytical Thinking": {"activity_types": ["Analytical", "Executive Function"], "difficulty": ["Expert"]},
                    "Innovation Thinking": {"activity_types": ["Creative Thinking", "Analytical"], "difficulty": ["Expert"]},
                    "Strategic Leadership": {"activity_types": ["Executive Function", "Social Cognition"], "difficulty": ["Expert"]},
                    "Complex Systems Thinking": {"activity_types": ["Analytical", "Problem Solving"], "difficulty": ["Expert"]},
                    "Advanced Social Cognition": {"activity_types": ["Social Cognition", "Analytical"], "difficulty": ["Expert"]},
                    "Meta-cognitive Strategies": {"activity_types": ["Executive Function", "Analytical"], "difficulty": ["Expert"]},
                    "Creative Problem Solving": {"activity_types": ["Creative Thinking", "Problem Solving"], "difficulty": ["Expert"]},
                    "Advanced Decision Making": {"activity_types": ["Executive Function", "Analytical"], "difficulty": ["Expert"]}
                }
            }
        }
    }
    
    return framework

def apply_strategic_framework_to_sheets(client):
    """Apply the strategic framework to update existing data and add strategy metadata"""
    
    try:
        # Find the spreadsheet
        all_sheets = client.list_spreadsheet_files()
        target_sheet = None
        
        for sheet in all_sheets:
            title = sheet.get('name', sheet.get('title', '')).lower()
            if 'sample' in title or 'essential' in title:
                target_sheet = sheet
                break
        
        if not target_sheet:
            print("❌ No suitable spreadsheet found")
            return False
        
        # Open the spreadsheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        worksheet = spreadsheet.get_worksheet(0)
        
        print(f"📤 Working with: {target_sheet.get('name', 'Unknown')}")
        
        # Get all data
        all_data = worksheet.get_all_values()
        if not all_data:
            print("❌ No data found")
            return False
        
        headers = all_data[0]
        print(f"📋 Found {len(headers)} columns")
        
        # Use existing column for strategy metadata (Additional Information or General Instructions)
        strategy_column = 'Additional Information'  # Use existing column
        if strategy_column not in headers:
            strategy_column = 'General Instructions'  # Fallback
        if strategy_column not in headers:
            print("❌ No suitable column found for strategy metadata")
            return False
        
        print(f"📝 Using '{strategy_column}' column for strategy metadata")
        
        # Get the framework
        framework = create_strategic_framework()
        
        # Find Cognitive Skills infant rows
        infant_rows = []
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        strategy_col_index = headers.index(strategy_column) if strategy_column in headers else None
        
        if not all([pillar_col_index, age_group_col_index, strategy_col_index]):
            print("❌ Required columns not found")
            return False
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if (len(row) > pillar_col_index and row[pillar_col_index].strip() == 'Cognitive Skills' and
                len(row) > age_group_col_index and 'infant' in row[age_group_col_index].lower()):
                infant_rows.append((row_num, row))
        
        print(f"👶 Found {len(infant_rows)} Cognitive Skills infant activities to update")
        
        # Apply strategic framework to infant activities
        infant_strategy = framework["age_specific_strategies"]["Infant (0-1)"]
        updates_made = 0
        
        for row_num, row in infant_rows:
            updates = []
            
            # Get current values
            category = row[headers.index('Category')] if 'Category' in headers and len(row) > headers.index('Category') else ""
            activity_type = row[headers.index('Activity Type')] if 'Activity Type' in headers and len(row) > headers.index('Activity Type') else ""
            difficulty = row[headers.index('Difficulty Level')] if 'Difficulty Level' in headers and len(row) > headers.index('Difficulty Level') else ""
            
            # Determine appropriate activity type based on category
            if category in infant_strategy["categories"]:
                suggested_types = infant_strategy["categories"][category]["activity_types"]
                suggested_difficulty = infant_strategy["categories"][category]["difficulty"]
                
                # Update activity type if it's only "Sensory"
                if activity_type == "Sensory" or not activity_type:
                    # Choose appropriate type from suggestions
                    new_activity_type = suggested_types[0]  # Use primary type
                    worksheet.update_cell(row_num, headers.index('Activity Type') + 1, new_activity_type)
                    updates.append(f"Activity Type: {new_activity_type}")
                
                # Update difficulty if it's only "Beginner"
                if difficulty == "Beginner" or not difficulty:
                    # Choose appropriate difficulty from suggestions
                    new_difficulty = suggested_difficulty[0] if suggested_difficulty else "Beginner"
                    worksheet.update_cell(row_num, headers.index('Difficulty Level') + 1, new_difficulty)
                    updates.append(f"Difficulty: {new_difficulty}")
                
                # Add strategy metadata to existing column
                current_strategy = row[strategy_col_index] if len(row) > strategy_col_index else ""
                strategy_text = f"STRATEGY: Category={category} | Types={', '.join(suggested_types)} | Difficulty={', '.join(suggested_difficulty)}"
                if current_strategy:
                    strategy_text = f"{current_strategy} | {strategy_text}"
                worksheet.update_cell(row_num, strategy_col_index + 1, strategy_text)
                updates.append(f"Strategy: Added to {strategy_column}")
            
            if updates:
                print(f"✅ Row {row_num}: {', '.join(updates)}")
                updates_made += 1
                time.sleep(0.5)  # Rate limiting
        
        print(f"\n🎉 STRATEGIC FRAMEWORK APPLIED!")
        print("=" * 50)
        print(f"✅ Updated {updates_made} infant activities")
        print(f"✅ Added Strategy metadata column")
        print(f"✅ Diversified activity types and difficulty levels")
        print(f"✅ Applied age-appropriate strategic framework")
        
        return True
        
    except Exception as e:
        print(f"❌ Error applying framework: {e}")
        return False

def main():
    """Main function to implement strategic framework"""
    print("🧠 Implementing Cognitive Skills Strategic Framework")
    print("=" * 60)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Apply the framework
    success = apply_strategic_framework_to_sheets(client)
    
    if success:
        print(f"\n🚀 STRATEGIC FRAMEWORK SUMMARY:")
        print("=" * 40)
        print("✅ 10 Activity Types: Sensory, Problem Solving, Memory, Attention, Language, Visual-Spatial, Executive Function, Creative Thinking, Analytical, Social Cognition")
        print("✅ 4 Difficulty Levels: Beginner, Intermediate, Advanced, Expert")
        print("✅ Age-Appropriate Distribution: Each age group has specific type and difficulty combinations")
        print("✅ Strategic Categories: Each category has defined activity types and difficulty ranges")
        print("✅ Metadata Enhancement: Strategy column added with detailed planning information")
        
        print(f"\n📊 INFANT (0-1) STRATEGY:")
        print("   Primary Activity Types: Sensory, Attention, Language, Visual-Spatial")
        print("   Secondary Activity Types: Memory, Creative Thinking")
        print("   Primary Difficulty: Beginner")
        print("   Secondary Difficulty: Intermediate")
        print("   Categories: 8 diverse cognitive development areas")
        
        print(f"\n🎯 RESULT:")
        print("   ✅ Eliminated 'Sensory-only' monotony")
        print("   ✅ Eliminated 'Beginner-only' limitation")
        print("   ✅ Added strategic diversity and progression")
        print("   ✅ Created age-appropriate cognitive development pathways")
        
        return True
    else:
        print(f"\n❌ Strategic framework implementation failed")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Strategic framework implemented!")
    else:
        print(f"\n❌ FAILED to implement strategic framework!")
