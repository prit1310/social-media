import { Button } from "@nextui-org/button";
import { Card, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { db, auth, bucket } from "../../lib/firebase";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type Post = {
  id: string;
  imageUrl: string;
  user: string;
  title: string;
  description: string;
};

const Account = () => {
  const [imgUrl, setImgUrl] = useState("");
  const [postsCount, setPostsCount] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [userData, setUserData] = useState({ bio: "", username: "" });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, `users/${auth.currentUser?.email}`));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserData({
            username: userData.username,
            bio: userData.bio
          });

          const profilePicDoc = await getDoc(doc(db, `profilePics/${auth.currentUser?.email}`));
          if (profilePicDoc.exists()) {
            setImgUrl(profilePicDoc.data().imageUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  async function onSubmit(values: any) {
    const timestamp = new Date().getTime();
    const selectedFile = values.image[0];
    const filename: any = selectedFile.name + timestamp.toString();
    const storageRef = ref(bucket, `profilePic/${filename}`);
    try {
      await setDoc(doc(db, `users/${auth.currentUser?.email}`), {
        username: values.name,
        bio: values.bio,
      });
      console.log("profile updated...");
      setUserData({ username: values.name, bio: values.bio });
      onOpenChange();

      const snapshot = await uploadBytes(storageRef, selectedFile);
      console.log('Uploaded a blob or file!', snapshot);

      const downloadURL: any = await getDownloadURL(storageRef);
      setImgUrl(downloadURL);
      console.log('Download URL:', downloadURL);
      window.alert('File uploaded successfully!');
      onClose();
      if (auth.currentUser) {
        await setDoc(doc(db, `profilePics/${auth.currentUser?.email}`), {
          user: auth.currentUser.email,
          imageUrl: downloadURL,
        });
      }
      reset();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        if (!auth.currentUser) return;

        const postsQuery = query(collection(db, "posts"), where("user", "==", auth.currentUser.email));
        const unsubscribe = onSnapshot(postsQuery, async (querySnapshot) => {
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
          setPostsCount(postsArray.length);
        });

        return unsubscribe;
      } catch (error) {
        console.log(error);
      }
    };
    fetchPostsAndUsers();
  }, []);

  return (
    <>
      <div className="bg-black text-white p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <p className="mb-4 md:mb-0">
            <img src={imgUrl} className="rounded-full h-20 w-20 object-cover" />
          </p>
          <div className="ml-0 md:ml-4">
            <h1 className="font-semibold text-lg md:text-xl">Posts: {postsCount}</h1>
            <h1 className="font-bold text-lg md:text-xl mt-2">{auth.currentUser?.email}</h1>
            <h1 className="font-bold text-lg md:text-xl mt-2">{userData.username}</h1>
            <h1 className="font-semibold text-sm md:text-lg mt-2">{`Bio:${userData.bio}`}</h1>
            <Button onPress={onOpen} color="primary" className="mt-4">
              Update profile
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full min-h-screen flex flex-col items-center p-4 bg-gray-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <p className="mt-2 text-md font-semibold">Title: {post.title}</p>
              <p className="text-gray-600">Description: {post.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2 text-lg font-semibold">Update profile</ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <ModalBody>
                  <Input {...register("name")} type="text" label="Name:" placeholder="Enter your name:" variant="bordered" />
                  <Input {...register("bio")} type="text" label="Bio:" placeholder="Enter your bio:" variant="bordered" />
                  <Input
                    {...register("image")}
                    type="file"
                    accept="image/*"
                    placeholder="Upload your profile image:"
                    variant="bordered"
                  />
                </ModalBody>
                <Button color="primary" onPress={onClose} type="submit">
                  Upload
                </Button>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Account;
