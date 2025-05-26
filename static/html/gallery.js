// const username = localStorage.getItem("username");
// if (!username) {
//   window.location.href = "index.html";
// }

// fetch("http://localhost:5000/get-images", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ username })
// })
//   .then(res => res.json())
//   .then(data => {
//     const galleryContainer = document.getElementById("galleryContainer");

//     if (Array.isArray(data.images)) {
//       data.images.forEach((url, index) => {
//         const card = document.createElement("div");
//         card.className = "bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 gallery-card";

//         const img = document.createElement("img");
//         img.src = url;
//         img.alt = `Generated Image ${index + 1}`;
//         img.className = "w-full h-48 object-cover cursor-pointer";
//         img.onclick = () => window.open(url, '_blank');

//         const downloadBtn = document.createElement("a");
//         downloadBtn.href = "#";
//         downloadBtn.className = "block text-center w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold cursor-pointer";
//         downloadBtn.textContent = "⬇ Download";
//         downloadBtn.onclick = (e) => {
//           e.preventDefault();
//           fetch(url)
//             .then(res => res.blob())
//             .then(blob => {
//               const link = document.createElement("a");
//               link.href = URL.createObjectURL(blob);
//               link.download = `image_${index + 1}.png`;
//               document.body.appendChild(link);
//               link.click();
//               document.body.removeChild(link);
//             });
//         };

//         card.appendChild(img);
//         card.appendChild(downloadBtn);
//         galleryContainer.appendChild(card);
//       });
//     }
//   })
//   .catch(err => console.error("Error loading gallery:", err)); 
// Define your backend base URL
const BACKEND_BASE_URL = "https://image-generator-oyev.onrender.com"; // <-- THIS IS THE KEY CHANGE

// Function to display toast messages (assuming a toast element with this ID in gallery.html)
function showToast(message, type = "error") {
    const toast = document.getElementById("galleryToast");
    if (!toast) {
        console.error("Toast element not found. Message:", message);
        return;
    }

    toast.classList.remove("hidden", "text-green-400", "text-red-500");
    toast.classList.add("block"); // Ensure toast is visible

    if (type === "success") {
        toast.classList.add("text-green-400");
    } else { // Default to error
        toast.classList.add("text-red-500");
    }
    toast.textContent = message;

    // Hide toast after a few seconds
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}

// Function to load and display images
async function loadGalleryImages() {
    const username = localStorage.getItem("username");

    if (!username) {
        window.location.href = "index.html"; // Redirect if user not logged in
        return;
    }

    const galleryContainer = document.getElementById("galleryContainer");
    if (!galleryContainer) {
        console.error("Gallery container element not found!");
        showToast("Error: Gallery container missing.", "error");
        return;
    }

    // Clear previous images and show loading message
    galleryContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full" id="loadingMessage">Loading images...</p>';
    showToast("Loading your images...", "success");

    try {
        // Use the Render backend URL here
        const res = await fetch(`${BACKEND_BASE_URL}/get-images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        });

        const data = await res.json();

        // Remove loading message
        const loadingMessage = document.getElementById("loadingMessage");
        if (loadingMessage) loadingMessage.remove();

        if (res.ok && Array.isArray(data.images)) {
            if (data.images.length === 0) {
                galleryContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full">No images found in your gallery. Generate some!</p>';
                showToast("No images in gallery.", "info");
            } else {
                data.images.forEach((url, index) => {
                    const card = document.createElement("div");
                    card.className = "bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 gallery-card";

                    const img = document.createElement("img");
                    img.src = url;
                    img.alt = `Generated Image ${index + 1}`;
                    img.className = "w-full h-48 object-cover cursor-pointer";
                    img.onclick = () => window.open(url, '_blank');

                    const downloadBtn = document.createElement("a");
                    downloadBtn.href = "#";
                    downloadBtn.className = "block text-center w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold cursor-pointer";
                    downloadBtn.textContent = "⬇ Download";
                    downloadBtn.onclick = async (e) => {
                        e.preventDefault();
                        try {
                            const imageRes = await fetch(url);
                            if (!imageRes.ok) throw new Error('Failed to fetch image for download.');
                            const blob = await imageRes.blob();
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.download = `image_${new Date().getTime()}.png`; // Unique filename
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(link.href); // Clean up the object URL
                            showToast("✅ Image downloaded!", "success");
                        } catch (downloadError) {
                            console.error("Download error:", downloadError);
                            showToast("❌ Failed to download image.", "error");
                        }
                    };

                    card.appendChild(img);
                    card.appendChild(downloadBtn);
                    galleryContainer.appendChild(card);
                });
                showToast("✅ Gallery loaded successfully!", "success");
            }
        } else {
            console.error("Failed to load gallery images:", data.error || "Unknown error");
            showToast("❌ Failed to load saved images: " + (data.error || "Server error."), "error");
        }
    } catch (err) {
        console.error("Gallery load error:", err);
        showToast("❌ Error connecting to server to load gallery images.", "error");
    }
}

// Call loadGalleryImages when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadGalleryImages);

// IMPORTANT: Do NOT include logout functionality here as per your request.
// If you have a logout button in gallery.html, it should navigate directly
// or be handled by a script that's common across pages, if necessary.

