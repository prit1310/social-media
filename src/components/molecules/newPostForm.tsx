import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { bucket } from "../../lib/firebase"; 
import { useEffect, useState } from "react";

export default function NewPostForm() {
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const { register, handleSubmit } = useForm();
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState("");

  const onSubmit = async (values:any) => {
    const selectedFile = values.image[0];
    setFile(selectedFile.name); 

    const storageRef = ref(bucket, `posts/${selectedFile.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, selectedFile);
      console.log('Uploaded a blob or file!', snapshot);

      const downloadURL:any = await getDownloadURL(storageRef);
      console.log('Download URL:', downloadURL);
      setImgUrl(downloadURL); 
      window.alert('File uploaded successfully!');
      onClose(); 
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  useEffect(() => {
    if (file) {
      const storageRef = ref(bucket, `posts/${file}`);
      getDownloadURL(storageRef)
        .then((url:any) => {
          console.log('Download URL:', url);
          setImgUrl(url); 
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
            </ModalBody>
            <Button color="primary" type="submit">
              Upload
            </Button>
          </form>
        </ModalContent>
      </Modal>
      {imgUrl && <img src={imgUrl} alt="" className="h-2/3 mx-auto my-auto absolute inset-0" />}
    </>
  );
}
