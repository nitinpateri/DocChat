import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function UploadFirst() {
  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  const handleUpload = async () => {
  if (!file) {
    toast.error("❌ Please select a file to upload");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", file.name);

  try {
    const res = await api.post("upload/", formData);
    toast.success("✅ File uploaded!");
    setFile(null);
    fetchDocs();
    navigate(`/chat/${res.data.id}`);
  } catch (err) {
    const msg = err.response?.data?.title?.[0] || err.response?.data?.error || "Upload failed";
    toast.error("❌ " + msg);
    console.error("Upload error:", err);
  }
};

  const fetchDocs = async () => {
    const res = await api.get("documents/");
    setDocs(res.data);
  };

  const handleDelete = async (id) => {
    await api.delete(`documents/${id}/`);
    toast.success("Deleted!");
    fetchDocs();
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-start p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">📁 Your Documents</h1>

      {docs.length === 0 && <p>No documents yet. Upload one below!</p>}

      <div className="w-full max-w-lg space-y-2 mb-6">
        {docs.map(doc => (
          <div key={doc.id} className="flex justify-between border p-2 rounded">
            <span className="cursor-pointer hover:underline" onClick={() => navigate(`/chat/${doc.id}`)}>{doc.title}</span>
            <button onClick={() => handleDelete(doc.id)} className="text-red-500">🗑</button>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md border rounded p-4">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload} disabled={!file} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded w-full">Upload & Start Chat</button>
      </div>
    </div>
  );
}
