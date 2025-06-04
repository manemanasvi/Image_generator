const BACKEND_BASE_URL = window.env.BACKEND_BASE_URL;

window.addEventListener("DOMContentLoaded", async () => {
  const gallery = document.getElementById("galleryContainer");
  const token = localStorage.getItem("jwt");
  const username = localStorage.getItem("username");

  if (!token || !username) {
    alert("Please login first.");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/get-images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ username })
    });

    const data = await res.json();

    if (res.ok && Array.isArray(data.images) && data.images.length > 0) {
      data.images.forEach((url, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "relative group";

        const img = document.createElement("img");
        img.src = url;
        img.alt = `Generated Image ${index + 1}`;
        img.className = "w-full h-48 object-cover rounded shadow-lg";

        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "⬇ Download";
        downloadBtn.className = "absolute bottom-2 left-2 text-sm bg-white/80 px-3 py-1 rounded shadow hidden group-hover:block";

        downloadBtn.onclick = async () => {
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
        gallery.appendChild(wrapper);
      });
    } else {
      gallery.innerHTML = `<p class='text-gray-500'>No images found.</p>`;
    }
  } catch (err) {
    console.error("Error fetching images:", err);
    gallery.innerHTML = `<p class='text-red-500'>Failed to load images.</p>`;
  }
});
