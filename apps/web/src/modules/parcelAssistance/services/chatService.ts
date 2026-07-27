import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@core/firebase";

export async function sendMessage(
  requestId: string,
  senderId: string,
  senderName: string,
  message: string
) {
  await addDoc(collection(db, "parcelChats"), {
    requestId,
    senderId,
    senderName,
    message,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToMessages(
  requestId: string,
  callback: (messages: any[]) => void
) {
  const q = query(
    collection(db, "parcelChats"),
    where("requestId", "==", requestId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      console.log("Snapshot docs:", snapshot.docs.length);

      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(msgs);

      callback(msgs);
    },
    (error) => {
      console.error(error);
    }
  );
}