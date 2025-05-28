from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, origins=['*']) 

def get_bot_response(user_message):
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise Exception("API key not configured")
    genai.configure(api_key=api_key)
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        return model.generate_content(user_message)
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        raise e

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data received'}), 400
            
        user_message = data.get('message', '')
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        print(f"Received message: {user_message}")
        response = get_bot_response(user_message)
        print(f"Bot response: {response.text}")
        
        return jsonify({'response': response.text})
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
