# from pymongo import MongoClient

# # 🔹 MongoDB Connection URI (adjust if using MongoDB Atlas)
# MONGO_URI = "mongodb://localhost:27017"  # Use your MongoDB URI here

# # 🔹 Connect to MongoDB
# client = MongoClient(MONGO_URI)

# # 🔹 Select Database
# db = client["image_generator_db"]  # You can name this however you like

# # 🔹 Select Collections
# users_collection = db["users"]  # Collection for storing user credentials

# database.py
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file (for local development)

# Get the MongoDB connection URI from environment variables
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("No MONGO_URI found in environment variables. Please set it.")

# Establish the MongoDB client connection
client = MongoClient(MONGO_URI)

# Specify the database name.
# You can get this from an env var, or it might be part of your MONGO_URI.
# If your MONGO_URI includes the database name (e.g., /image_generator_db?),
# pymongo will automatically connect to that database.
# If not, or if you want to explicitly set it, you can use:
db_name = os.getenv("MONGO_DB_NAME", "image_generator_db") # 'image_generator_db' is a default
db = client[db_name] # Selects or implicitly creates the database

# Define your collection(s)
users_collection = db["users"]
# You might have other collections, e.g.,
# images_collection = db["images"]