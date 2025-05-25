document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const toast = document.getElementById("loginToast");

  toast.classList.remove("hidden", "text-green-400", "text-red-500");

  fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.username) {
  localStorage.setItem("username", data.username);  // ✅ Store name
  toast.textContent = "✅ Login successful! Redirecting...";
  toast.classList.add("text-green-400");
  setTimeout(() => {
    window.location.href = "image_generator.html";
  }, 1500);
}
 else {
        toast.textContent = "❌ " + (data.error || "Password or email is invalid");
        toast.classList.add("text-red-500");
      }
    })
    .catch(() => {
      toast.textContent = "❌ Server error!";
      toast.classList.add("text-red-500");
    });
});
