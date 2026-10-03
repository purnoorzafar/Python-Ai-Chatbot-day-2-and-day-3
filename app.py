import os
import uuid

from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI


# =========================
# LOAD ENVIRONMENT
# =========================

load_dotenv()

app = Flask(__name__)

api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key) if api_key else None


# =========================
# SYSTEM PROMPT
# =========================

SYSTEM_PROMPT = """
You are a helpful, friendly, and professional AI assistant.

Your responsibilities:
- Answer questions clearly and accurately.
- Be polite and easy to understand.
- Explain technical questions step by step.
- Keep answers relevant to the user's question.
- Maintain conversation context.
"""


# =========================
# CONVERSATION STORAGE
# =========================

conversations = {}


# =========================
# DEMO / FALLBACK RESPONSE
# =========================

def demo_response(user_input, chat_messages):

    text = user_input.lower().strip()

    if text in ["hello", "hi", "hey", "Assalam O Alaikum", "Aoa"
] or "hello" in text:
        return "Hello! I'm your AI Assistant. How can I help you today? 😊"
         return "Wa Alaikum Assalam! How can I help you?
"

    if "what is python" in text:
        return (
            "Python is a high-level programming language widely used "
            "for software development, automation, data analysis, "
            "machine learning, and artificial intelligence."
        )

    if "what is computer" in text:
        return (
            "A computer is an electronic device that processes data "
            "according to instructions called programs. It can perform "
            "tasks such as calculations, storing information, running "
            "software, and communicating over networks."
        )

    if "who are you" in text:
        return (
            "I'm a Python-powered AI chatbot created as an internship "
            "project. I'm designed to answer questions, maintain "
            "conversation context, and handle user input through a "
            "Flask backend."
        )

    if "how are you" in text:
        return "I'm doing great! Thanks for asking. How can I help you?"

    if "what is ai" in text:
        return (
            "Artificial Intelligence (AI) is technology that enables "
            "computers to perform tasks that normally require human "
            "intelligence, such as understanding language, learning, "
            "reasoning, and solving problems."
        )

    # Remember name
    if "my name is" in text:

        name = text.split("my name is", 1)[1].strip()

        if name:
            return (
                f"Nice to meet you, {name.title()}! "
                "I'll remember your name during this conversation."
            )

    # Recall name
    if "what is my name" in text or "do you know my name" in text:

        for message in chat_messages:

            if message["role"] == "user":

                previous = message["content"].lower()

                if "my name is" in previous:

                    name = previous.split("my name is", 1)[1].strip()

                    if name:
                        return f"Your name is {name.title()}."

        return "You haven't told me your name yet."

    if "bye" in text:
        return "Goodbye! Have a great day. 👋"

    return (
        "I received your message successfully. The AI API is currently "
        "unavailable, so I'm responding using demo mode."
    )


# =========================
# HOME
# =========================

@app.route("/")
def home():
    return render_template("index.html")


# =========================
# GET ALL CHAT HISTORY
# =========================

@app.route("/chats", methods=["GET"])
def get_chats():

    chat_list = []

    for chat_id, chat in conversations.items():

        chat_list.append({
            "id": chat_id,
            "title": chat["title"]
        })

    return jsonify({
        "chats": chat_list
    })


# =========================
# CREATE NEW CHAT
# =========================

@app.route("/new-chat", methods=["POST"])
def new_chat():

    chat_id = str(uuid.uuid4())

    conversations[chat_id] = {
        "title": "New Chat",
        "messages": [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            }
        ]
    }

    return jsonify({
        "chat_id": chat_id,
        "title": "New Chat"
    })


# =========================
# OPEN OLD CHAT
# =========================

@app.route("/chat/<chat_id>", methods=["GET"])
def get_chat(chat_id):

    if chat_id not in conversations:

        return jsonify({
            "error": "Chat not found."
        }), 404

    messages = conversations[chat_id]["messages"]

    visible_messages = [
        message
        for message in messages
        if message["role"] != "system"
    ]

    return jsonify({
        "id": chat_id,
        "title": conversations[chat_id]["title"],
        "messages": visible_messages
    })


# =========================
# SEND MESSAGE
# =========================

@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json(silent=True)

    if not data:

        return jsonify({
            "response": "Invalid request. Please try again."
        }), 400

    user_input = data.get("message", "").strip()

    chat_id = data.get("chat_id")


    # =========================
    # VALIDATION
    # =========================

    if not user_input:

        return jsonify({
            "response": "Please enter a message."
        }), 400


    if len(user_input) > 2000:

        return jsonify({
            "response": (
                "Your message is too long. "
                "Please keep it under 2000 characters."
            )
        }), 400


    # =========================
    # CREATE CHAT IF NEEDED
    # =========================

    if not chat_id or chat_id not in conversations:

        chat_id = str(uuid.uuid4())

        conversations[chat_id] = {
            "title": user_input[:35],
            "messages": [
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                }
            ]
        }


    chat_data = conversations[chat_id]

    messages = chat_data["messages"]


    # =========================
    # CHAT TITLE
    # =========================

    user_messages = [
        message
        for message in messages
        if message["role"] == "user"
    ]


    if not user_messages:

        title = user_input[:35]

        if len(user_input) > 35:
            title += "..."

        chat_data["title"] = title


    # =========================
    # ADD USER MESSAGE
    # =========================

    messages.append({
        "role": "user",
        "content": user_input
    })


    # Recent context
    conversation = [
        messages[0]
    ] + messages[1:][-20:]


    answer = None


    # =========================
    # OPENAI API
    # =========================

    if client:

        try:

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=conversation
            )

            answer = response.choices[0].message.content

        except Exception as error:

            print("OpenAI API Error:", error)

            answer = demo_response(
                user_input,
                messages
            )

    else:

        answer = demo_response(
            user_input,
            messages
        )


    # =========================
    # SAVE AI RESPONSE
    # =========================

    messages.append({
        "role": "assistant",
        "content": answer
    })


    return jsonify({
        "response": answer,
        "chat_id": chat_id,
        "title": chat_data["title"]
    })


# =========================
# DELETE CHAT
# =========================

@app.route("/clear", methods=["POST"])
def clear_chat():

    data = request.get_json(silent=True) or {}

    chat_id = data.get("chat_id")


    if chat_id in conversations:

        del conversations[chat_id]


    return jsonify({
        "status": "success",
        "message": "Chat deleted successfully."
    })


# =========================
# RUN
# =========================

if __name__ == "__main__":

    app.run(debug=True)