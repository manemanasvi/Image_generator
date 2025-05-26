# # from pymongo import MongoClient

# # # 🔹 MongoDB Connection URI (adjust if using MongoDB Atlas)
# # MONGO_URI = "mongodb://localhost:27017"  # Use your MongoDB URI here

# # # 🔹 Connect to MongoDB
# # client = MongoClient(MONGO_URI)

# # # 🔹 Select Database
# # db = client["image_generator_db"]  # You can name this however you like

# # # 🔹 Select Collections
# # users_collection = db["users"]  # Collection for storing user credentials

# # database.py
# import os
# from pymongo import MongoClient
# from dotenv import load_dotenv

# load_dotenv() # Load environment variables from .env file (for local development)

# # Get the MongoDB connection URI from environment variables
# MONGO_URI = os.getenv("MONGO_URI")
# print(MONGO_URI)

# try:
#     if not MONGO_URI:
#     raise ValueError("No MONGO_URI found in environment variables. Please set it.")

# # Establish the MongoDB client connection
# client = MongoClient(MONGO_URI)

# # Specify the database name.
# # You can get this from an env var, or it might be part of your MONGO_URI.
# # If your MONGO_URI includes the database name (e.g., /image_generator_db?),
# # pymongo will automatically connect to that database.
# # If not, or if you want to explicitly set it, you can use:
# db_name = os.getenv("MONGO_DB_NAME", "image_generator_db") # 'image_generator_db' is a default
# db = client[db_name] # Selects or implicitly creates the database

# # Define your collection(s)
# users_collection = db["users"]
# # You might have other collections, e.g.,
# # images_collection = db["images"]

import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file (for local development)

# Get the MongoDB connection URI from environment variables
MONGO_URI = os.getenv("MONGO_URI")
# print(MONGO_URI) # Uncomment for debugging if you want to see the URI

client = None # Initialize client to None
db = None
users_collection = None

try:
    if not MONGO_URI:
        raise ValueError("No MONGO_URI found in environment variables. Please set it.")

    # Establish the MongoDB client connection
    # The connectTimeoutMS and serverSelectionTimeoutMS are good for handling connection issues
    client = MongoClient(MONGO_URI, connectTimeoutMS=5000, serverSelectionTimeoutMS=5000)

    # The ping command is a quick way to check if the connection is successful
    # It will raise an exception if the connection fails
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")

    # Specify the database name.
    # You can get this from an env var, or it might be part of your MONGO_URI.
    # If your MONGO_URI includes the database name (e.g., /image_generator_db?),
    # pymongo will automatically connect to that database.
    # If not, or if you want to explicitly set it, you can use:
    db_name = os.getenv("MONGO_DB_NAME", "image_generator_db") # 'image_generator_db' is a default
    db = client[db_name] # Selects or implicitly creates the database
    print(f"Connected to database: {db_name}")

    # Define your collection(s)
    users_collection = db["users"]
    # You might have other collections, e.g.,
    # images_collection = db["images"]

except ConnectionFailure as e:
    print(f"MongoDB Connection Error: Could not connect to MongoDB server. Please check your MONGO_URI and network settings. Details: {e}")
except OperationFailure as e:
    print(f"MongoDB Operation Error: An operation failed, possibly due to authentication or authorization issues. Details: {e}")
except ValueError as e:
    print(f"Configuration Error: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
finally:
    # It's good practice to close the client connection when your application exits
    # or when you're done with it, especially in short-lived scripts.
    # For long-running applications (like web servers), you might keep it open.
    # if client:
    #     client.close()
    #     print("MongoDB client connection closed.")
    pass # In a long-running application, you typically don't close the client here.
         # It's managed by the application lifecycle.
