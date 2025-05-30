document.addEventListener("DOMContentLoaded", () => {
  const includeSidebar = document.getElementById("include-sidebar");

  fetch("sidebar.html") // ⬅️ Adjust path based on your structure
    .then(res => res.text())
    .then(html => {
      includeSidebar.innerHTML = html;

      // Highlight active page
      const current = window.location.pathname.split("/").pop();
      document.querySelectorAll(".menu-link").forEach(link => {
        if (link.getAttribute("href") === current) {
          link.classList.add("bg-indigo-200", "font-semibold");
        }
      });

      // Logout functionality
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.clear();
          window.location.href = "index.html";
        });
      }
    });
});
