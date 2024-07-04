import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure ,Input} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import {ref,uploadBytes} from "firebase/storage"
import { bucket } from "../../lib/firebase";


export default function newPostForm() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { register, handleSubmit } = useForm();
  const storageRef = ref(bucket, 'posts/post1');

  async function onSubmit(values:any) {
    uploadBytes(storageRef, values.image).then(() => {
        console.log('Uploaded a blob or file!');
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
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <ModalBody>
                <Input {...register("image")}
                  autoFocus
                  type="file"
                  accept=".jpeg"
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
