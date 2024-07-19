import { Button, Card, Input, ScrollShadow } from "@nextui-org/react"
import { SendIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { db, auth } from "../../lib/firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"

interface Message {
  message: string;
  sender: string;
  receiver: string;
}

const Chats = () => {
  const [message, setMessage] = useState("")
  const [currentChat, setCurrentChat] = useState("")
  const [dataArray, setDataArray] = useState<Message[]>([])
  const [specificChat, setSpecificChat] = useState<Message[]>([])
  const [newReceiver, setNewReceiver] = useState("")

  async function addMessage() {
    const messageRef = collection(db, "chats")
    if (auth.currentUser) {
      console.log("Adding message:", { message, sender: auth.currentUser.email, receiver: currentChat })
      await addDoc(messageRef, {
        message: message,
        sender: auth.currentUser.email,
        receiver: currentChat
      })
      setMessage("")
      getSpecificChat(currentChat) 
    } else {
      console.error("You are not logged in")
    }
  }

  async function addNewReceiver() {
    if (auth.currentUser && newReceiver) {
      const newMessage: Message = {
        message: "",
        sender: auth.currentUser.email!,
        receiver: newReceiver,
      }
      setDataArray(prev => [...prev, newMessage])
      setNewReceiver("")
      console.log("New receiver added:", newReceiver)
    } else {
      console.error("You are not logged in or new receiver is empty")
    }
  }

  async function getMessages() {
    if (auth.currentUser) {
      const q = query(collection(db, "chats"), where("sender", "==", auth.currentUser.email))
      const querySnapshot = await getDocs(q)
      const uniqueMessages = new Set<Message>()

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Message
        uniqueMessages.add(data)
      })
      setDataArray(Array.from(uniqueMessages))
    } else {
      console.error('Please sign in')
    }
  }

  useEffect(() => {
    getMessages()
  }, [])

  async function getSpecificChat(receiver: string) {
    if (!receiver) {
      console.error('Receiver is undefined')
      return
    }
  
    console.log(`Fetching chat for receiver: ${receiver}`)
  
    if (auth.currentUser) {
      const q = query(
        collection(db, "chats"),
        where("sender", "==", auth.currentUser.email),where("receiver", "==", receiver)
      )
      const querySnapshot = await getDocs(q)
      const messages: Message[] = []
  
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Message
        messages.push(data)
      })
  
      setSpecificChat(messages)
    } else {
      console.error('Please sign in')
    }
  }  

  useEffect(() => {
    console.log("dataArray:", dataArray)
  }, [dataArray])

  return (
    <>
      <aside className="fixed left-0 w-1/4 bg-purple-300 py-8 px-4">
        <h1 className="text-2xl font-bold my-4">Chats</h1>
        <div className="flex mb-4">
          <Input
            className="w-3/4"
            placeholder="Enter sender email"
            onChange={(e) => setNewReceiver(e.target.value)}
            value={newReceiver}
          />
          <Button className="ml-2" color="secondary" onClick={addNewReceiver}>Add</Button>
        </div>
        <ScrollShadow className="h-screen w-full px-2">
          {dataArray.length === 0 ? (
            <p>No chats available</p>
          ) : (
            Array.from(new Set(dataArray.map(msg => msg.receiver))).map((receiver, index) => (
              <Card
                className="p-4 m-4"
                key={index}
                isPressable
                isHoverable
                onClick={() => {
                  console.log(`Chat card clicked: ${receiver}`)
                  setCurrentChat(receiver)
                  getSpecificChat(receiver)
                }}
              >
                <h4 className="font-semibold">{receiver || "No Receiver"}</h4>
              </Card>
            ))
          )}
        </ScrollShadow>
      </aside>
      <main className="fixed h-[100dvh] w-3/4 p-8 right-0 bg-blue-600">
        <h2 className="text-lg text-white font-semibold">{currentChat}</h2>
        <div className="flex justify-center items-center w-full">
          <Input
            className="w-1/2 fixed bottom-20"
            placeholder="Enter a message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Button isIconOnly className="fixed bottom-20 right-24" color="secondary" onClick={addMessage}>
            <SendIcon />
          </Button>
        </div>
        <section className="h-[70%] w-full">
          <ScrollShadow className="h-full w-full">
            {specificChat.map((msg, index) => (
              <Card key={index} className="max-w-[80%] min-w-40 p-4 m-4">
                <div>
                  <h4 className="font-bold my-1">{msg.sender}</h4>
                  <p>{msg.message}</p>
                </div>
              </Card>
            ))}
          </ScrollShadow>
        </section>
      </main>
    </>
  )
}

export default Chats