// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Set Welcome Message ---
    const username = localStorage.getItem("username") || "User";
    const welcomeUserEl = document.getElementById("welcomeUser");
    if(welcomeUserEl) {
        welcomeUserEl.textContent = username;
    }

    // --- 1. Live Clock Widget ---
    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');
    
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const dateString = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        if(timeEl) timeEl.textContent = timeString;
        if(dateEl) dateEl.textContent = dateString;
    }
    
    updateClock(); 
    setInterval(updateClock, 1000); 

    // --- 2. Quote of the Day Widget ---
    const quotes = [
        "The only way to do great work is to love what you do.",
        "Creativity is intelligence having fun.",
        "You can’t use up creativity. The more you use, the more you have.",
        "The chief enemy of creativity is good sense.",
        "Every artist was first an amateur."
    ];
    const quoteEl = document.getElementById('quote');

    if(quoteEl) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteEl.textContent = `"${quotes[randomIndex]}"`;
    }
    
    // --- 3. Quick Notes Widget ---
    const notesArea = document.getElementById('notes-area');

    if(notesArea) {
        notesArea.value = localStorage.getItem('dashboard-notes') || '';
        
        notesArea.addEventListener('input', () => {
            localStorage.setItem('dashboard-notes', notesArea.value);
        });
    }
});