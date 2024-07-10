import { Card } from "@nextui-org/react";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import NewPostForm from "./newPostForm";

type Post = {
  id: string;
  imageUrl: string;
  user: string;
  title: string;
  description: string;
};

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        const postsQuery = query(collection(db, "posts"));
        const unsubscribe = onSnapshot(postsQuery, async (querySnapshot) => {
          const postsArray: Post[] = [];
          const userNameMap: { [email: string]: string } = {};

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            postsArray.push({
              id: doc.id,
              imageUrl: data.imageUrl ?? "",
              user: data.user ?? "",
              title: data.title ?? "",
              description: data.description ?? "",
            });

            const userEmail = data.user ?? "";
            if (!(userEmail in userNameMap)) {
              userNameMap[userEmail] = "Unknown User";
            }
          });

          setPosts(postsArray);

          const userEmails = Object.keys(userNameMap);

          await Promise.all(userEmails.map(async (email) => {
            const usersQuery = query(collection(db, "users"));
            const userSnapshot = await getDocs(usersQuery);
            if (!userSnapshot.empty) {
              userSnapshot.forEach((userDoc) => {
                const userData = userDoc.data();
                userNameMap[email] = userData.username ?? "Unknown User";
              });
            }
          }));
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching posts or users: ", error);
      }
    };

    fetchPostsAndUsers();
  }, []);



  return (
    <main className="p-4">
      <NewPostForm />
      <div className="w-full min-h-screen flex flex-col justify-center items-start p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-40 ml-10">
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