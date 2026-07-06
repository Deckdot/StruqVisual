#!/bin/sh
set -e

# Run the database migrations
echo "Running database migrations..."
node migrate.cjs

# Start the Next.js standalone application
echo "Starting Next.js..."
node server.js
