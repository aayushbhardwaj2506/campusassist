import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "@core/auth";
import {
  sendMessage,
  subscribeToMessages,
} from "./modules/parcelAssistance/services/chatService";

export default function ParcelChatPage() {
  const { requestId } = useParams();
  console.log("Current requestId:", requestId);
  const { user } = useAuth();

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!requestId) return;

    return subscribeToMessages(requestId, (msgs) => {
      console.log("Received messages:", msgs);
      setMessages(msgs);
    });
  }, [requestId]);

async function handleSend() {
  console.log("Send clicked");

  console.log({
    user,
    requestId,
    text,
  });

  if (!user) {
    console.log("No user");
    return;
  }

  if (!requestId) {
    console.log("No requestId");
    return;
  }

  if (!text.trim()) {
    console.log("Empty message");
    return;
  }

  try {
    await sendMessage(
      requestId,
      user.uid,
      user.displayName || "User",
      text
    );

    console.log("Message sent successfully");
    setText("");
} catch (err) {
  console.error("Send failed:", err);
  alert(String(err));
}
}

  return (
<div
  className="min-h-screen bg-cover bg-center bg-fixed"
  style={{
    backgroundImage: "url('/images/chat-bg.jpg')",
  }}
>
  <div className="min-h-screen bg-black/40 flex justify-center items-center p-6">
    <div className="w-full max-w-4xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-6">
      <h1 className="text-3xl font-bold text-white drop-shadow-lg">
        💬 Parcel Chat
      </h1>

<div className="mt-6 h-[500px] overflow-y-auto rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 shadow-inner">
{messages.map((msg) => {
  const isMine = msg.senderId === user?.uid;

  return (
    <div
      key={msg.id}
      className={`mb-3 flex ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl p-3 shadow-lg ${
          isMine
            ? "bg-blue-600 text-white"
            : "border border-white/10 bg-white/20 backdrop-blur-md text-white"
        }`}
      >
        {!isMine && (
          <p className="text-xs font-semibold text-blue-200">
            {msg.senderName}
          </p>
        )}

        <p className="mt-1">{msg.message}</p>
      </div>
    </div>
  );
})}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-3 text-white placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSend}
 className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</div>
  );
}