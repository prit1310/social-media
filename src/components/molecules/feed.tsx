import { bucket } from "../../lib/firebase"

import {ref,getDownloadURL} from "firebase/storage"
import NewPostForm from "./newPostForm"

const Feed = () => {

  const postRef = ref(bucket,'posts/post1')
  getDownloadURL(postRef).then((url)=>console.log(url))
  return (
    <main className="p-4">
      <NewPostForm></NewPostForm>
    </main>
  )
}

export default Feed
