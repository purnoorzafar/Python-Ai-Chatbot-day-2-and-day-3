# AI Chatbot – Day 2 & Day 3

A Python-based conversational AI chatbot developed and enhanced as part of an AI internship practical project.

This project extends the basic chatbot implementation by adding API integration, system prompting, loading states, validation, conversation context, chat history, multiple conversations, and improved error handling.

## Project Overview

The chatbot is a web-based AI assistant built with Python and Flask.

The application provides a clean chat interface where users can communicate with an AI assistant, maintain conversation context, start new conversations, and reopen previous chats.

The project was developed in two stages:

* Day 2 – AI Chatbot Development
* Day 3 – Chatbot Improvement

## Day 2 – AI Chatbot Development

The Day 2 implementation focused on building a functional AI chatbot with proper backend integration.

### Day 2 Features

* User message input
* AI response generation
* OpenAI API integration
* System prompt
* Loading state
* Input validation
* Error handling
* Clean chat interface
* Flask backend

### System Prompt

The chatbot uses a system prompt to define its role and behavior.

The assistant is instructed to:

* Be helpful and professional
* Answer clearly
* Explain technical questions step by step
* Keep responses relevant
* Maintain conversation context

## Day 3 – Chatbot Improvements

Day 3 focused on improving the chatbot experience and adding conversation management features.

### Day 3 Features

* Conversation history
* Multiple chat sessions
* New Chat functionality
* Previous chat sidebar
* Reopen previous conversations
* Conversation context
* Name memory during the conversation
* Improved UI
* Better validation
* Improved error handling
* API fallback/demo mode

## Chat History

Each conversation is assigned a unique chat ID.

The backend stores the conversation messages and allows the frontend to retrieve previous conversations.

Users can:

1. Start a new chat
2. Send messages
3. Continue the conversation
4. Start another conversation
5. Select an older chat
6. Reopen the previous conversation

## Conversation Context

The chatbot maintains previous messages within the active conversation.

For example:

```text
User: My name is Purnoor.

AI: Nice to meet you, Purnoor!

User: What is my name?

AI: Your name is Purnoor.
```

This demonstrates basic conversational context and memory.

## API Integration

The backend integrates with the OpenAI API using the Python OpenAI SDK.

The API key is stored in an environment variable instead of being hard-coded into the source code.

```text
OPENAI_API_KEY=your_api_key_here
```

The `.env` file is excluded from GitHub using `.gitignore`.

## Demo / Fallback Mode

During development, the OpenAI API may be unavailable because of account quota or API access limitations.

To keep the application testable, the chatbot includes a fallback demo-response system.

When the API request fails, the application catches the error and provides predefined responses for supported test messages.

This allows the interface, conversation management, validation, and error-handling functionality to continue working locally.

## Loading State

The interface displays a typing indicator while a chatbot request is being processed.

This improves the user experience by showing that the application is processing the request.

## Input Validation

The application validates user messages on both the frontend and backend.

It checks:

* Empty messages
* Maximum message length
* Invalid requests

The maximum message length is:

```text
2000 characters
```

## Error Handling

The application handles:

* Invalid requests
* Empty input
* Long messages
* API errors
* Missing API configuration
* Server connection errors

## Architecture

```text
User
  ↓
HTML / CSS / JavaScript
  ↓
Flask Backend
  ↓
Conversation Management
  ↓
OpenAI API
  ↓
AI Response
  ↓
Frontend
```

If the OpenAI API is unavailable:

```text
User
  ↓
Frontend
  ↓
Flask Backend
  ↓
API Error
  ↓
Fallback Demo Response
  ↓
Frontend
```

## Technology Stack

* Python
* Flask
* HTML5
* CSS3
* JavaScript
* OpenAI API
* Python-dotenv
* GitHub

## Project Structure

```text
AI-Chatbot-Day-2-3/
│
├── Screenshots/
├── static/
│   ├── script.js
│   └── style.css
├── templates/
│   └── index.html
├── app.py
├── requirements.txt
├── README.md
└── .gitignore
```

## How to Run

### 1. Create a virtual environment

```bash
python -m venv .venv
```

### 2. Activate the environment

Windows PowerShell:

```powershell
.venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure the API key

Create a `.env` file:

```text
OPENAI_API_KEY=your_api_key_here
```

Never upload the `.env` file to GitHub.

### 5. Run the application

```bash
python app.py
```

Then open the local Flask URL in your browser.

## What I Learned

During Day 2 and Day 3, I learned:

* How to integrate an AI API with Flask
* How to create and use system prompts
* How frontend and backend communicate
* How to manage conversation context
* How to implement multiple chat sessions
* How to create chat history
* How to validate user input
* How to implement loading states
* How to handle API failures
* How to create fallback responses
* How to structure a Python web application
* How to document an AI project

## Problems and Solutions

### API Availability

The OpenAI API was unavailable during some development/testing because of quota limitations.

**Solution:**
Implemented exception handling and a fallback demo-response system.

### Conversation Management

The chatbot needed to remember previous messages.

**Solution:**
Implemented server-side conversation storage using unique chat IDs.

### Multiple Conversations

Users needed the ability to start a new conversation without losing previous chats.

**Solution:**
Added multiple conversation sessions and a recent-chat sidebar.

### Input Validation

Users could submit empty or very long messages.

**Solution:**
Added frontend and backend validation with a 2000-character limit.

## Screenshots

The `Screenshots` folder contains examples of:

* Chatbot interface
* AI responses
* Loading state
* Conversation history
* New chat
* Error/fallback handling

## Future Improvements

Future versions may include:

* Persistent database storage
* User authentication
* Markdown response rendering
* Voice input and output
* Advanced AI memory
* Production API configuration
* Analytics
* Deployment and monitoring

## Project Status

**Completed – Day 2 & Day 3 Internship Tasks**

The chatbot has been developed, enhanced, tested locally, and prepared for repository submission.

## Author

**Purnoor Zafar**

Computer Engineering Technology
AI / Software Development
