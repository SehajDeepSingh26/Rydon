import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home.jsx"
import UserLogin from "./pages/UserLogin"
import UserSignup from "./pages/UserSignup"
import CaptainLogin from "./pages/CaptainLogin"
import CaptainSignup from "./pages/CaptainSignup"
import Start from "./pages/Start.jsx"
import Logout from "./pages/Logout.jsx"
import CaptainHome from "./pages/CaptainHome.jsx"
import Riding from "./pages/Riding.jsx"
import UserProtectorWrapper from "./utils/UserProtectorWrapper.jsx"
import CaptainProtector from "./utils/captainProtector.jsx"
import Error from "./pages/Error.jsx"
import CaptainRiding from "./pages/CaptainRiding.jsx"

function App() {
    
    //^ Session TimeOut
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');
    if(now-setupTime > 8*60*60*1000 && localStorage.getItem("token") !== null) {
        localStorage.clear()
        console.error("Session Timeed Out, Please Login Again !!")
        
        // location.reload(true);
    }

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
                    <CaptainProtector>
                        <CaptainHome />
                    </CaptainProtector>
                } />
                <Route path='/logout' element={
                    <Logout />
                } />
                <Route path='/riding' element={
                    <UserProtectorWrapper>
                        <Riding />
                    </UserProtectorWrapper>
                } />
                <Route path='/captain-riding' element={
                    <CaptainProtector>
                        <CaptainRiding />
                    </CaptainProtector>
                } />


                <Route
                    path="*"
                    element={<Error />}
                />
            </Routes>

        </div>
    )
}

export default App
