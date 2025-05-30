import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import FileMeta from "./components/FileMeta";
import ThemeToggle from "./components/ThemeToggle";
import { useParams, useLocation } from "react-router-dom";
import { useState } from "react";

function App() {
  const [selectedDoc, setSelectedDoc] = useState(null);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar onSelect={setSelectedDoc} />

      <main className="flex-grow flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-bold">DocChat</h1>
          <ThemeToggle />
        </div>

        <div className="p-4 flex-grow overflow-y-auto">
          {selectedDoc ? (
            <>
              <FileMeta id={selectedDoc} />
              <ChatArea documentId={selectedDoc} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <h2 className="text-2xl font-bold mb-2">Welcome to DocChat 🤖</h2>
              <p className="max-w-md">
                Upload a document using the sidebar or Select a file in the sidebar and start chatting with it!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
