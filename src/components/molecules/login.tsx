import { Button, Card, CardFooter, CardHeader, Input } from "@nextui-org/react"
import { useForm} from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {auth} from "../../lib/firebase"
import {signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup} from "firebase/auth"

interface LoginFormInterface {
  email:string,
  password:string,
}

const provider = new GoogleAuthProvider();

const Login = () => {

  const { register, handleSubmit } = useForm<LoginFormInterface>();
  const navigate = useNavigate()
  async function onSubmit(values:LoginFormInterface){
      signInWithEmailAndPassword(auth,values.email,values.password).then(
        ()=>{
            navigate("/")
        }
      )
      console.log(values)
  }
  async function signInWithGoogle(){
     signInWithPopup(auth,provider).then(
      ()=>{
        navigate("/")
      }
     )
  }

  return (
    <>
    <div className="flex h-screen justify-center items-center">
      <Card className="w-96 p-8 flex flex-col gap-4">
        <CardHeader><h1 className="text-2xl text-violet-600 font-bold ">Login Here</h1></CardHeader>
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
        <Button className="w-full" type="submit"   color="secondary">Login</Button>
        <Button color="primary" onClick={signInWithGoogle}>Sign In With Google</Button>
        </form>
        <CardFooter className="flex justify-center font-bold">
          <Link to="/register" className="underline text-purple-600"> New Here? Create an account</Link>
        </CardFooter>
      </Card>
    </div>
    </>
  )
}

export default Login
