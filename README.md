# 📄 Document RAG (Retrieval-Augmented Generation)

Document RAG(DocChat) is an AI-powered full-stack web app that allows users to upload documents, semantically search through them, and chat with their content using local LLMs. It features a modern, ChatGPT-style interface.

---

## 🚀 Features

- 📤 Upload PDFs and automatically extract + chunk text
- 🧠 Ask questions using RAG (retrieval + generation)
- 🧾 View source chunks used to generate each answer
- 🧭 ChatGPT-style sidebar UI to navigate between documents
- 🌗 Three-way theme toggle: Light / Dark / System
- ✅ Upload & delete with toast popups
- ⬇️ Download chat history as `.json`

---

## 🛠️ Technologies Used

### Backend:
- Django + Django REST Framework
- ChromaDB
- PyMuPDF (text extraction)
- Optional: OpenAI or LM Studio (local inference)

### Frontend:
- React + Vite
- Tailwind CSS
- Axios + React Router DOM
- react-hot-toast (alerts)
- window.matchMedia + localStorage (theme handling)

---

## 📡 API Endpoints

| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| POST   | `/api/upload/`            | Upload a document (PDF)        |
| GET    | `/api/documents/`         | List all uploaded documents     |
| GET    | `/api/documents/<id>/`    | Get metadata for a document     |
| DELETE | `/api/documents/<id>/`    | Delete a document               |
| POST   | `/api/ask/`               | Ask a question and get answer   |

---

## 🧑‍💻 Local Development Setup


### 🔧 Backend (Django)
```bash
git clone <repo>
cd backend
python -m venv venv
source venv/bin/activate  # or use venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 
```
### 🌐 Frontend (React + Vite)
```bash
cd rag-frontend
npm install
npm run dev
```


## 🧠 Running with LM Studio (Local LLM)\

- To run this app completely offline with a local large language model, we use LM Studio — a powerful desktop app that exposes models through an OpenAI-compatible API.

## 🔧 Setup Instructions
- Install LM Studio

- Download from: https://lmstudio.ai

- Supports Windows, macOS, and Linux

- Enable the OpenAI-Compatible Server

- Open LM Studio

- Go to ⚙️ Settings

- Enable ✅ OpenAI Compatible API Server

- The API will run by default at: http://localhost:1234/v1

- Load a Lightweight Model (Recommended)

- Ideal model: Mistral-7B Instruct Q4_K_M

- Other options: LLaMA 2 Chat, Gemma-2B

- Ensure the model is marked ✅ Ready in LM Studio

## Update Django Environment Variables

-  Create a .env file in your backend directory (or add to settings):

env
```bash
OPENAI_API_KEY=lm-studio
OPENAI_API_BASE=http://localhost:1234/v1

Restart your Django server
```

## ✅ Final Test
- The app will now route RAG queries to your locally running model:


python
```bash
response = openai.ChatCompletion.create(
  model="mistral-7b-instruct-v0.2",
  messages=[
    {"role": "user", "content": "What is this document about?"}
  ]
)
```
## 💡 Notes

- No internet connection is required once the model is loaded into LM Studio.

- Mistral 7B Q4 works well with 16 GB RAM (11 GB usable).

- You can switch between OpenAI and LM Studio anytime via .env.
  
- After asking the question, the DocChat will take at least 2 minutes to load. Be Patient.

