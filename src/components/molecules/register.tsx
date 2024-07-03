import { Button, Card, CardFooter, CardHeader, Input} from "@nextui-org/react"
import { useForm} from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {auth} from "../../lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth";

interface LoginFormInterface {
  email:string,
  password:string,
  confirmPassword:string,
}



const Register = () => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<LoginFormInterface>();
  async function onSubmit(values:LoginFormInterface){
    if(values.password === values.confirmPassword){
        createUserWithEmailAndPassword(auth,values.email,values.password).then(()=>{
          navigate("/login")
        })
    }
    else{
      alert('password not same')
    }
      console.log(values)
  }


  return (
    <>
    <div className="flex h-screen justify-center items-center">
      <Card className="w-96 p-8 flex flex-col gap-4">
        <CardHeader><h1 className="text-2xl text-violet-600 font-bold ">Register Here</h1></CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input {...register("email")}
          isRequired
          type="email"
          label="Email"
          defaultValue=""
          className="max-w-xs"
        />
        <Input {...register("password")}
          isRequired
          type="password"
          label="Password"
          defaultValue=""
          className="max-w-xs"
        />
        <Input {...register("confirmPassword")}
          isRequired
          type="password"
          label="Confirm Password"
          defaultValue=""
          className="max-w-xs"
        />
        <Button className="w-full" type="submit" color="secondary">Register</Button>
        </form>
        <CardFooter className="flex justify-center font-bold">
          <Link to="/login" className="underline text-purple-600">Already registered? Login Here</Link>
        </CardFooter>
      </Card>
    </div>
    </>
  )
}

export default Register
