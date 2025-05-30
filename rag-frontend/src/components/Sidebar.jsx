import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function Sidebar({ onSelect }) {
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Load all documents
  const fetchDocs = async () => {
    try {
      const res = await api.get("documents/");
      setDocs(res.data);
    } catch (err) {
      toast.error("Failed to load documents");
    }
  };

  // Upload a file
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    try {
      const res = await api.post("upload/", formData);
      toast.success("✅ File uploaded!");
      setFile(null);
      await fetchDocs();
      setSelectedId(res.data.id);
      onSelect(res.data.id);
    } catch (err) {
      const msg = err.response?.data?.title?.[0] || "Upload failed";
      toast.error(msg);
    }
  };

  // Delete a file
  const handleDelete = async (id) => {
    try {
      await api.delete(`documents/${id}/`);
      toast.success("🗑️ File deleted");
      await fetchDocs();

      // Reset if deleted selected
      if (id === selectedId) {
        setSelectedId(null);
        onSelect(null);
      }
    } catch (err) {
      toast.error("Failed to delete file");
    }
  };

  // Initial load
  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <aside className="w-64 h-screen border-r bg-white dark:bg-gray-900 dark:border-gray-700 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">📁 Your Documents</h2>

      <div className="flex-grow overflow-y-auto space-y-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer ${
              selectedId === doc.id ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => {
              setSelectedId(doc.id);
              onSelect(doc.id);
            }}
          >
            <span className="truncate w-40">{doc.title}</span>
            <button onClick={(e) => {
              e.stopPropagation(); // prevent selection
              handleDelete(doc.id);
            }} className="text-red-500 hover:text-red-600">🗑</button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </div>
    </aside>
  );
}
