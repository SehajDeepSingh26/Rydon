import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home.jsx"
import UserLogin from "./pages/UserLogin"
import UserSignup from "./pages/UserSignup"
import CaptainLogin from "./pages/CaptainLogin"
import CaptainSignup from "./pages/CaptainSignup"
import Start from "./pages/Start.jsx"
import UserProtectorWrapper from "./pages/UserProtectorWrapper.jsx"
import Logout from "./pages/Logout.jsx"
import CaptainHome from "./pages/CaptainHome.jsx"

function App() {

    return (
        <div>
            <Routes>
                <Route path='/' element={<Start />} />
                <Route path='/login' element={<UserLogin />} />
                <Route path='/signup' element={<UserSignup />} />
                <Route path='/captain-login' element={<CaptainLogin />} />
                <Route path='/captain-signup' element={<CaptainSignup />} />
                <Route path='/home' element={
                    <UserProtectorWrapper>
                        <Home />
                    </UserProtectorWrapper>
                } />
                <Route path='/captain-home' element={
                    <UserProtectorWrapper>
                        <CaptainHome />
                    </UserProtectorWrapper>
                } />
                <Route path='/logout' element={
                    <UserProtectorWrapper>
                        <Logout />
                    </UserProtectorWrapper>
                } />
            </Routes>
        </div>
    )
}

export default App
