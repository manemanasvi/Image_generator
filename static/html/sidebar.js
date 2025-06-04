document.addEventListener("DOMContentLoaded", () => {
  const includeSidebar = document.getElementById("include-sidebar");

  fetch("sidebar.html")
    .then(res => res.text())
    .then(html => {
      includeSidebar.innerHTML = html;

      // Highlight current page
      const current = window.location.pathname.split("/").pop();
      document.querySelectorAll(".menu-link").forEach(link => {
        if (link.getAttribute("href") === current) {
          link.classList.add("bg-indigo-200", "font-semibold");
        }
      });

      // Logout function
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.removeItem("jwt");
          localStorage.removeItem("username");
          window.location.href = "index.html";
        });
      }
    });
});
