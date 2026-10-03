// =========================
// ELEMENTS
// =========================

const chatArea =
    document.getElementById("chatArea");

const messageInput =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const chatHistory =
    document.getElementById("chatHistory");


const MAX_MESSAGE_LENGTH = 2000;

let currentChatId = null;


// =========================
// LOAD HISTORY
// =========================

async function loadChatHistory() {

    try {

        const response =
            await fetch("/chats");

        const data =
            await response.json();


        chatHistory.innerHTML = "";


        data.chats.reverse().forEach(chat => {

            addChatToSidebar(
                chat.id,
                chat.title
            );

        });

    } catch (error) {

        console.error(
            "History error:",
            error
        );

    }

}


// =========================
// ADD CHAT TO SIDEBAR
// =========================

function addChatToSidebar(
    chatId,
    title
) {

    const button =
        document.createElement("button");


    button.className =
        "history-chat";


    button.dataset.chatId =
        chatId;


    const icon =
        document.createElement("span");

    icon.className =
        "history-icon";

    icon.textContent =
        "💬";


    const titleElement =
        document.createElement("span");

    titleElement.className =
        "history-title";

    titleElement.textContent =
        title || "New Chat";


    button.appendChild(icon);

    button.appendChild(titleElement);


    button.onclick =
        function () {

            openChat(chatId);

        };


    chatHistory.prepend(button);

}


// =========================
// ACTIVE CHAT
// =========================

function setActiveChat(chatId) {

    document
        .querySelectorAll(".history-chat")
        .forEach(button => {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.chatId ===
                chatId
            ) {

                button.classList.add(
                    "active"
                );

            }

        });

}


// =========================
// OPEN OLD CHAT
// =========================

async function openChat(chatId) {

    try {

        const response =
            await fetch(
                `/chat/${chatId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error
            );

        }


        currentChatId =
            chatId;


        setActiveChat(
            chatId
        );


        chatArea.innerHTML = "";


        data.messages.forEach(
            message => {

                addMessage(
                    message.content,
                    message.role
                );

            }
        );


        chatArea.scrollTop =
            chatArea.scrollHeight;


    } catch (error) {

        console.error(
            "Open chat error:",
            error
        );

    }

}


// =========================
// ADD MESSAGE
// =========================

function addMessage(
    message,
    sender
) {

    const welcome =
        document.getElementById(
            "welcome"
        );


    if (welcome) {

        welcome.remove();

    }


    const messageDiv =
        document.createElement("div");


    messageDiv.className =
        `message ${sender}`;


    const avatar =
        document.createElement("div");


    avatar.className =
        "avatar";


    avatar.textContent =
        sender === "user"
            ? "P"
            : "✦";


    const content =
        document.createElement("div");


    content.className =
        "message-content";


    content.textContent =
        message;


    if (sender === "user") {

        messageDiv.appendChild(
            content
        );

        messageDiv.appendChild(
            avatar
        );

    } else {

        messageDiv.appendChild(
            avatar
        );

        messageDiv.appendChild(
            content
        );

    }


    chatArea.appendChild(
        messageDiv
    );


    chatArea.scrollTop =
        chatArea.scrollHeight;

}


// =========================
// LOADING
// =========================

function showLoading() {

    const typing =
        document.createElement("div");


    typing.className =
        "message assistant";


    typing.id =
        "typing";


    typing.innerHTML = `
        <div class="avatar">✦</div>

        <div class="message-content typing">

            <span>
                AI is thinking
            </span>

            <span class="typing-dots">
                ...
            </span>

        </div>
    `;


    chatArea.appendChild(
        typing
    );


    chatArea.scrollTop =
        chatArea.scrollHeight;

}


function hideLoading() {

    const typing =
        document.getElementById(
            "typing"
        );


    if (typing) {

        typing.remove();

    }

}


// =========================
// SEND MESSAGE
// =========================

async function sendMessage() {

    const message =
        messageInput.value.trim();


    if (!message) {

        return;

    }


    if (
        message.length >
        MAX_MESSAGE_LENGTH
    ) {

        addMessage(
            `Your message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
            "assistant"
        );

        return;

    }


    sendButton.disabled =
        true;

    messageInput.disabled =
        true;


    addMessage(
        message,
        "user"
    );


    messageInput.value =
        "";


    showLoading();


    try {

        const response =
            await fetch(
                "/chat",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        message:
                            message,

                        chat_id:
                            currentChatId

                    })

                }
            );


        const data =
            await response.json();


        hideLoading();


        if (!response.ok) {

            addMessage(
                data.response ||
                "Server error. Please try again.",
                "assistant"
            );

            return;

        }


        currentChatId =
            data.chat_id;


        // Find existing sidebar item

        const existing =
            document.querySelector(
                `[data-chat-id="${data.chat_id}"]`
            );


        if (!existing) {

            addChatToSidebar(
                data.chat_id,
                data.title
            );

        } else {

            const titleElement =
                existing.querySelector(
                    ".history-title"
                );


            if (titleElement) {

                titleElement.textContent =
                    data.title;

            }

        }


        setActiveChat(
            currentChatId
        );


        addMessage(
            data.response ||
            "No response received.",
            "assistant"
        );


    } catch (error) {

        hideLoading();


        console.error(
            "Send error:",
            error
        );


        addMessage(
            "Unable to connect to the server. Please make sure Flask is running.",
            "assistant"
        );


    } finally {

        sendButton.disabled =
            false;

        messageInput.disabled =
            false;

        messageInput.focus();

    }

}


// =========================
// ENTER TO SEND
// =========================

function handleKey(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();

    }

}


// =========================
// SUGGESTIONS
// =========================

function useSuggestion(text) {

    messageInput.value =
        text;

    messageInput.focus();

    sendMessage();

}


// =========================
// NEW CHAT
// =========================

async function newChat() {

    try {

        const response =
            await fetch(
                "/new-chat",
                {
                    method: "POST"
                }
            );


        const data =
            await response.json();


        currentChatId =
            data.chat_id;


        chatArea.innerHTML = `
            <div
                class="welcome"
                id="welcome"
            >

                <div class="welcome-icon">
                    ✦
                </div>

                <h1>
                    Good evening, Purnoor 👋
                </h1>

                <p>
                    Your intelligent Python-powered assistant.
                    Ask me anything to get started.
                </p>

                <div class="suggestions">

                    <button
                        onclick="useSuggestion('What is Python?')"
                    >
                        <span>🐍</span>
                        What is Python?
                    </button>

                    <button
                        onclick="useSuggestion('Who are you?')"
                    >
                        <span>🤖</span>
                        Who are you?
                    </button>

                    <button
                        onclick="useSuggestion('Hello')"
                    >
                        <span>✨</span>
                        Say hello
                    </button>

                </div>

            </div>
        `;


        setActiveChat(
            currentChatId
        );


        messageInput.value =
            "";

        messageInput.focus();


    } catch (error) {

        console.error(
            "New chat error:",
            error
        );

    }

}


// =========================
// INITIAL LOAD
// =========================

loadChatHistory();