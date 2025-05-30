document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const messageInput = document.getElementById("messageInput");
  const messagesContainer = document.getElementById("messages");

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    // Display user message
    addMessage("user", userMessage);
    messageInput.value = "";

    // Simulate loading
    const loadingMsg = addMessage("bot", "Typing...");
    await delay(1000);

    // Simulate bot response
    const botReply = getMockResponse(userMessage);
    loadingMsg.textContent = botReply;
  });

  function addMessage(sender, text) {
    const messageEl = document.createElement("div");
    messageEl.className = `p-3 rounded-xl shadow mb-3 max-w-[80%] ${sender === "user" ? "bg-indigo-500 text-white self-end" : "bg-white text-gray-800 self-start"}`;
    messageEl.textContent = text;
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageEl;
  }

  function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  function getMockResponse(input) {
    // Simple hardcoded logic — replace with real API if needed
    if (input.toLowerCase().includes("hello")) return "Hi there! How can I help you today?";
    if (input.toLowerCase().includes("image")) return "You can generate images on the Image Generator page!";
    return "I'm here to assist you. Ask me anything!";
  }
});
