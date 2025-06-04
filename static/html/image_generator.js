const BACKEND_BASE_URL = window.env.BACKEND_BASE_URL;

async function generateImage() {
  const prompt = document.getElementById("promptInput").value.trim();
  const loader = document.getElementById("loader");
  const imageContainer = document.getElementById("imageContainer");
  const generatedImage = document.getElementById("generatedImage");
  const token = localStorage.getItem("jwt");
  const username = localStorage.getItem("username"); // ✅ important for storing image

  if (!prompt || !token || !username) {
    alert("Please enter a prompt or login first.");
    return;
  }

  loader.classList.remove("hidden");
  imageContainer.classList.add("hidden");

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ prompt, username }) // ✅ send username
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      generatedImage.src = data.image_url;
      imageContainer.classList.remove("hidden");
    } else {
      alert(data.error || "Image generation failed.");
    }
  } catch (err) {
    alert("Server error. Please try again.");
  } finally {
    loader.classList.add("hidden");
  }
}
