import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

function Home() {
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  const fetchDocs = async () => {
    const res = await api.get("documents/");
    setDocs(res.data);
  };

  const handleDelete = async (id) => {
    await api.delete(`documents/${id}/`);
    toast.success("Deleted successfully");
    fetchDocs();
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div className="flex flex-col max-w-xl p-6 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">📂 Your Documents</h1>
      {docs.map(doc => (
        <div key={doc.id} className="flex justify-between p-3 mb-2 border rounded">
          <span onClick={() => navigate(`/chat/${doc.id}`)} className="cursor-pointer hover:underline">{doc.title}</span>
          <button onClick={() => handleDelete(doc.id)} className="text-red-500">Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Home;
