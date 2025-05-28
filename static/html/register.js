// document.getElementById("registerForm").addEventListener("submit", async function (e) {
//   e.preventDefault();

//   const username = document.getElementById("username").value.trim();
//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value;
//   const confirmPassword = document.getElementById("confirmPassword").value;
//   const toast = document.getElementById("registerToast");

//   toast.classList.remove("hidden", "text-green-400", "text-red-500");

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
//     const res = await fetch("http://localhost:5000/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, email, password })
//     });

//     const data = await res.json();

//     if (res.status === 201) {
//       toast.textContent = "✅ Registered successfully! Redirecting...";
//       toast.classList.add("text-green-400");
//       setTimeout(() => window.location.href = "index.html", 1500);
//     } else {
//       toast.textContent = `❌ ${data.error || "Registration failed"}`;
//       toast.classList.add("text-red-500");
//     }
//   } catch (error) {
//     toast.textContent = "❌ Server error!";
//     toast.classList.add("text-red-500");
//   }
// });

// Define your backend base URL
// It's good practice to define this as a constant at the top of your file
// or even better, as a global configuration variable if you have many API calls.
const BACKEND_BASE_URL = "https://image-generator-wc8p.onrender.com";

document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const toast = document.getElementById("registerToast");

  // Reset toast classes before showing new message
  toast.classList.remove("hidden", "text-green-400", "text-red-500");
  toast.classList.add("block"); // Ensure toast is visible

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
    // Update the fetch URL to use the deployed Render backend
    const res = await fetch(`${BACKEND_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password,confirmPassword })
    });

    const data = await res.json();

    if (res.status === 201) {
      toast.textContent = "✅ Registered successfully! Redirecting...";
      toast.classList.add("text-green-400");
      // Redirect after a short delay to allow user to read the message
      setTimeout(() => window.location.href = "index.html", 1500);
    } else {
      // Display error message from the backend, or a generic one
      toast.textContent = `❌ ${data.error || "Registration failed"}`;
      toast.classList.add("text-red-500");
    }
  } catch (error) {
    console.error("Network or fetch error during registration:", error);
    toast.textContent = "❌ Server error! Please try again later.";
    toast.classList.add("text-red-500");
  }
});
