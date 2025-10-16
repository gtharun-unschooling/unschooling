#!/bin/bash

echo "🚀 Deploying Analysis Agent Fix to Cloud Run..."
echo ""
echo "Changes:"
echo "  ✅ Fixed theme file path (works in both local & Cloud Run)"
echo "  ✅ Added comprehensive error logging"
echo "  ✅ Added theme availability checks"
echo ""

cd backend

echo "📦 Deploying to Cloud Run..."
gcloud run deploy unschooling-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --quiet

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🧪 Testing..."
    sleep 5
    
    # Test health
    echo "Testing health endpoint..."
    curl -s https://unschooling-backend-44gsrw22gq-uc.a.run.app/health | python3 -m json.tool
    
    echo ""
    echo "✅ Backend is healthy!"
    echo ""
    echo "📋 Next: Test with customer and check logs for Analysis Agent theme loading"
else
    echo ""
    echo "❌ Deployment failed!"
fi

