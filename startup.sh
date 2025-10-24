#!/bin/bash

# Azure App Service Custom Startup Script
# This script bypasses npm install and starts the application directly

echo "Starting Digital Signage Backend..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "ERROR: dist folder not found. Build not deployed properly."
    exit 1
fi

# Check if node_modules exists, if not install ONLY production dependencies quickly
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Installing production dependencies only..."
    npm ci --only=production --prefer-offline --no-audit
else
    echo "node_modules found. Skipping install."
fi

# Start the application
echo "Starting application..."
exec node dist/index.js
