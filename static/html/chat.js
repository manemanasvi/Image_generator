const BACKEND_BASE_URL = window.env.BACKEND_BASE_URL;


document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const messageInput = document.getElementById("messageInput");
  const messagesContainer = document.getElementById("messages");
  const voiceBtn = document.getElementById("voiceBtn");

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    addMessage("user", userMessage);
    messageInput.value = "";

    const botBubble = addMessage("bot", "Typing...");
    const botResponse = await getBotResponse(userMessage);
    await simulateTyping(botBubble, botResponse);
  });

  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `p-3 rounded-xl shadow max-w-[75%] ${sender === "user" ? "bg-indigo-500 text-white self-end ml-auto" : "bg-white text-gray-800 self-start"}`;
    msg.textContent = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msg;
  }

  async function getBotResponse(userMessage) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      return data.reply || "Sorry, I couldn't understand that.";
    } catch {
      return "❌ Error contacting chatbot API.";
    }
  }

  async function simulateTyping(element, text, delay = 30) {
    element.textContent = "";
    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i];
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  // 🎤 Voice Input
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
    };

    recognition.onerror = () => {
      voiceBtn.textContent = "🎙️";
      alert("Could not detect voice. Try again.");
    };
  } else {
    voiceBtn.disabled = true;
    voiceBtn.textContent = "❌ Mic";
  }
});
