#!/bin/bash
# Deployment script that handles different scenarios

echo "=== SocialBlaster Flask Deployment ==="

# Check if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "Installing from requirements.txt..."
    pip install -r requirements.txt
elif [ -f "python-requirements.txt" ]; then
    echo "Installing from python-requirements.txt..."
    pip install -r python-requirements.txt
else
    echo "Installing Flask and gunicorn directly..."
    pip install Flask==3.1.1 gunicorn==23.0.0
fi

# Set default port if not provided
export PORT=${PORT:-8000}

echo "Starting server on port $PORT..."

# Try different deployment methods
if command -v gunicorn &> /dev/null; then
    echo "Using direct gunicorn command..."
    gunicorn app:app --bind 0.0.0.0:$PORT
elif python -m gunicorn --version &> /dev/null; then
    echo "Using python -m gunicorn..."
    python -m gunicorn app:app --bind 0.0.0.0:$PORT
else
    echo "Falling back to Flask development server..."
    python run.py
fi