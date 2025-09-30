#!/usr/bin/env python3
"""
🧠 Cognitive Skills Data Enhancement Script
Generate comprehensive cognitive skills data to match Play Creativity pillar structure
"""

import json
import csv
from datetime import datetime

def create_cognitive_skills_enhanced_data():
    """Create enhanced cognitive skills data structure"""
    
    cognitive_skills_data = {
        "ageGroups": [
            {
                "ageGroup": "Infant (0-1)",
                "categories": [
                    {
                        "category": "Visual Tracking & Focus",
                        "description": "Develop visual attention and tracking abilities through hands-on activities",
                        "activities": [
                            {
                                "topicNumber": 1,
                                "topic": "High Contrast Card Play",
                                "objective": "Stimulate visual development and focus through engaging card activities",
                                "explanation": "Use high contrast cards to capture baby's attention and develop visual tracking skills through interactive play. Stimulate visual development and focus through engaging card activities.",
                                "hashtags": ["#VisualDevelopment", "#FocusTraining", "#InfantActivities"],
                                "estimatedTime": "5-10 min",
                                "age": "0-6 months",
                                "activity": {
                                    "name": "Fun High Contrast Card Play",
                                    "materials": ["High contrast black and white cards", "Baby-safe mirror", "Soft play mat"],
                                    "steps": [
                                        "1. Place baby on soft play mat in comfortable position",
                                        "2. Hold high contrast cards 8-12 inches from baby's face",
                                        "3. Slowly move cards left to right, watching for eye tracking",
                                        "4. Use baby-safe mirror to show baby their own reflection",
                                        "5. Talk to baby about what they're seeing: 'Look at the black and white patterns!'"
                                    ],
                                    "skills": ["Visual tracking", "Focus development", "Eye coordination", "Attention span"]
                                }
                            }
                        ]
                    },
                    {
                        "category": "Cause and Effect Learning",
                        "description": "Introduce basic cause-and-effect relationships through interactive play",
                        "activities": [
                            {
                                "topicNumber": 1,
                                "topic": "Rattle and Shake Discovery",
                                "objective": "Teach baby that their actions create sounds and movement",
                                "explanation": "Help baby discover that shaking a rattle creates sound, establishing early cause-and-effect understanding.",
                                "hashtags": ["#CauseAndEffect", "#MotorSkills", "#SoundRecognition"],
                                "estimatedTime": "5-10 min",
                                "age": "3-8 months",
                                "activity": {
                                    "name": "Magic Rattle Discovery",
                                    "materials": ["Soft rattle", "Various sound toys", "Play mat"],
                                    "steps": [
                                        "1. Place baby on play mat in comfortable position",
                                        "2. Show baby the rattle and let them see it",
                                        "3. Gently shake the rattle to demonstrate the sound",
                                        "4. Help baby grasp and shake the rattle",
                                        "5. Celebrate when baby makes sounds independently"
                                    ],
                                    "skills": ["Cause and effect", "Motor control", "Sound recognition", "Hand-eye coordination"]
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "ageGroup": "Toddler (1-3)",
                "categories": [
                    {
                        "category": "Pattern Recognition",
                        "description": "Develop early pattern recognition and classification skills",
                        "activities": [
                            {
                                "topicNumber": 1,
                                "topic": "Color Sorting Fun",
                                "objective": "Introduce basic sorting and pattern recognition through color games",
                                "explanation": "Help toddlers recognize patterns by sorting objects by color, building early classification skills.",
                                "hashtags": ["#PatternRecognition", "#ColorSorting", "#ToddlerActivities"],
                                "estimatedTime": "10-15 min",
                                "age": "18-36 months",
                                "activity": {
                                    "name": "Rainbow Sorting Adventure",
                                    "materials": ["Colored blocks or toys", "Sorting containers", "Color cards"],
                                    "steps": [
                                        "1. Set up colored containers or spaces",
                                        "2. Show toddler different colored objects",
                                        "3. Demonstrate sorting by putting red items in red space",
                                        "4. Encourage toddler to sort remaining items",
                                        "5. Celebrate correct sorting with enthusiasm"
                                    ],
                                    "skills": ["Pattern recognition", "Color identification", "Classification", "Fine motor skills"]
                                }
                            }
                        ]
                    },
                    {
                        "category": "Simple Classification",
                        "description": "Develop basic categorization and grouping skills",
                        "activities": [
                            {
                                "topicNumber": 1,
                                "topic": "Big and Small Sorting",
                                "objective": "Teach basic size comparison and classification",
                                "explanation": "Help toddlers understand size concepts by sorting objects into big and small groups.",
                                "hashtags": ["#Classification", "#SizeConcepts", "#ToddlerLearning"],
                                "estimatedTime": "10-15 min",
                                "age": "18-36 months",
                                "activity": {
                                    "name": "Size Detective Game",
                                    "materials": ["Various sized objects", "Two boxes (big/small)", "Size comparison cards"],
                                    "steps": [
                                        "1. Gather objects of different sizes",
                                        "2. Show toddler the big and small boxes",
                                        "3. Demonstrate putting large items in big box",
                                        "4. Let toddler try sorting remaining items",
                                        "5. Talk about sizes: 'This ball is big!' 'This button is small!'"
                                    ],
                                    "skills": ["Size comparison", "Classification", "Vocabulary development", "Logical thinking"]
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "ageGroup": "Preschooler (3-5)",
                "categories": [
                    {
                        "category": "Advanced Problem Solving",
                        "description": "Develop complex problem-solving skills through engaging challenges",
                        "activities": [
                            {
                                "topicNumber": 1,
                                "topic": "Puzzle Master Challenge",
                                "objective": "Build problem-solving skills through age-appropriate puzzles",
                                "explanation": "Use puzzles to develop spatial reasoning, pattern recognition, and persistence in problem-solving.",
                                "hashtags": ["#ProblemSolving", "#Puzzles", "#SpatialReasoning"],
                                "estimatedTime": "15-20 min",
                                "age": "3-5 years",
                                "activity": {
                                    "name": "Mystery Puzzle Quest",
                                    "materials": ["Age-appropriate puzzles", "Timer", "Progress chart"],
                                    "steps": [
                                        "1. Choose a puzzle appropriate for child's skill level",
                                        "2. Look at the puzzle picture together",
                                        "3. Start with corner and edge pieces",
                                        "4. Work on sections that match the picture",
                                        "5. Celebrate completion and discuss strategies used"
                                    ],
                                    "skills": ["Problem solving", "Spatial reasoning", "Persistence", "Visual processing"]
                                }
                            }
                        ]
                    },
                    {
                        "category": "Executive Function",
                        "description": "Develop planning, organization, and self-control skills",
                        "activities": [
                            {
                                "topicNumber": 1,
                                "topic": "Morning Routine Planning",
                                "objective": "Develop planning and organization skills through daily routines",
                                "explanation": "Help children learn to plan and organize their daily activities, building executive function skills.",
                                "hashtags": ["#ExecutiveFunction", "#Planning", "#Organization"],
                                "estimatedTime": "10-15 min",
                                "age": "3-5 years",
                                "activity": {
                                    "name": "Super Planner Adventure",
                                    "materials": ["Picture cards of daily activities", "Chart paper", "Stickers"],
                                    "steps": [
                                        "1. Show child picture cards of morning activities",
                                        "2. Discuss what needs to be done first, second, etc.",
                                        "3. Arrange cards in logical order",
                                        "4. Create a visual schedule together",
                                        "5. Practice following the routine"
                                    ],
                                    "skills": ["Planning", "Organization", "Sequencing", "Self-regulation"]
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "ageGroup": "Child (6-8)",
                "categories": [
                    {
                        "category": "Complex Problem Solving",
                        "description": "Develop advanced problem-solving strategies and critical thinking",
                        "activities": [
                            {
                                "topicNumber": 1,
                                "topic": "Escape Room Challenge",
                                "objective": "Apply multiple problem-solving strategies to solve complex puzzles",
                                "explanation": "Create an age-appropriate escape room experience to develop complex problem-solving skills.",
                                "hashtags": ["#ComplexProblemSolving", "#CriticalThinking", "#Teamwork"],
                                "estimatedTime": "30-45 min",
                                "age": "6-8 years",
                                "activity": {
                                    "name": "Mystery Mansion Escape",
                                    "materials": ["Locks and keys", "Puzzle pieces", "Clue cards", "Timer"],
                                    "steps": [
                                        "1. Set up a series of connected puzzles",
                                        "2. Give child the first clue to start",
                                        "3. Guide them through problem-solving process",
                                        "4. Encourage multiple solution attempts",
                                        "5. Celebrate when they 'escape' and discuss strategies"
                                    ],
                                    "skills": ["Complex problem solving", "Critical thinking", "Persistence", "Strategic planning"]
                                }
                            }
                        ]
                    },
                    {
                        "category": "Strategic Thinking",
                        "description": "Develop planning and strategic decision-making skills",
                        "activities": [
                            {
                                "topicNumber": 1,
                                "topic": "Chess for Beginners",
                                "objective": "Introduce strategic thinking through chess basics",
                                "explanation": "Use chess to develop strategic thinking, planning ahead, and considering consequences.",
                                "hashtags": ["#StrategicThinking", "#Chess", "#Planning"],
                                "estimatedTime": "20-30 min",
                                "age": "6-8 years",
                                "activity": {
                                    "name": "Chess Strategy Adventure",
                                    "materials": ["Chess set", "Chess puzzle cards", "Timer"],
                                    "steps": [
                                        "1. Introduce basic chess piece movements",
                                        "2. Start with simple endgame scenarios",
                                        "3. Practice thinking 2-3 moves ahead",
                                        "4. Discuss why certain moves are good",
                                        "5. Gradually increase complexity"
                                    ],
                                    "skills": ["Strategic thinking", "Planning ahead", "Consequence evaluation", "Patience"]
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "ageGroup": "Pre-Teen (9-12)",
                "categories": [
                    {
                        "category": "Advanced Critical Thinking",
                        "description": "Develop sophisticated critical thinking and analysis skills",
                        "activities": [
                            {
                                "topicNumber": 1,
                                "topic": "Debate and Discussion",
                                "objective": "Develop critical thinking through structured debate and analysis",
                                "explanation": "Use age-appropriate debate topics to develop critical thinking, evidence evaluation, and persuasive reasoning.",
                                "hashtags": ["#CriticalThinking", "#Debate", "#Analysis"],
                                "estimatedTime": "30-45 min",
                                "age": "9-12 years",
                                "activity": {
                                    "name": "Young Debater Challenge",
                                    "materials": ["Debate topics", "Research materials", "Timer", "Scoring sheet"],
                                    "steps": [
                                        "1. Choose an age-appropriate debate topic",
                                        "2. Research both sides of the argument",
                                        "3. Practice presenting evidence",
                                        "4. Listen to opposing arguments",
                                        "5. Reflect on what makes a strong argument"
                                    ],
                                    "skills": ["Critical thinking", "Evidence evaluation", "Persuasive reasoning", "Active listening"]
                                }
                            }
                        ]
                    },
                    {
                        "category": "Complex Logic",
                        "description": "Develop advanced logical reasoning and deductive thinking",
                        "activities": [
                            {
                                "topicNumber": 1,
                                "topic": "Logic Puzzle Mastery",
                                "objective": "Master complex logic puzzles and deductive reasoning",
                                "explanation": "Use advanced logic puzzles to develop deductive reasoning and systematic problem-solving approaches.",
                                "hashtags": ["#Logic", "#DeductiveReasoning", "#Puzzles"],
                                "estimatedTime": "25-35 min",
                                "age": "9-12 years",
                                "activity": {
                                    "name": "Logic Detective Agency",
                                    "materials": ["Logic puzzle books", "Grid paper", "Pencils", "Timer"],
                                    "steps": [
                                        "1. Start with a logic grid puzzle",
                                        "2. Read all clues carefully",
                                        "3. Use process of elimination",
                                        "4. Make logical deductions step by step",
                                        "5. Check reasoning and find the solution"
                                    ],
                                    "skills": ["Logical reasoning", "Deductive thinking", "Systematic analysis", "Attention to detail"]
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "ageGroup": "Teen (13-18)",
                "categories": [
                    {
                        "category": "Advanced Analytical Thinking",
                        "description": "Develop sophisticated analytical and evaluative thinking skills",
                        "activities": [
                            {
                                "topicNumber": 1,
                                "topic": "Case Study Analysis",
                                "objective": "Apply analytical thinking to complex real-world scenarios",
                                "explanation": "Use case studies to develop advanced analytical thinking, evidence evaluation, and solution development.",
                                "hashtags": ["#AnalyticalThinking", "#CaseStudy", "#RealWorldProblemSolving"],
                                "estimatedTime": "45-60 min",
                                "age": "13-18 years",
                                "activity": {
                                    "name": "Strategic Problem Solver",
                                    "materials": ["Case study materials", "Analysis framework", "Research resources", "Presentation tools"],
                                    "steps": [
                                        "1. Read and understand the case study scenario",
                                        "2. Identify key problems and stakeholders",
                                        "3. Research relevant information and data",
                                        "4. Analyze multiple potential solutions",
                                        "5. Present recommendations with supporting evidence"
                                    ],
                                    "skills": ["Analytical thinking", "Evidence evaluation", "Solution development", "Presentation skills"]
                                }
                            }
                        ]
                    },
                    {
                        "category": "Innovation Thinking",
                        "description": "Develop creative problem-solving and innovation skills",
                        "activities": [
                            {
                                "topicNumber": 1,
                                "topic": "Design Thinking Challenge",
                                "objective": "Apply design thinking methodology to solve complex problems",
                                "explanation": "Use design thinking to develop innovative solutions to real-world problems, building creativity and systematic innovation skills.",
                                "hashtags": ["#Innovation", "#DesignThinking", "#CreativeProblemSolving"],
                                "estimatedTime": "60-90 min",
                                "age": "13-18 years",
                                "activity": {
                                    "name": "Innovation Lab Workshop",
                                    "materials": ["Design thinking framework", "Prototyping materials", "Research tools", "Presentation materials"],
                                    "steps": [
                                        "1. Empathize: Research and understand the problem",
                                        "2. Define: Clearly articulate the problem",
                                        "3. Ideate: Generate multiple creative solutions",
                                        "4. Prototype: Build a simple model or mockup",
                                        "5. Test: Get feedback and iterate on the solution"
                                    ],
                                    "skills": ["Innovation thinking", "Creative problem solving", "Prototyping", "Iterative design"]
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
    
    return cognitive_skills_data

def save_to_csv(cognitive_skills_data, filename="enhanced_cognitive_skills.csv"):
    """Save cognitive skills data to CSV format for Google Sheets"""
    
    csv_data = []
    
    for age_group in cognitive_skills_data["ageGroups"]:
        age_group_name = age_group["ageGroup"]
        
        for category in age_group["categories"]:
            category_name = category["category"]
            category_description = category["description"]
            
            for activity in category["activities"]:
                row = {
                    "Pillar": "Cognitive Skills",
                    "Age Group": age_group_name,
                    "Category": category_name,
                    "Category Description": category_description,
                    "Topic Number": activity["topicNumber"],
                    "Topic": activity["topic"],
                    "Objective": activity["objective"],
                    "Explanation": activity["explanation"],
                    "Hashtags": "; ".join(activity["hashtags"]),
                    "Estimated Time": activity["estimatedTime"],
                    "Age": activity["age"],
                    "Activity Name": activity["activity"]["name"],
                    "Materials": "; ".join(activity["activity"]["materials"]),
                    "Steps": "; ".join(activity["activity"]["steps"]),
                    "Skills": "; ".join(activity["activity"]["skills"])
                }
                csv_data.append(row)
    
    # Write to CSV
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ["Pillar", "Age Group", "Category", "Category Description", "Topic Number", 
                     "Topic", "Objective", "Explanation", "Hashtags", "Estimated Time", "Age", 
                     "Activity Name", "Materials", "Steps", "Skills"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(csv_data)
    
    print(f"✅ Enhanced Cognitive Skills data saved to {filename}")
    print(f"📊 Total activities: {len(csv_data)}")
    print(f"📋 Age groups: {len(cognitive_skills_data['ageGroups'])}")
    
    return csv_data

def main():
    """Main function to generate enhanced cognitive skills data"""
    print("🧠 Cognitive Skills Data Enhancement")
    print("=" * 50)
    
    # Generate enhanced data
    cognitive_skills_data = create_cognitive_skills_enhanced_data()
    
    # Save to CSV for Google Sheets
    csv_data = save_to_csv(cognitive_skills_data)
    
    # Save to JSON for application
    json_filename = "enhanced_cognitive_skills.json"
    with open(json_filename, 'w', encoding='utf-8') as jsonfile:
        json.dump(cognitive_skills_data, jsonfile, indent=2, ensure_ascii=False)
    
    print(f"✅ Enhanced Cognitive Skills JSON saved to {json_filename}")
    
    # Summary
    print("\n🎉 ENHANCEMENT COMPLETE!")
    print("=" * 30)
    print(f"✅ Age Groups: {len(cognitive_skills_data['ageGroups'])}")
    print(f"✅ Total Activities: {len(csv_data)}")
    
    # Age group breakdown
    age_groups = {}
    for age_group in cognitive_skills_data["ageGroups"]:
        total_activities = sum(len(category["activities"]) for category in age_group["categories"])
        age_groups[age_group["ageGroup"]] = total_activities
    
    print("\n📊 Activities by Age Group:")
    for age_group, count in age_groups.items():
        print(f"   {age_group}: {count} activities")
    
    print(f"\n📁 Files created:")
    print(f"   - enhanced_cognitive_skills.csv (for Google Sheets)")
    print(f"   - enhanced_cognitive_skills.json (for application)")
    print(f"   - cognitive_skills_enhancement_plan.md (plan document)")
    
    print(f"\n🚀 Next Steps:")
    print(f"   1. Upload enhanced_cognitive_skills.csv to Google Sheets")
    print(f"   2. Run sync script to update application data")
    print(f"   3. Test cognitive skills pillar in application")

if __name__ == "__main__":
    main()
