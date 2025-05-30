
// const BACKEND_BASE_URL = "https://image-generator-wc8p.onrender.com";

// document.getElementById("registerForm").addEventListener("submit", async function (e) {
//   e.preventDefault();

//   const username = document.getElementById("username").value.trim();
//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value;
//   const confirmPassword = document.getElementById("confirmPassword").value;
//   const toast = document.getElementById("registerToast");

//   // Reset toast classes before showing new message
//   toast.classList.remove("hidden", "text-green-400", "text-red-500");
//   toast.classList.add("block"); // Ensure toast is visible

//   if (!username || !email || !password || !confirmPassword) {
//     toast.textContent = "❌ Missing fields!";
//     toast.classList.add("text-red-500");
//     return;
//   }

//   if (password !== confirmPassword) {
//     toast.textContent = "❌ Passwords do not match!";
//     toast.classList.add("text-red-500");
//     return;
//   }

//   try {
//     // Update the fetch URL to use the deployed Render backend
//     const res = await fetch(`${BACKEND_BASE_URL}/register`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, email, password,confirmPassword })
//     });

//     const data = await res.json();

//     if (res.status === 201) {
//       toast.textContent = "✅ Registered successfully! Redirecting...";
//       toast.classList.add("text-green-400");
//       // Redirect after a short delay to allow user to read the message
//       setTimeout(() => window.location.href = "index.html", 1500);
//     } else {
//       // Display error message from the backend, or a generic one
//       toast.textContent = `❌ ${data.error || "Registration failed"}`;
//       toast.classList.add("text-red-500");
//     }
//   } catch (error) {
//     console.error("Network or fetch error during registration:", error);
//     toast.textContent = "❌ Server error! Please try again later.";
//     toast.classList.add("text-red-500");
//   }
// });

const BACKEND_BASE_URL = "https://image-generator-wc8p.onrender.com";

document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const toast = document.getElementById("registerToast");
  const registerBtn = document.getElementById("registerBtn");
  const loader = document.getElementById("loader");

  toast.classList.remove("hidden", "text-green-400", "text-red-500");
  toast.classList.add("block");
  toast.textContent = "";

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

  // Show loader, hide register button
  registerBtn.classList.add("hidden");
  loader.classList.remove("hidden");

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (res.status === 201) {
      toast.textContent = "✅ Registered successfully! Redirecting...";
      toast.classList.add("text-green-400");
      loader.classList.add("hidden");
      setTimeout(() => window.location.href = "index.html", 1000);
    } else {
      toast.textContent = `❌ ${data.error || "Registration failed"}`;
      toast.classList.add("text-red-500");
      registerBtn.classList.remove("hidden");
      loader.classList.add("hidden");
    }
  } catch (error) {
    console.error("Network or fetch error during registration:", error);
    toast.textContent = "❌ Server error! Please try again later.";
    toast.classList.add("text-red-500");
    registerBtn.classList.remove("hidden");
    loader.classList.add("hidden");
  }
});

// ✅ Password visibility toggle with SVG eye/eye-slash
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
