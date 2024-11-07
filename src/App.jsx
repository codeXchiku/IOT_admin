import './App.css';
import AdminMainPage from "./components/Admin/AdminMainPage";
import Usersmainpage from "./components/User/Usersmainpage";
import User from "./components/User/Users";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createContext, useState } from "react";
import {  LoadScript} from "@react-google-maps/api";
import DeviceLocation from './components/DeviceLocation';

export const AdminContext = createContext();

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalregisterduser,settotalRegestereduser]=useState(0);

  return (
    <Router>
      <AdminContext.Provider value={{ isSidebarOpen, setIsSidebarOpen ,totalregisterduser,settotalRegestereduser}}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_Google_map_Api}>
          <Routes>
            <Route path="/adminside/*" element={<AdminMainPage />} />

            <Route path="/users/*" element={<User />} />
            <Route path="/users/userpage" element={<Usersmainpage />} />
            <Route path='/devicelocation/:id/' element={<DeviceLocation/>}/>
          </Routes>
   
        </LoadScript>
      </AdminContext.Provider>
    </Router>
  );
}

export default App;


