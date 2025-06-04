from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from database import users_collection # Assuming 'database' module is correctly set up
import os
import requests
import time
import traceback
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
bcrypt = Bcrypt(app)

# FIX: Removed the trailing slash from the Vercel origin URL
CORS(app, resources={r"/*": {"origins": "*"}})

# Azure OpenAI credentials
AZURE_API_KEY = os.getenv("AZURE_API_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_API_ENDPOINT")  # e.g., https://your-resource.openai.azure.com/
AZURE_API_VERSION = os.getenv("AZURE_API_VERSION")  # e.g., 2024-05-01
AZURE_DEPLOYMENT_ID = os.getenv("AZURE_DEPLOYMENT_ID")


@app.route("/", methods=["GET"])
def home():
    return "✅ Backend is running!", 200 



## Register Route

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return jsonify({"error": "Missing fields!"}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"error": "User already exists!"}), 409

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        users_collection.insert_one({
            "username": username,
            "email": email,
            "password": hashed_password,
            "images": []
        })

        print(f"✅ Registered: {email}")
        return jsonify({"message": "Registration successful!"}), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



## Login Route

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Missing email or password!"}), 400

        user = users_collection.find_one({"email": email})

        if not user:
            return jsonify({"error": "User not found!"}), 404

        if bcrypt.check_password_hash(user["password"], password):
            print(f"✅ Login successful: {email}")
            print(f"🧠 Sending username: {user.get('username')}")
            return jsonify({"message": "Login successful!", "username": user["username"]}), 200
        else:
            return jsonify({"error": "Invalid password!"}), 401

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



## Image Generation (Azure DALL·E 3)

@app.route("/generate-image", methods=["POST"])
def generate_image():
    print("helalooyayya ")
    try:
        data = request.json
        prompt = data.get("prompt")
        username = data.get("username")

        if not prompt:
            return jsonify({"error": "Prompt is required!"}), 400

        endpoint = f"{AZURE_ENDPOINT}openai/deployments/{AZURE_DEPLOYMENT_ID}/images/generations?api-version={AZURE_API_VERSION}"

        headers = {
            "api-key": AZURE_API_KEY,
            "Content-Type": "application/json"
        }

        payload = {
            "prompt": prompt,
            "n": 1,
            "size": "1024x1024"
        }

        submit_resp = requests.post(endpoint, headers=headers, json=payload)
        print("🔍 Azure Submit Response:", submit_resp.status_code)
        print("🔍 Azure Response Text:", submit_resp.text)

        if submit_resp.status_code != 200:
            return jsonify({"error": "Image submission failed", "details": submit_resp.json()}), 500

        response_data = submit_resp.json()
        image_url = response_data["data"][0]["url"]

        # Save to MongoDB
        print("🧠 Received username:", username)

        result = users_collection.update_one(
            {"username": username},
            {"$push": {"images": image_url}}
        )
        print("📦 MongoDB modified count:", result.modified_count)

        print(f"✅ Returning image URL to frontend: {image_url}")
        return jsonify({"image_url": image_url}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



## Get Saved Images

@app.route("/get-images", methods=["POST"])
def get_images():
    try:
        data = request.json
        username = data.get("username")

        if not username:
            return jsonify({"error": "Username is required"}), 400

        user = users_collection.find_one({"username": username})

        if user and "images" in user:
            return jsonify({"images": user["images"]}), 200
        else:
            return jsonify({"images": []}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



## App Start

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
