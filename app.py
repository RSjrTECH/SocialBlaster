from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'SocialBlaster Flask API'})


@app.route('/api/python-status')
def python_status():
    return jsonify({
        'message':
        'Python Flask service is running',
        'version':
        '3.1.1',
        'features': ['Flask API', 'Template rendering', 'Static files']
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
@app.route("/healthz")
def health_check():
    return "OK", 200