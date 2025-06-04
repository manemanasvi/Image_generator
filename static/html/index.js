// ✅ auth.js (Login logic with JWT and Username storage)
const BACKEND_BASE_URL = window.env.BACKEND_BASE_URL;


document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const toast = document.getElementById("loginToast");
  const loginBtn = document.getElementById("loginBtn");
  const loader = document.getElementById("loader");

  toast.classList.remove("hidden", "text-green-400", "text-red-500");
  toast.classList.add("block");
  toast.textContent = "";

  if (!email || !password) {
    toast.textContent = "❌ Email and password are required!";
    toast.classList.add("text-red-500");
    return;
  }

  loginBtn.classList.add("hidden");
  loader.classList.remove("hidden");

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.status === 200) {
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("username", data.username);
      toast.textContent = "✅ Login successful! Redirecting...";
      toast.classList.add("text-green-400");
      setTimeout(() => window.location.href = "dashboard.html", 1000);
    } else {
      toast.textContent = `❌ ${data.error || "Login failed!"}`;
      toast.classList.add("text-red-500");
    }
  } catch (err) {
    toast.textContent = "❌ Server error!";
    toast.classList.add("text-red-500");
  } finally {
    loginBtn.classList.remove("hidden");
    loader.classList.add("hidden");
  }
});

function togglePassword(fieldId, btn) {
  const input = document.getElementById(fieldId);
  const icon = btn.querySelector("svg");

  if (input.type === "password") {
    input.type = "text";
    icon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M13.875 18.825A10.05 10.05 0 0112 19
        c-4.478 0-8.27-2.943-9.542-7
        a9.985 9.985 0 013.113-4.412m3.563-1.746A9.956 9.956 0 0112 5
        c4.478 0 8.27 2.943 9.542 7
        a9.96 9.96 0 01-4.143 5.143M15 12
        a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M3 3l18 18" />
    `;
  } else {
    input.type = "password";
    icon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5
        c4.477 0 8.268 2.943 9.542 7
        -1.274 4.057-5.065 7-9.542 7
        -4.477 0-8.268-2.943-9.542-7z" />
    `;
  }
} 
