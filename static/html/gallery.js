// gallery.js

window.addEventListener("DOMContentLoaded", async () => {
    // Set Username Greeting in the header
    const username = localStorage.getItem("username") || "User";
    const greetingEl = document.getElementById("username-greeting");
    if (greetingEl) {
        greetingEl.textContent = username;
    }

    const galleryContainer = document.getElementById("galleryContainer");
    const token = localStorage.getItem("jwt");

    // Check if user is logged in
    if (!token || !username) {
        galleryContainer.innerHTML = `<p class="col-span-full text-center text-slate-500 dark:text-slate-400">Please log in to view your gallery.</p>`;
        return;
    }

    // Display a loading message while fetching images
    galleryContainer.innerHTML = `<p class="col-span-full text-center text-slate-500 dark:text-slate-400">Loading your masterpieces...</p>`;

    try {
        const BACKEND_BASE_URL = window.env.BACKEND_BASE_URL;
        const res = await fetch(`${BACKEND_BASE_URL}/get-images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ username })
        });

        const data = await res.json();

        // Clear the loading message
        galleryContainer.innerHTML = '';

        if (res.ok && Array.isArray(data.images) && data.images.length > 0) {
            // If images are found, create and append them to the gallery
            data.images.forEach((url, index) => {
                const wrapper = document.createElement("div");
                wrapper.className = "relative group aspect-square";

                const img = document.createElement("img");
                img.src = url;
                img.alt = `Generated Image ${index + 1}`;
                img.className = "w-full h-full object-cover rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 transition-transform group-hover:scale-105";

                const downloadBtn = document.createElement("button");
                downloadBtn.innerHTML = `
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download
                `;
                downloadBtn.className = "absolute bottom-2 left-2 text-xs font-semibold bg-white/80 dark:bg-slate-900/70 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-full shadow-md hidden group-hover:flex items-center backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100";

                downloadBtn.onclick = async (e) => {
                    e.stopPropagation(); // Prevent any other click events
                    try {
                        const imageBlob = await fetch(url).then(r => r.blob());
                        const blobUrl = URL.createObjectURL(imageBlob);

                        const tempLink = document.createElement("a");
                        tempLink.href = blobUrl;
                        tempLink.download = `xgen_image_${index + 1}.png`;
                        
                        document.body.appendChild(tempLink);
                        tempLink.click();
                        document.body.removeChild(tempLink);

                        URL.revokeObjectURL(blobUrl);
                    } catch (err) {
                        console.error("Download failed:", err);
                        alert("Failed to download image.");
                    }
                };

                wrapper.appendChild(img);
                wrapper.appendChild(downloadBtn);
                galleryContainer.appendChild(wrapper);
            });
        } else {
            // Display a message if the gallery is empty
            galleryContainer.innerHTML = `<p class="col-span-full text-center text-slate-500 dark:text-slate-400">Your gallery is empty. Go generate some images!</p>`;
        }
    } catch (err) {
        console.error("Error fetching images:", err);
        // Display an error message if the fetch fails
        galleryContainer.innerHTML = `<p class="col-span-full text-center text-red-500">Failed to load your images. Please try again later.</p>`;
    }
});