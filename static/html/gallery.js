const username = localStorage.getItem("username");
if (!username) {
  window.location.href = "index.html";
}

fetch("http://localhost:5000/get-images", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username })
})
  .then(res => res.json())
  .then(data => {
    const galleryContainer = document.getElementById("galleryContainer");

    if (Array.isArray(data.images)) {
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
        downloadBtn.onclick = (e) => {
          e.preventDefault();
          fetch(url)
            .then(res => res.blob())
            .then(blob => {
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = `image_${index + 1}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });
        };

        card.appendChild(img);
        card.appendChild(downloadBtn);
        galleryContainer.appendChild(card);
      });
    }
  })
  .catch(err => console.error("Error loading gallery:", err));
