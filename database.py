from pymongo import MongoClient

# 🔹 MongoDB Connection URI (adjust if using MongoDB Atlas)
MONGO_URI = "mongodb://localhost:27017"  # Use your MongoDB URI here

# 🔹 Connect to MongoDB
client = MongoClient(MONGO_URI)

# 🔹 Select Database
db = client["image_generator_db"]  # You can name this however you like

# 🔹 Select Collections
users_collection = db["users"]  # Collection for storing user credentials
