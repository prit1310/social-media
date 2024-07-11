import { Button, Card, Input, ScrollShadow } from "@nextui-org/react"
import { SendIcon } from "lucide-react"

const Chats = () => {

  return (
    <>
    <aside className="fixed  left-0 w-1/4 bg-purple-300 py-8 px-4">
    <h1 className="text-2xl font-bold my-4">Chats</h1>
      <ScrollShadow className="h-screen w-full  px-2">
        <Card className="p-4 m-4">
          <h4 className="font-semibold">User Name</h4>
          <p className="font-light">how are you...</p>
        </Card>
       </ScrollShadow>
    </aside>
    <main className="fixed h-[100dvh] w-3/4 p-8 right-0 bg-blue-600">
      <h2 className="text-lg text-white font-semibold">User Name</h2>
      <Input className="w-1/2 fixed bottom-20"
        placeholder="Enter a message"
      />
      <Button isIconOnly className="fixed bottom-20 right-64">
        <SendIcon></SendIcon>
      </Button>
    </main>
    </>
  )
}

export default Chats
