import { useEffect, useState } from 'react';
import api from '../api';

export default function FileMeta({ id }) {
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    api.get(`documents/${id}/`).then(res => setDoc(res.data));
  }, [id]);

  if (!doc) return null;

  return (
    <div className="p-3 mb-2 text-sm text-gray-700 bg-gray-100 rounded dark:bg-gray-800 dark:text-gray-300">
      <p><strong>📄 Title:</strong> {doc.title}</p>
      <p><strong>📦 Size:</strong> {(doc.size / 1024).toFixed(1)} KB</p>
      <p><strong>📅 Uploaded:</strong> {new Date(doc.uploaded_at).toLocaleString()}</p>
    </div>
  );
}
