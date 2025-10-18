#!/usr/bin/env python3
"""
Test Google AI Studio Gemini API
Run this to verify your API key works
"""
import os
import sys

print("=" * 60)
print("🧪 TESTING GOOGLE AI STUDIO GEMINI API")
print("=" * 60)

# Check for API key
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print("\n❌ ERROR: GEMINI_API_KEY not set")
    print("\n📝 To set it:")
    print("   export GEMINI_API_KEY='your-api-key-here'")
    print("\n🔑 Get your API key from:")
    print("   https://aistudio.google.com/app/apikey")
    sys.exit(1)

print(f"\n✅ API Key found: {api_key[:10]}...{api_key[-4:]}")

# Test import
print("\n1️⃣ Checking if google-generativeai is installed...")
try:
    import google.generativeai as genai
    print("   ✅ google-generativeai installed")
except ImportError:
    print("   ❌ Not installed. Run:")
    print("      pip install google-generativeai")
    sys.exit(1)

# Configure API
print("\n2️⃣ Configuring Google AI with API key...")
try:
    genai.configure(api_key=api_key)
    print("   ✅ Configured successfully")
except Exception as e:
    print(f"   ❌ Error: {e}")
    sys.exit(1)

# Test models
models_to_test = [
    'gemini-1.5-flash',      # Cheapest, fastest
    'gemini-1.5-pro',        # Better quality
    'gemini-pro',            # Legacy
]

print("\n3️⃣ Testing Gemini models...")
successful_models = []

for model_name in models_to_test:
    print(f"\n   🔍 Testing: {model_name}")
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Respond with just the word OK")
        
        if response and response.text:
            print(f"   ✅ SUCCESS!")
            print(f"      Response: {response.text.strip()}")
            successful_models.append(model_name)
            
            # If Flash works, we're good!
            if 'flash' in model_name:
                print(f"\n   🎯 PERFECT! gemini-1.5-flash works!")
                break
                
    except Exception as e:
        error_msg = str(e)
        if "API_KEY_INVALID" in error_msg or "invalid" in error_msg.lower():
            print(f"   ❌ Invalid API key")
        elif "quota" in error_msg.lower():
            print(f"   ❌ Quota exceeded")
        elif "not found" in error_msg.lower():
            print(f"   ❌ Model not available")
        else:
            print(f"   ❌ Error: {error_msg[:100]}")

# Summary
print("\n" + "=" * 60)
print("📊 TEST SUMMARY")
print("=" * 60)

if successful_models:
    print(f"\n✅ {len(successful_models)} MODEL(S) WORKING!")
    for model in successful_models:
        print(f"   • {model}")
    
    print(f"\n🎯 RECOMMENDED MODEL: {successful_models[0]}")
    print("\n📝 Your backend is ready to use:")
    print(f'   model = genai.GenerativeModel("{successful_models[0]}")')
    print("\n✅ Everything is working! Ready to deploy!")
    
else:
    print("\n❌ NO MODELS WORKING")
    print("\n🔧 Check:")
    print("   1. Is your API key correct?")
    print("   2. Go to: https://aistudio.google.com/app/apikey")
    print("   3. Create a new key if needed")
    print("   4. Make sure you're not hitting rate limits")

print("\n" + "=" * 60 + "\n")

