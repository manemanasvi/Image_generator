from pymongo import MongoClient

# Connect to MongoDB (Ensure MongoDB is running locally or provide a remote URI)
client = MongoClient("mongodb://localhost:27017/")

# Create or connect to the database
db = client["image_generator"]

# Define collections
users_collection = db["users"]
generated_images_collection = db["generated_images"]

# Function to insert a user (example function)
def insert_user(username, email, password, role):
    user_data = {
        "username": username,
        "email": email,
        "password": password,  # In a real app, hash this password
        "role": role
    }
    users_collection.insert_one(user_data)

# Function to get all users
def get_all_users():
    return list(users_collection.find({}, {"_id": 0}))  # Exclude MongoDB _id field

if __name__ == "__main__":
    # Example: Insert a user
    insert_user("test_user", "test@example.com", "test123", "user")
    print("User added successfully!")

