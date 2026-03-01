#!/bin/bash
set -e

echo "🧪 Running pre-push tests..."
echo ""

# Kill any existing server
fuser -k 3000/tcp 2>/dev/null || true
sleep 2

# Build the project
echo "📦 Building project..."
npm run build > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi
echo "✅ Build successful"

# Start server in background using Python
echo "🚀 Starting server..."
cd out
python3 -m http.server 3000 > /dev/null 2>&1 &
SERVER_PID=$!
cd ..
sleep 3

# Test homepage
echo "🔍 Testing homepage..."
if curl -s http://localhost:3000/ | grep -q "数学乐园"; then
  echo "✅ Homepage test passed"
else
  echo "❌ Homepage test failed"
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

# Test game routes
echo "🔍 Testing game routes..."
for game in counting arithmetic matching comparison; do
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/games/$game/)
  if [ "$status" = "200" ]; then
    echo "✅ /games/$game/ test passed"
  else
    echo "❌ /games/$game/ test failed with status $status"
    kill $SERVER_PID 2>/dev/null
    exit 1
  fi
done

# Test manifest
echo "🔍 Testing PWA manifest..."
if curl -s http://localhost:3000/manifest.json | grep -q "数学乐园"; then
  echo "✅ Manifest test passed"
else
  echo "❌ Manifest test failed"
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

# Verify static files
echo "🔍 Verifying static files..."
if [ ! -f "out/index.html" ]; then
  echo "❌ out/index.html not found"
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

if [ ! -f "out/.nojekyll" ]; then
  echo "❌ out/.nojekyll not found"
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

for game in counting arithmetic matching comparison; do
  if [ ! -f "out/games/$game/index.html" ]; then
    echo "❌ out/games/$game/index.html not found"
    kill $SERVER_PID 2>/dev/null
    exit 1
  fi
done
echo "✅ All static files verified"

# Cleanup
echo "🧹 Cleaning up..."
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null || true

echo ""
echo "✅ All pre-push tests passed! Safe to push."
echo ""
