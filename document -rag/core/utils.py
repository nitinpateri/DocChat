import pdfplumber
import docx
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
import uuid
import openai

def extract_text(file_path, file_type):
    text = ""

    if file_type == 'pdf':
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"

    elif file_type == 'docx':
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"

    elif file_type == 'txt':
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()

    else:
        raise ValueError("Unsupported file type")

    return text.strip()

def chunk_text(text, chunk_size=300, overlap=50):
    words = text.split()
    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap  # overlap = next chunk starts before previous ends

    return chunks

# Load once globally (outside function)
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

chroma_client = chromadb.PersistentClient(path="./chroma_storage")

collection = chroma_client.get_or_create_collection("document_chunks")


def store_embeddings(document_id, chunks):
    embeddings = embedding_model.encode(chunks)

    ids = []
    for i, emb in enumerate(embeddings):
        uid = str(uuid.uuid4())
        ids.append(uid)

        # Store in Chroma
        collection.add(
            documents=[chunks[i]],
            embeddings=[emb],
            ids=[uid],
            metadatas=[{"document_id": str(document_id), "chunk_index": i}]
        )

    return ids



client = openai.OpenAI(
    base_url="http://localhost:1234/v1",  # LM Studio API
    api_key="lm-studio"  # Can be any placeholder
)

def ask_question(document_id, question, top_k=3):
    # 1. Embed the question
    question_embedding = embedding_model.encode([question])

    # 2. Query ChromaDB
    results = collection.query(
        query_embeddings=question_embedding,
        n_results=top_k,
        where={"document_id": str(document_id)}
    )

    source_chunks = results['documents'][0]
    context = "\n\n".join(source_chunks)

    # 3. Build prompt
    prompt = f"""You are a document assistant. Use the context below to answer the question.
Context:
{context}

Question:
{question}

Answer:"""

    # 4. Call LM Studio (local model)
    response = client.chat.completions.create(
        model="mistral-7b-instruct-v0.2",  # <- your running model
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    answer = response.choices[0].message.content
    return answer, source_chunks