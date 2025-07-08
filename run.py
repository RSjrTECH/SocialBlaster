#!/usr/bin/env python3
"""
Alternative entry point for deployment platforms that have issues with gunicorn
"""
import os
from app import app

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8000))
    host = os.environ.get('HOST', '0.0.0.0')
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    print(f"Starting Flask app on {host}:{port}")
    app.run(host=host, port=port, debug=debug)