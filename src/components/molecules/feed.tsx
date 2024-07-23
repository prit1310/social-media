import { Card } from "@nextui-org/react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import NewPostForm from "./newPostForm";
import { useStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

type Post = {
  id: string;
  imageUrl: string;
  user: string;
  title: string;
  description: string;
};

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { loggedIn }: any = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("LoggedIn State:", loggedIn);

    if (!loggedIn) {
      navigate("/login");
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const fetchPostsAndUsers = async () => {
      try {
        const postsQuery = query(collection(db, "posts"));
        const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
          const postsArray: Post[] = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            postsArray.push({
              id: doc.id,
              imageUrl: data.imageUrl ?? "",
              user: data.user ?? "",
              title: data.title ?? "",
              description: data.description ?? "",
            });
          });

          setPosts(postsArray);
        });

        return unsubscribe;
      } catch (error) {
        console.log(error);
      }
    };

    fetchPostsAndUsers();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [loggedIn, navigate]);

  return (
    <main className="p-4">
      <NewPostForm />
      <div className="flex justify-center items-center mt-4 mb-8 md:w-10">
        <img src={logo} alt="InstaBook" className="w-40 h-auto mt-[-60px]" />
      </div>
      <div className="w-full min-h-screen flex flex-col items-center p-4 bg-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-7xl">
          {posts.map((post) => (
            <Card key={post.id} className="w-full p-4 bg-violet-200 shadow-md rounded-lg">
              <div className="rounded-lg overflow-hidden h-56">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <p className="mt-4 text-sm text-gray-500">User: {post.user}</p>
              <p className="mt-2 text-lg font-semibold">Title: {post.title}</p>
              <p className="text-gray-600">Description: {post.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Feed;
