#!/bin/bash
# Install dependencies if needed
pip install -r requirements.txt

# Run the app with gunicorn
python -m gunicorn app:app --bind 0.0.0.0:${PORT:-8000} --workers 1