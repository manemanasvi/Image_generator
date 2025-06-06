// document.addEventListener("DOMContentLoaded", () => {
//   const includeSidebar = document.getElementById("include-sidebar");

//   fetch("sidebar.html")
//     .then(res => res.text())
//     .then(html => {
//       includeSidebar.innerHTML = html;

//       // Highlight current page
//       const current = window.location.pathname.split("/").pop();
//       document.querySelectorAll(".menu-link").forEach(link => {
//         if (link.getAttribute("href") === current) {
//           link.classList.add("bg-indigo-200", "font-semibold");
//         }
//       });

//       // Logout function
//       const logoutBtn = document.getElementById("logoutBtn");
//       if (logoutBtn) {
//         logoutBtn.addEventListener("click", () => {
//           localStorage.removeItem("jwt");
//           localStorage.removeItem("username");
//           window.location.href = "index.html";
//         });
//       }
//     });
// });

// sidebar.js
document.addEventListener("DOMContentLoaded", () => {
  const sidebarPlaceholder = document.getElementById("include-sidebar");
  if (!sidebarPlaceholder) return;

  fetch("sidebar.html")
    .then(res => {
      if (!res.ok) throw new Error(`Could not load sidebar.html: ${res.statusText}`);
      return res.text();
    })
    .then(html => {
      sidebarPlaceholder.innerHTML = html;

      // Highlight the current page link
      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      document.querySelectorAll(".menu-link").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
          link.classList.add("active");
        }
      });
      
      // Populate user info from localStorage
      const username = localStorage.getItem("username") || "Guest";
      const sidebarUsernameEl = document.getElementById("sidebarUsername");
      const userAvatarEl = document.getElementById("userAvatar");

      if(sidebarUsernameEl) sidebarUsernameEl.textContent = username;
      // Use a service like vercel's avatar generator for dynamic, simple avatars
      if(userAvatarEl) userAvatarEl.src = `https://avatar.vercel.sh/${username}.png`;

      // Set up the logout functionality
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.removeItem("jwt");
          localStorage.removeItem("username");
          window.location.href = "index.html";
        });
      }
    })
    .catch(error => {
      console.error("Sidebar Error:", error);
      sidebarPlaceholder.innerHTML = "<p class='text-red-500 p-4'>Error: Sidebar could not be loaded.</p>";
    });
});
