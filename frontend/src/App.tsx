import { Route, Routes } from "react-router-dom";
import Navbar from "./components/nav-bar/Navbar";
import Home from "./components/home-page/nav-bar/Home";
import Login from "./components/login-page/Login";
import SignUp from "./components/signup-page/SignUp";
import { UserContextProvider } from "./components/contexts/userContext";


function App() {

  return (
    <div className="App" style={AppStyle}>
      {UserContextProvider(
        <Routes>
            <Route path="/" element={<Navbar />}>
              <Route index element={<Home />} />
              <Route path="about" element={<Home />} />
              <Route path="services" element={<Home />} />
              <Route path="gallery" element={<Home />} />
              <Route path="contact" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
            </Route>
          </Routes>
        )}
    </div>
  );
}

export default App;

const AppStyle = {
  height: "100vh",
  width: "100vw",
}
