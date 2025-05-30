import React, { useEffect, useState } from 'react';
import api from '../api';

function DocumentList({ onSelect }) {
  const [documents, setDocuments] = useState([]);

  const loadDocuments = async () => {
    const res = await api.get("documents/");
    console.log("Loaded documents:", res.data);
    setDocuments(res.data);
  };

  const deleteDoc = async (id) => {
    await api.delete(`documents/${id}/`);
    loadDocuments();
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className="mt-4 space-y-2">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-2 border">
          <span>{doc.title}</span>
          <div>
            <button className="mr-2 text-blue-600" onClick={() => onSelect(doc.id)}>Ask</button>
            <button className="text-red-600" onClick={() => deleteDoc(doc.id)}><img src='../assets/delete.PNG'/></button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DocumentList;
