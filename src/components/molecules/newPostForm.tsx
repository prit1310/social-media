import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, bucket,db } from "../../lib/firebase"; 
import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";

export default function NewPostForm() {
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const { register, handleSubmit,reset } = useForm();
  const [file, setFile] = useState(null);
  const currentUser:any = auth.currentUser;

  const onSubmit = async (values:any) => {
    const selectedFile = values.image[0];
    const  filename = selectedFile.name
    setFile(filename); 

    const storageRef = ref(bucket, `posts/${filename}`);

    try {
      const snapshot = await uploadBytes(storageRef, selectedFile);
      console.log('Uploaded a blob or file!', snapshot);

      const downloadURL:any = await getDownloadURL(storageRef);
      console.log('Download URL:', downloadURL);
      window.alert('File uploaded successfully!');
      onClose(); 

      await addDoc(collection(db,"posts"),{
        user: currentUser.email,
        title:values.title,
        description:values.description,
        imageUrl:downloadURL,
      });
      reset()
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  useEffect(() => {
    if (file) {
      const postRef = ref(bucket, `posts/${file}`);
      getDownloadURL(postRef)
        .then((url:any) => {
          console.log('Download URL:', url);
        })
        .catch((error) => {
          console.error('Error retrieving download URL:', error);
        });
    }
  }, [file]); 

  return (
    <>
      <Button onClick={onOpen} color="primary">
        Add Post
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader>Add Post</ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <ModalBody>
              <Input
                {...register("image")}
                autoFocus
                type="file"
                accept="image/*"
                placeholder="Upload your image"
                variant="bordered"
              />
               <Input
                {...register("title")}
                autoFocus
                type="text"
                label="Title"
                placeholder="Write a title here"
                variant="bordered"
              />
              <Input
                {...register("description")}
                autoFocus
                type="text"
                label="Description"
                placeholder="Write a description here"
                variant="bordered"
              />
            </ModalBody>
            <Button color="primary" type="submit">
              Upload
            </Button>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}