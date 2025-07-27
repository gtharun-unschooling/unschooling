from utils.utils import load_niche_data
import random
import re
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Use Gemini 1.5 Flash model
model = genai.GenerativeModel("models/gemini-1.5-flash")

def parse_age_string(age_str):
    age_str = age_str.lower().replace("and", ",").replace("to", "-")
    result = []
    parts = [part.strip() for part in re.split(r"[,\-]", age_str) if part.strip().isdigit()]
    if "-" in age_str:
        try:
            bounds = [int(p.strip()) for p in age_str.split("-")]
            if len(bounds) == 2:
                result.extend(range(bounds[0], bounds[1] + 1))
        except ValueError:
            pass
    else:
        result.extend(int(p) for p in parts)
    return list(set(result))

def run_match_agent(state):
    profile = state["profile"]
    child_age = int(profile["child_age"])
    interest_niches = profile["interests"]
    
    niche_data = load_niche_data()
    
    eligible_topics = []
    for item in niche_data:
        age_list = parse_age_string(item.get("Age", ""))
        if child_age in age_list and item["Niche"] in interest_niches:
            eligible_topics.append(item)

    if len(eligible_topics) == 0:
        return {
            "profile": profile,
            "matched_topics": []
        }

    # Prepare the LLM prompt
    prompt_parts = [
        f"You are an educational agent helping build a custom learning plan for a child.\n",
        f"Child's Profile:\nAge: {child_age}\nInterests: {interest_niches}\n",
        f"Here is a list of candidate topics:\n"
    ]

    for idx, topic in enumerate(eligible_topics, 1):
        prompt_parts.append(
            f"{idx}. Topic: {topic['Topic']}, Niche: {topic['Niche']}, Age: {topic['Age']}"
        )
    
    prompt_parts.append(
        "\nFrom this list, choose the best 4 topics that are most exciting, age-appropriate, and aligned with the child's interests. Return only the selected topics in a JSON array with fields: Topic, Niche, Age."
    )

    full_prompt = "\n".join(prompt_parts)

    # Send prompt to Gemini
    try:
        response = model.generate_content(full_prompt)
        response_text = response.text

        # Try parsing JSON from response
        matched_topics = json.loads(response_text)

        return {
            "profile": profile,
            "matched_topics": matched_topics
        }

    except Exception as e:
        print("Gemini LLM error:", str(e))
        # Fallback to random selection
        fallback = random.sample(eligible_topics, min(4, len(eligible_topics)))
        return {
            "profile": profile,
            "matched_topics": fallback
        }
