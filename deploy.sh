#!/bin/bash

# Azure Web App Deployment Script

echo "Starting deployment..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build TypeScript
echo "Building TypeScript..."
npm run build

# Run migrations (optional - comment out if you prefer manual migrations)
# echo "Running database migrations..."
# npm run migrate

echo "Deployment completed successfully!"
