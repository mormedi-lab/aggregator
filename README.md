# 🧠 Aggregator

Aggregator is an internal AI-powered benchmarking tool designed to automate the “external context” research phase in strategic consulting projects. It collects high-quality primary sources from the web using LLM agents, allowing consultants to accelerate research, maintain consistency, and generate strategic insights faster.

---

## 🚀 Quick Deployment Guide

Run both the backend and frontend locally:

### 1. Backend

```bash
cd backend
uvicorn main:app --reload
```

The backend will be available at: [http://localhost:8000](http://localhost:8000)

### 2. Frontend

```bash
cd frontend
npm install  # only needed the first time
npm run dev
```

The frontend will be available at: [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
aggregator/
├── backend/     # TBD backend with OpenAI Agent SDK integration
│   └── main.py
│   └── router.py
├── frontend/    # React frontend using Tailwind CSS
│   └── src/
│       └── pages/
│       └── components/
└── README.md
```

---

## 🧩 Features

- Project creation and scope definition via form
- AI agent-generated search prompts
- Real-time source discovery and validation
- Interactive source roundup and library view

---

## 🛠 Requirements

- Node.js (v18+)
- Python 3.10+
- `uvicorn`, `fastapi`, `openai`, `python-dotenv`, etc.
- `.env` file with OpenAI API key

---

## 💡 Notes

- Make sure your `.env` file is set up in the backend directory with your OpenAI API key:

```env
OPENAI_API_KEY=your-key-here
```

- You may customize the agent logic and prompts in `backend/agents/`



