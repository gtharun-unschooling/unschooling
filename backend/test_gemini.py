#!/usr/bin/env python3
"""
Test Gemini model access in Vertex AI
"""
import vertexai
from vertexai.generative_models import GenerativeModel

# Initialize Vertex AI
vertexai.init(project="unschooling-464413", location="us-central1")

# Try different model names
model_names_to_try = [
    "gemini-pro",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-flash-001",
    "gemini-flash",
]

for model_name in model_names_to_try:
    print(f"\n🧪 Testing model: {model_name}")
    try:
        model = GenerativeModel(model_name)
        response = model.generate_content("Hello, respond with just 'OK'")
        print(f"✅ SUCCESS! Model '{model_name}' works!")
        print(f"   Response: {response.text}")
        break  # Stop on first success
    except Exception as e:
        print(f"❌ FAILED: {str(e)[:150]}")

print("\n✅ Test complete!")

