import { Button, Card, Input, ScrollShadow } from "@nextui-org/react"
import { SendIcon } from "lucide-react"
import { useState } from "react"
import { db,auth } from "../../lib/firebase"
import { collection,addDoc,query,where,getDocs} from "firebase/firestore"

const Chats = () => {
  const [message, setMessage] = useState("")
  async function addMessage() {
    const messageRef = collection(db,"chats")
    if(auth.currentUser){
    await addDoc(messageRef,{
      message: message,
      sender:auth.currentUser?.email,
      reciever: "pritpatel1310@gmail.com"
    })
    setMessage("")
    }
    else{
      console.error("You are not logged in")
    }
  }
  async function getMessages(){
    if(auth.currentUser){
    const q = query(collection(db,"chats"),where("sender","==",auth.currentUser.email),where("reciever","==","pritpatel1310@gmail.com"))
    getDocs(q).then((querySnapShot)=>{
      querySnapShot.forEach((doc)=>{
        console.log(doc.data())
      })
    }).catch((e)=>console.error(e))
    }
    else{
      console.error('sign in')
    }
  }
  getMessages()

  return (
    <>
      <aside className="fixed  left-0 w-1/4 bg-purple-300 py-8 px-4">
        <h1 className="text-2xl font-bold my-4">Chats</h1>
        <ScrollShadow className="h-screen w-full  px-2">
          <Card className="p-4 m-4">
            <h4 className="font-semibold">User Name</h4>
          </Card>
        </ScrollShadow>
      </aside>
      <main className="fixed h-[100dvh] w-3/4 p-8 right-0 bg-blue-600">
        <h2 className="text-lg text-white font-semibold">User Name</h2>
        <div className="flex justify-center items-center w-full">
          <Input className="w-1/2 fixed bottom-20"
            placeholder="Enter a message"
            onChange={(e) => {
              { setMessage(e.target.value) }
            }
            }
          />
          <Button isIconOnly className="fixed bottom-20 right-24" onClick={addMessage}>
            <SendIcon></SendIcon>
          </Button>
        </div>
        <section className="h-[70%] w-full">
          <ScrollShadow className="h-full w-full">
            <Card className="max-w-[80%] min-w-40 p-4 ">
              <h4 className="font-bold my-1">User</h4>
              <p>Hello!!</p>
            </Card>
          </ScrollShadow>
        </section>
      </main>
    </>
  )
}

export default Chats