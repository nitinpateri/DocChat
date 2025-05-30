import { useState } from 'react';
import api from '../api';
import downloadJson from '../utils/downloadJson';
import toast from 'react-hot-toast';

export default function ChatArea({ documentId }) {
  
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [showSources, setShowSources] = useState([]);

  const handleAsk = async (e) => {
  e.preventDefault();

  if (!question.trim()) {
    toast.error("❌ Question cannot be empty");
    return;
  }

  try {
    const res = await api.post("ask/", {
      document_id: documentId,
      question: question.trim()
    });

    const entry = {
      user: question,
      bot: res.data.answer,
      sources: res.data.chunks || []
    };

    setChat([...chat, entry]);
    setShowSources([...showSources, false]); // ← keep in sync

  } catch (err) {
    const msg = err.response?.data?.error || "❌ Failed to get answer";
    toast.error(msg);
    console.error("Ask error:", err);
  }
};


  return (
    <div className="flex flex-col h-fixed p-4">
      <div className="flex-grow overflow-y-auto max-h-[71vh] space-y-4 mb-4 pr-2">
        
      {chat.map((entry, i) => (
  <div key={i} className="mb-4">
    <p className="font-bold text-green-600">🧑 You: {entry.user}</p>

    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-1">
      <p>🤖 {entry.bot}</p>

      <button
        onClick={() => {
          const updated = [...showSources];
          updated[i] = !updated[i];
          setShowSources(updated);
        }}
        className="text-blue-500 text-sm mt-2 underline"
      >
        {showSources[i] ? "Hide Sources" : "View Sources"}
      </button>

      {showSources[i] && (
        <ul className="mt-2 list-disc ml-5 text-sm text-gray-700 dark:text-gray-300">
          {entry.sources.map((src, idx) => (
            <li key={idx}>{src}</li>
          ))}
        </ul>
      )}
    </div>
  </div>
))}


      </div>

      <form onSubmit={handleAsk} className="flex gap-2 text-white">
        <input
          className="flex-grow p-2 border rounded"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask something about this document..."
          required
        />
        <button type="submit" className="px-4 text-white bg-green-600 rounded">Send</button>
        <button type="button" onClick={() => downloadJson(chat)} className="px-2 text-sm border rounded">
          ⬇ JSON
        </button>
      </form>
    </div>
  );
}
