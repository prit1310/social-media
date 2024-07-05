import { Button } from "@nextui-org/button"
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react"
import {Input} from "@nextui-org/input"
import { useForm } from "react-hook-form"
import { ref, set ,get,child} from "firebase/database";
import { db ,auth} from "../../lib/firebase"

const Account = () => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { register, handleSubmit } = useForm();

  async function onSubmit(values:any) {
    set(ref(db, 'users/' + auth.currentUser?.uid), {
      username: values.name,
      bio:values.bio,
    });
    console.log(values)
  }
  get(child(ref(db), `users/${auth.currentUser?.uid}`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  
  return (
    <>
      <h1>Name:</h1>
      <h1>Bio:</h1>
      <p>Profile image:</p>

      <Button onPress={onOpen} color="primary">Update profile</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Update profile</ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <ModalBody>
                  <Input {...register("name")}
                    autoFocus
                    type="text"
                    label="Name:"
                    placeholder="Enter your name:"
                    variant="bordered"
                  />
                  <Input {...register("bio")}
                    autoFocus
                    type="text"
                    label="Bio:"
                    placeholder="Enter your bio:"
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
  )
}

export default Account
