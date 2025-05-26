// const username = localStorage.getItem("username");
// if (!username) {
//   window.location.href = "index.html";
// } else {
//   document.getElementById("welcomeText").textContent = username;
// }

// function logout() {
//   localStorage.removeItem("username");
//   window.location.href = "index.html";
// }

// function toggleGallery() {
//   document.getElementById("gallerySection").classList.toggle("hidden");
// }

// function generateImage() {
//   const prompt = document.getElementById("promptInput").value.trim();
//   if (!prompt) return alert("Please enter a prompt!");

//   document.getElementById("loader").classList.remove("hidden");
//   document.getElementById("imageContainer").classList.add("hidden");

//   fetch("http://localhost:5000/generate-image", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ prompt, username })
//   })
//     .then(res => res.json())
//     .then(data => {
//       if (data.image_url) {
//         document.getElementById("generatedImage").src = data.image_url;
//         document.getElementById("imageContainer").classList.remove("hidden");

//         const gallery = document.getElementById("gallery");
//         const link = document.createElement("a");
//         link.href = data.image_url;
//         link.target = "_blank";

//         const img = document.createElement("img");
//         img.src = data.image_url;
//         img.alt = "Generated Image";
//         img.classList.add("w-full", "h-24", "rounded-lg", "object-cover", "shadow-md");

//         link.appendChild(img);
//         gallery.prepend(link);
//       } else {
//         alert("Image generation failed!");
//       }
//     })
//     .catch(() => alert("Something went wrong!"))
//     .finally(() => {
//       document.getElementById("loader").classList.add("hidden");
//     });
// }

// // Load user's saved images on page load
// fetch("http://localhost:5000/get-images", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ username })
// })
//   .then(res => res.json())
//   .then(data => {
//     const gallery = document.getElementById("gallery");
//     if (Array.isArray(data.images)) {
//       data.images.forEach(url => {
//         const link = document.createElement("a");
//         link.href = url;
//         link.target = "_blank";

//         const img = document.createElement("img");
//         img.src = url;
//         img.alt = "Saved Image";
//         img.classList.add("w-full", "h-24", "rounded-lg", "object-cover", "shadow-md");

//         link.appendChild(img);
//         gallery.appendChild(link);
//       });
//     }
//   })
//   .catch(err => console.error("Gallery load error:", err));

// Define your backend base URL
const BACKEND_BASE_URL = "https://image-generator-oyev.onrender.com";

// Function to display toast messages
function showToast(message, type = "error") {
    const toast = document.getElementById("imageGenToast"); // Assuming you'll add a toast element to your HTML
    if (!toast) {
        // Fallback to console log if toast element is not found
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


const username = localStorage.getItem("username");
if (!username) {
    window.location.href = "index.html"; // Redirect if no username is found
} else {
    // Ensure welcomeText element exists in your HTML
    const welcomeTextElement = document.getElementById("welcomeText");
    if (welcomeTextElement) {
        welcomeTextElement.textContent = username;
    }
}

function logout() {
    localStorage.removeItem("username");
    window.location.href = "index.html";
}

function toggleGallery() {
    document.getElementById("gallerySection").classList.toggle("hidden");
}

async function generateImage() {
    const promptInput = document.getElementById("promptInput");
    const prompt = promptInput.value.trim();

    if (!prompt) {
        showToast("❌ Please enter a prompt!");
        return;
    }

    const loader = document.getElementById("loader");
    const imageContainer = document.getElementById("imageContainer");
    const generatedImage = document.getElementById("generatedImage");

    loader.classList.remove("hidden");
    imageContainer.classList.add("hidden");
    showToast("Generating image...", "success"); // Inform user that generation is in progress

    try {
        const res = await fetch(`${BACKEND_BASE_URL}/generate-image`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, username })
        });

        const data = await res.json();

        if (res.ok && data.image_url) {
            generatedImage.src = data.image_url;
            imageContainer.classList.remove("hidden");
            showToast("✅ Image generated successfully!", "success");

            const gallery = document.getElementById("gallery");
            const link = document.createElement("a");
            link.href = data.image_url;
            link.target = "_blank"; // Open image in a new tab

            const img = document.createElement("img");
            img.src = data.image_url;
            img.alt = "Generated Image";
            img.classList.add("w-full", "h-24", "rounded-lg", "object-cover", "shadow-md");

            link.appendChild(img);
            gallery.prepend(link); // Add new image to the beginning of the gallery
        } else {
            showToast(`❌ Image generation failed: ${data.error || "Unknown error"}`, "error");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        showToast("❌ Server error during image generation! Please try again later.", "error");
    } finally {
        loader.classList.add("hidden");
    }
}

// Load user's saved images on page load
async function loadUserImages() {
    // Only attempt to load images if a username exists
    if (!username) {
        console.warn("No username found, skipping image gallery load.");
        return;
    }

    try {
        const res = await fetch(`${BACKEND_BASE_URL}/get-images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        });

        const data = await res.json();
        const gallery = document.getElementById("gallery");

        if (res.ok && Array.isArray(data.images)) {
            gallery.innerHTML = ''; // Clear existing gallery content before loading
            data.images.forEach(url => {
                const link = document.createElement("a");
                link.href = url;
                link.target = "_blank";

                const img = document.createElement("img");
                img.src = url;
                img.alt = "Saved Image";
                img.classList.add("w-full", "h-24", "rounded-lg", "object-cover", "shadow-md");

                link.appendChild(img);
                gallery.appendChild(link);
            });
        } else {
            console.error("Failed to load gallery images:", data.error || "Unknown error");
            showToast("❌ Failed to load saved images.", "error");
        }
    } catch (err) {
        console.error("Gallery load error:", err);
        showToast("❌ Error loading gallery images from server.", "error");
    }
}

// Attach event listeners after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Attach generateImage to a button click
    const generateButton = document.getElementById("generateButton"); // Assuming you have a button with this ID
    if (generateButton) {
        generateButton.addEventListener("click", generateImage);
    }

    // Attach logout to a button click
    const logoutButton = document.getElementById("logoutButton"); // Assuming you have a button with this ID
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

    // Attach toggleGallery to a button click
    const toggleGalleryButton = document.getElementById("toggleGalleryButton"); // Assuming you have a button with this ID
    if (toggleGalleryButton) {
        toggleGalleryButton.addEventListener("click", toggleGallery);
    }

    // Load user's saved images on page load
    loadUserImages();
});
