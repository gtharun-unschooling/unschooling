import json
import os

# Set the correct path to your real data JSON file
data_path = os.path.join("src", "data", "topicsdata.json")  # Adjust if your file is named differently

# Load the real data
with open(data_path, "r", encoding="utf-8") as f:
    raw_data = json.load(f)

# Prepare embedding + metadata
embedding_metadata_pairs = []

for item in raw_data:
    # Fallbacks for safety
    activity_1 = item.get("Activity 1", "")
    activity_2 = item.get("Activity 2", "")

    # Combine activity details
    activity_summary = f"{activity_1}\n{activity_2}"

    # Embedding text
    embedding_text = f"""Topic: {item.get('Topic', '')}
Objective: {item.get('Objective', '')}
Explanation: {item.get('Explanation', '')}
Activities Summary:
{activity_summary}
""".strip()

    # Metadata
    metadata = {
        "id": f"{item.get('Niche', '').lower()}-{item.get('#', '')}",
        "niche": item.get("Niche", ""),
        "topic": item.get("Topic", ""),
        "age": item.get("Age", ""),
        "estimated_time": item.get("Estimated Time", ""),
        "hashtags": item.get("Hashtags", ""),
        "activity_1": activity_1,
        "activity_2": activity_2
    }

    embedding_metadata_pairs.append({
        "embedding_text": embedding_text,
        "metadata": metadata
    })

# Save to intermediate JSON file if needed
with open(os.path.join("src", "data", "prepared_embeddings.json"), "w", encoding="utf-8") as f:
    json.dump(embedding_metadata_pairs, f, ensure_ascii=False, indent=2)

print("✅ Prepared embedding data with metadata.")
