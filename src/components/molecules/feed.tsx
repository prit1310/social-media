
import { Card } from "@nextui-org/react"
import NewPostForm from "./newPostForm"
import { useEffect } from "react"
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

const Feed = () => {
  useEffect(()=>{
    const fetchPosts = async () => {
      const q = query(collection(db,"posts"))
      const posts = await getDocs(q);
      posts.docs.map((posts:any)=>{
          console.log("feed:",posts)
      })
    }
    fetchPosts();
  },[]);
    
  return (
    <main className="p-4">
      <NewPostForm></NewPostForm>
      <div className="w-full min-h-screen flex flex-col justify-center items-start p-8 ">
      <div className="grid grid-cols-1 gap-4">
      <Card className="w-64 p-4 bg-violet-200">
        <div className="rounded-lg h-56">
        <img src="https://firebasestorage.googleapis.com/v0/b/social-media1-28ff1.appspot.com/o/posts%2Fphoto1.jpeg?alt=media&token=9cf6fa01-31d1-4433-9158-b4082952389e" alt=""  />
        </div>
        <p>User: Prit Senjaliya</p>
        <p>Title: Photo</p>
        <p>Description:</p>
      </Card>
      </div>
      </div>
    </main>
  )
}

export default Feed
