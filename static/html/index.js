// document.getElementById("loginForm").addEventListener("submit", function (e) {
//   e.preventDefault();
//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value;
//   const toast = document.getElementById("loginToast");

//   toast.classList.remove("hidden", "text-green-400", "text-red-500");

//   fetch("http://localhost:5000/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   })
//     .then(res => res.json())
//     .then(data => {
//       if (data.username) {
//   localStorage.setItem("username", data.username);  // ✅ Store name
//   toast.textContent = "✅ Login successful! Redirecting...";
//   toast.classList.add("text-green-400");
//   setTimeout(() => {
//     window.location.href = "image_generator.html";
//   }, 1500);
// }
//  else {
//         toast.textContent = "❌ " + (data.error || "Password or email is invalid");
//         toast.classList.add("text-red-500");
//       }
//     })
//     .catch(() => {
//       toast.textContent = "❌ Server error!";
//       toast.classList.add("text-red-500");
//     });
// });

// Define your backend base URL
// It's good practice to define this as a constant at the top of your file
// or even better, as a global configuration variable if you have many API calls.
const BACKEND_BASE_URL = "https://image-generator-oyev.onrender.com";

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const toast = document.getElementById("loginToast");

  // Reset toast classes before showing new message
  toast.classList.remove("hidden", "text-green-400", "text-red-500");
  toast.classList.add("block"); // Ensure toast is visible

  // Check for empty fields
  if (!email || !password) {
    toast.textContent = "❌ Missing email or password!";
    toast.classList.add("text-red-500");
    return;
  }

  // Update the fetch URL to use the deployed Render backend
  fetch(`${BACKEND_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then(res => {
      // Check if response is OK (status 2xx)
      if (!res.ok) {
        // If not OK, parse error message and throw to catch block
        return res.json().then(errorData => {
          throw new Error(errorData.error || "Login failed");
        });
      }
      return res.json();
    })
    .then(data => {
      if (data.username) {
        localStorage.setItem("username", data.username); // ✅ Store name
        toast.textContent = "✅ Login successful! Redirecting...";
        toast.classList.add("text-green-400");
        setTimeout(() => {
          window.location.href = "image_generator.html";
        }, 1500);
      } else {
        // This 'else' might be redundant if !res.ok handles all errors
        // but kept for robustness if backend sends 200 with an error field
        toast.textContent = "❌ " + (data.error || "Password or email is invalid");
        toast.classList.add("text-red-500");
      }
    })
    .catch(error => {
      console.error("Network or fetch error during login:", error);
      toast.textContent = `❌ ${error.message || "Server error! Please try again later."}`;
      toast.classList.add("text-red-500");
    });
});
