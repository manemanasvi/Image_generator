// image_generator.js

document.addEventListener('DOMContentLoaded', () => {
    // --- ✅ NEW: Set Username Greeting ---
    const username = localStorage.getItem("username") || "User";
    const greetingEl = document.getElementById("username-greeting");
    if (greetingEl) {
        greetingEl.textContent = username;
    }
    // ------------------------------------

    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateImage);
    }
});


async function generateImage() {
    // This entire function remains the same as the previous version
    const promptInput = document.getElementById("promptInput");
    const loader = document.getElementById("loader");
    const imageContainer = document.getElementById("imageContainer");
    const generatedImage = document.getElementById("generatedImage");
    const outputPlaceholder = document.getElementById("outputPlaceholder");
    const generateBtn = document.getElementById('generateBtn');

    const prompt = promptInput.value.trim();
    const token = localStorage.getItem("jwt");
    const loggedInUsername = localStorage.getItem("username"); // Use a different variable name to avoid conflict

    if (!prompt) {
        alert("Please enter a prompt.");
        return;
    }
    if (!token || !loggedInUsername) {
        alert("You must be logged in to generate images.");
        return;
    }

    generateBtn.disabled = true;
    generateBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating...
    `;
    loader.classList.remove("hidden");
    loader.classList.add("flex");
    imageContainer.classList.add("hidden");
    outputPlaceholder.classList.add("hidden");

    try {
        const BACKEND_BASE_URL = window.env.BACKEND_BASE_URL;
        const res = await fetch(`${BACKEND_BASE_URL}/generate-image`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ prompt, username: loggedInUsername })
        });
        const data = await res.json();
        if (res.ok) {
            generatedImage.src = data.image_url;
            imageContainer.classList.remove("hidden");
        } else {
            alert(data.error || "Image generation failed.");
            outputPlaceholder.classList.remove("hidden");
        }
    } catch (err) {
        alert("A server error occurred. Please try again later.");
        outputPlaceholder.classList.remove("hidden");
    } finally {
        loader.classList.add("hidden");
        loader.classList.remove("flex");
        generateBtn.disabled = false;
        generateBtn.innerHTML = '✨ Generate Image';
    }
}