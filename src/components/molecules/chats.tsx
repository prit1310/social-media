import { Button, Card, Input, ScrollShadow } from "@nextui-org/react";
import { SendIcon, ArrowLeftIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { db, auth } from "../../lib/firebase";
import { collection, addDoc, query, where, getDocs, or, and } from "firebase/firestore";

interface Message {
  message: string;
  sender: string;
  receiver: string;
  timestamp: number; 
}

const Chats = () => {
  const [message, setMessage] = useState("");
  const [currentChat, setCurrentChat] = useState("");
  const [dataArray, setDataArray] = useState<Message[]>([]);
  const [specificChat, setSpecificChat] = useState<Message[]>([]);
  const [newReceiver, setNewReceiver] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  async function addMessage() {
    const messageRef = collection(db, "chats");
    if (auth.currentUser) {
      const timestamp = Date.now();
      await addDoc(messageRef, {
        message: message,
        sender: auth.currentUser.email,
        receiver: currentChat,
        timestamp
      });
      setMessage("");
      getSpecificChat(currentChat);
    } else {
      console.error("You are not logged in");
    }
  }

  async function addNewReceiver() {
    if (auth.currentUser && newReceiver) {
      const newMessage: Message = {
        message: "",
        sender: auth.currentUser.email!,
        receiver: newReceiver,
        timestamp: Date.now()
      };
      setDataArray(prev => [...prev, newMessage]);
      setNewReceiver("");
    } else {
      console.error("You are not logged in or new receiver is empty");
    }
  }

  async function getMessages() {
    if (auth.currentUser) {
      const q = query(
        collection(db, "chats"),
        or(where("sender", "==", auth.currentUser.email), where("receiver", "==", auth.currentUser.email))
      );
      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Message;
        messages.push(data);
      });

      messages.sort((a, b) => a.timestamp - b.timestamp);
      setDataArray(messages);
    } else {
      console.error('Please sign in');
    }
  }

  useEffect(() => {
    getMessages();
  }, []);

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  
  async function getSpecificChat(receiver: string) {
    if (!receiver) {
      console.error('Receiver is undefined');
      return;
    }

    if (auth.currentUser) {
      const user = auth.currentUser.email;
      const q = query(
        collection(db, "chats"),
        or(
          and(where("sender", "==", user), where("receiver", "==", receiver)),
          and(where("sender", "==", receiver), where("receiver", "==", user))
        )
      );
      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Message;
        messages.push(data);
      });

      messages.sort((a, b) => a.timestamp - b.timestamp);
      setSpecificChat(messages);
    } else {
      console.error('Please sign in');
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [specificChat]);

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen w-full md:w-1/4 bg-purple-300 py-8 px-4 md:px-2">
        <h1 className="text-2xl font-bold my-4">Chats</h1>
        <div className="flex mb-4">
          <Input
            className="w-full md:w-3/4"
            placeholder="Enter receiver email"
            onChange={(e) => setNewReceiver(e.target.value)}
            value={newReceiver}
          />
          <Button className="ml-2" color="secondary" onClick={addNewReceiver}>Add</Button>
        </div>
        <ScrollShadow className="h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] w-full px-2">
          {dataArray.length === 0 ? (
            <p>No chats available</p>
          ) : (
            Array.from(new Set(dataArray.flatMap(msg => [msg.sender, msg.receiver]))).filter(participant => participant !== auth.currentUser?.email)
              .map((participant, index) => (
                <Card
                  className="p-4 m-2 md:m-4"
                  key={index}
                  isPressable
                  isHoverable
                  onClick={() => {
                    setCurrentChat(participant);
                    getSpecificChat(participant);
                  }}
                >
                  <h4 className="font-semibold">{participant || "No Participant"}</h4>
                </Card>
              ))
          )}
        </ScrollShadow>
      </aside>
      <main className={`fixed top-0 right-0 h-screen w-full md:w-3/4 bg-blue-600 ${currentChat ? 'block' : 'hidden'}`}>
        <div className="flex items-center p-4">
          {currentChat && (
            <Button
              isIconOnly
              className="mr-2"
              color="secondary"
              onClick={() => setCurrentChat("")}
            >
              <ArrowLeftIcon />
            </Button>
          )}
          <h2 className="text-lg text-white font-semibold flex-grow">{currentChat}</h2>
        </div>
        <section className="h-[calc(100vh-8rem)] w-full">
          <ScrollShadow className="h-full w-full px-2">
            {specificChat.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === auth.currentUser?.email ? 'justify-end' : 'justify-start'} my-2`}
              >
                <Card
                  className={`max-w-[80%] min-w-40 p-4 ${msg.sender === auth.currentUser?.email ? 'bg-gray-400 text-white font-bold' : 'bg-black text-white'}`}
                >
                  <div>
                    <p>{msg.message}</p>
                  </div>
                </Card>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollShadow>
        </section>
        {currentChat && (
          <div className="fixed bottom-20 left-0 w-full p-4 bg-blue-500 z-10">
            <div className="flex items-center">
              <Input
                className="flex-grow"
                placeholder="Enter a message"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <Button isIconOnly className="ml-2" color="secondary" onClick={addMessage}>
                <SendIcon />
              </Button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Chats;
