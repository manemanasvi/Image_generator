const username = localStorage.getItem("username");
if (!username) {
  window.location.href = "index.html";
} else {
  document.getElementById("welcomeText").textContent = username;
}

function logout() {
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

function toggleGallery() {
  document.getElementById("gallerySection").classList.toggle("hidden");
}

function generateImage() {
  const prompt = document.getElementById("promptInput").value.trim();
  if (!prompt) return alert("Please enter a prompt!");

  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("imageContainer").classList.add("hidden");

  fetch("http://localhost:5000/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, username })
  })
    .then(res => res.json())
    .then(data => {
      if (data.image_url) {
        document.getElementById("generatedImage").src = data.image_url;
        document.getElementById("imageContainer").classList.remove("hidden");

        const gallery = document.getElementById("gallery");
        const link = document.createElement("a");
        link.href = data.image_url;
        link.target = "_blank";

        const img = document.createElement("img");
        img.src = data.image_url;
        img.alt = "Generated Image";
        img.classList.add("w-full", "h-24", "rounded-lg", "object-cover", "shadow-md");

        link.appendChild(img);
        gallery.prepend(link);
      } else {
        alert("Image generation failed!");
      }
    })
    .catch(() => alert("Something went wrong!"))
    .finally(() => {
      document.getElementById("loader").classList.add("hidden");
    });
}

// Load user's saved images on page load
fetch("http://localhost:5000/get-images", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username })
})
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById("gallery");
    if (Array.isArray(data.images)) {
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
    }
  })
  .catch(err => console.error("Gallery load error:", err));
