import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, bucket, db } from "../../lib/firebase"; 
import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";

export default function NewPostForm() {
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const { register, handleSubmit, reset } = useForm();
  const [file, setFile] = useState<File | null>(null);
  const currentUser = auth.currentUser;

  const onSubmit = async (values: any) => {
    if (!values.image[0]) return; // Ensure file is selected

    const timestamp = new Date().getTime();
    const selectedFile = values.image[0];
    const filename = `${selectedFile.name}_${timestamp}`;
    setFile(selectedFile); 

    const storageRef = ref(bucket, `posts/${filename}`);

    try {
      const snapshot = await uploadBytes(storageRef, selectedFile);
      console.log('Uploaded a blob or file!', snapshot);

      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL:', downloadURL);
      window.alert('File uploaded successfully!');
      onClose(); 

      if (currentUser) {
        await addDoc(collection(db, "posts"), {
          user: currentUser.email,
          title: values.title,
          description: values.description,
          imageUrl: downloadURL,
        });
      }
      reset();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  useEffect(() => {
    if (file) {
      const postRef = ref(bucket, `posts/${file.name}`);
      getDownloadURL(postRef)
        .then((url) => {
          console.log('Download URL:', url);
        })
        .catch((error) => {
          console.error('Error retrieving download URL:', error);
        });
    }
  }, [file]); 

  return (
    <>
       <Button 
        onClick={onOpen} 
        color="primary" 
        className="w-24 sm:w-32 md:w-auto"
      >
        Add Post
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent className="w-full max-w-lg sm:max-w-md">
          <ModalHeader className="text-center">Add Post</ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
            <ModalBody>
              <Input
                {...register("image")}
                type="file"
                accept="image/*"
                placeholder="Upload your image"
                variant="bordered"
                className="w-full"
              />
              <Input
                {...register("title")}
                type="text"
                label="Title"
                placeholder="Write a title here"
                variant="bordered"
                className="w-full"
              />
              <Input
                {...register("description")}
                type="text"
                label="Description"
                placeholder="Write a description here"
                variant="bordered"
                className="w-full"
              />
            </ModalBody>
            <Button color="primary" type="submit" className="w-full">
              Upload
            </Button>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
