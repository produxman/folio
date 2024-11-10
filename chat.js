// Function to display messages in the chat window
function displayMessage(content, className) {
    const chatWindow = document.getElementById("chat-window");
    const message = document.createElement("div");
    message.classList.add("message", className);
    message.innerText = content;
    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to handle sending a message
function sendMessage() {
    const userInput = document.getElementById("user-input");
    const userMessage = userInput.value.trim();

    if (userMessage) {
        displayMessage(userMessage, "user-message"); // Display user message
        userInput.value = ""; // Clear input field
        getBotResponse(userMessage); // Fetch bot response
    }
}

// Function to fetch bot response from the backend
async function getBotResponse(message) {
    try {
        const response = await fetch("https://your-backend-api.com/gpt-endpoint", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: message }),
        });

        if (response.ok) {
            const data = await response.json();
            displayMessage(data.response, "bot-message"); // Display bot response
        } else {
            displayMessage("Error: Unable to connect to the server.", "bot-message");
        }
    } catch (error) {
        displayMessage("Error: Unable to fetch response.", "bot-message");
    }
}
