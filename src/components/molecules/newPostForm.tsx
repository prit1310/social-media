import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { bucket } from "../../lib/firebase";


export default function newPostForm() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const postRef = ref(bucket, 'posts/post3.jpeg')
  getDownloadURL(postRef).then((url) => console.log(url)).catch((error)=>console.log(error))

  const storageRef = ref(bucket, 'posts/post3.jpeg');

  async function onSubmit(values: any) {
    uploadBytes(storageRef, values.image[0]).then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot);
    }).catch((error)=>{
      console.log(error)
    });
  }

  return (
    <>
      <Button onPress={onOpen} color="primary">Add Post</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Post</ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <ModalBody>
                  <Input {...register("image")}
                    autoFocus
                    type="file"
                    accept="image/*"
                    placeholder="Upload your image"
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
