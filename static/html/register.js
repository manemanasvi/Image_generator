document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const toast = document.getElementById("registerToast");

  toast.classList.remove("hidden", "text-green-400", "text-red-500");

  if (!username || !email || !password || !confirmPassword) {
    toast.textContent = "❌ Missing fields!";
    toast.classList.add("text-red-500");
    return;
  }

  if (password !== confirmPassword) {
    toast.textContent = "❌ Passwords do not match!";
    toast.classList.add("text-red-500");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (res.status === 201) {
      toast.textContent = "✅ Registered successfully! Redirecting...";
      toast.classList.add("text-green-400");
      setTimeout(() => window.location.href = "index.html", 1500);
    } else {
      toast.textContent = `❌ ${data.error || "Registration failed"}`;
      toast.classList.add("text-red-500");
    }
  } catch (error) {
    toast.textContent = "❌ Server error!";
    toast.classList.add("text-red-500");
  }
});
