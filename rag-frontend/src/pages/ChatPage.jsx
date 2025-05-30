import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import FileMeta from "../components/FileMeta";
import ThemeToggle from "../components/ThemeToggle";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import api from "../api";
import { toast } from "react-hot-toast";


export default function ChatPage() {
  const { docId } = useParams();
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await api.get(`documents/${docId}/`);
        if (!res.data) {
          toast.error("❌ Document not found");
          navigate("/upload");
        }
      } catch (err) {
        toast.error("❌ Failed to fetch document");
        console.error("Fetch document error:", err);
        navigate("/upload");
      }
    };

    fetchDocument();
  }, [docId]);

  return (
    <div className="min-h-screen flex flex-row bg-white dark:bg-gray-900">
  <Sidebar />
  <main className="flex flex-col flex-grow p-4">
    <FileMeta id={docId} />
    <ChatArea documentId={docId} />
  </main>
</div>

  );
}
