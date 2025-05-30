// src/pages/Chat.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

function Chat() {
  const { docId } = useParams();
  const [document, setDocument] = useState(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDoc = async () => {
    try {
      const res = await api.get(`documents/${docId}/`);
      setDocument(res.data);
    } catch (err) {
      toast.error("Failed to load document info");
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    const newMessage = { type: 'user', content: question };
    setMessages(prev => [...prev, newMessage]);
    setLoading(true);

    try {
      const res = await api.post('ask/', {
        document_id: docId,
        question: question,
      });
      setMessages(prev => [
        ...prev,
        { type: 'bot', content: res.data.answer, chunks: res.data.chunks }
      ]);
    } catch (err) {
      toast.error("Failed to get answer");
    } finally {
      setQuestion('');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, [docId]);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-white border-b">
        <h1 className="text-xl font-bold">🧾 {document?.title || 'Loading document...'}</h1>
        <p className="text-sm text-gray-500">Document ID: {docId}</p>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-3 rounded max-w-2xl ${msg.type === 'user' ? 'bg-blue-100 self-end' : 'bg-white self-start border'}`}>
            <p>{msg.content}</p>
            {msg.chunks && msg.chunks.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                <strong>Sources:</strong>
                <ul className="ml-4 list-disc">
                  {msg.chunks.map((chunk, i) => (
                    <li key={i}>{chunk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-4 bg-white border-t">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
          className="flex-1 p-2 border rounded"
          placeholder="Ask something..."
        />
        <button
          onClick={askQuestion}
          disabled={loading}
          className="px-4 py-2 text-white bg-green-600 rounded disabled:opacity-50"
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </div>
    </div>
  );
}

export default Chat;
