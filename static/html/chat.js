// chat.js
const BACKEND_BASE_URL = window.env.BACKEND_BASE_URL;

document.addEventListener("DOMContentLoaded", () => {
    // --- Get all necessary elements from the page ---
    const greetingEl = document.getElementById("username-greeting");
    const chatForm = document.getElementById("chatForm");
    const messageInput = document.getElementById("messageInput");
    const messagesContainer = document.getElementById("messages");
    const voiceBtn = document.getElementById("voiceBtn");
    const loader = document.getElementById("loader");
    const newChatBtn = document.getElementById("newChatBtn"); // Get the new button

    // --- Setup initial state when the page loads ---
    const username = localStorage.getItem("username") || "User";
    if (greetingEl) {
        greetingEl.textContent = username;
    }
    
    loadChatHistory();

    // --- Setup Event Listeners ---
    chatForm.addEventListener("submit", handleChatSubmit);
    
    // ✅ Listen for a click on the "New Chat" button
    if(newChatBtn) {
        newChatBtn.addEventListener("click", startNewChat);
    }

    // --- Main Functions ---

    // Handles the entire process when a user sends a message
    async function handleChatSubmit(e) {
        e.preventDefault();
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;

        addMessage("user", userMessage);
        messageInput.value = "";
        
        loader.classList.remove("hidden");
        const botResponse = await getBotResponse(userMessage);
        loader.classList.add("hidden");

        const botBubble = addMessage("bot", ""); // Create an empty bubble for the typing effect
        await simulateTyping(botBubble, botResponse);

        saveChatHistory();
    }

    // ✅ This function clears the chat and starts a fresh conversation
    function startNewChat() {
        messagesContainer.innerHTML = ''; // Clear messages from the screen
        localStorage.removeItem('chatHistory'); // Clear saved history from browser memory
        addMessage("bot", "Hello! How can I help you today?"); // Add a fresh welcome message
    }

    // Creates and adds a message bubble to the chat window
    function addMessage(sender, text) {
        const msgWrapper = document.createElement("div");
        msgWrapper.className = `w-full flex ${sender === "user" ? "justify-end" : "justify-start"}`;

        const msgBubble = document.createElement("div");
        // These styles have dark mode support
        const userStyles = "bg-indigo-500 text-white";
        const botStyles = "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200";
        
        msgBubble.className = `p-3 rounded-xl shadow max-w-[75%] whitespace-pre-wrap ${sender === "user" ? userStyles : botStyles}`;
        msgBubble.textContent = text;
        
        msgWrapper.appendChild(msgBubble);
        messagesContainer.appendChild(msgWrapper);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll to the bottom
        return msgBubble;
    }

    // Fetches a response from the back-end chatbot API
    async function getBotResponse(userMessage) {
        try {
            const res = await fetch(`${BACKEND_BASE_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });
            const data = await res.json();
            return data?.reply?.trim() || "Sorry, I couldn't get a response.";
        } catch {
            return "Error: Could not connect to the chatbot service.";
        }
    }

    // Simulates a typing effect for the bot's response
    async function simulateTyping(element, text, delay = 20) {
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            await new Promise((res) => setTimeout(res, delay));
        }
    }

    // --- Chat History Functions ---
    function saveChatHistory() {
        localStorage.setItem("chatHistory", messagesContainer.innerHTML);
    }

    function loadChatHistory() {
        const saved = localStorage.getItem("chatHistory");
        if (saved) {
            messagesContainer.innerHTML = saved;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } else {
            // If no history exists, automatically start a new chat
            startNewChat();
        }
    }
    
    // --- Voice Input Functionality ---
    if ("webkitSpeechRecognition" in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;

        voiceBtn.addEventListener("click", () => {
            recognition.start();
            voiceBtn.textContent = "🎙️ Listening...";
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
            voiceBtn.textContent = "🎙️";
            // Automatically submit the form with the transcribed text
            chatForm.dispatchEvent(new Event("submit"));
        };

        recognition.onerror = () => {
            voiceBtn.textContent = "🎙️";
            alert("Could not detect voice. Please try again.");
        };
    } else {
        voiceBtn.disabled = true;
        voiceBtn.textContent = "❌ Mic";
    }
});