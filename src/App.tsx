import Chat from "./components/molecules/chat"
import Chats from "./components/molecules/chats"
import Feed from "./components/molecules/feed"
import Layout from "./components/molecules/layout"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./components/molecules/login"
import Register from "./components/molecules/register"
import Account from "./components/molecules/account"


function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<Feed />} />
          <Route path="chat" element={<Chats/>}/>
          <Route path="/chat/:chatid" element={<Chat/>}/>
          <Route path="account" element={<Account/>}/>
          </Route>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
        </Routes>
        
      </BrowserRouter>
  )
}

export default App
