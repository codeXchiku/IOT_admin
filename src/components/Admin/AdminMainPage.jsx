import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SideBar from "./Sidebar/SideBar";
import Footer from "./footer/Footer";
import Usernotification from "./Usernotification";
import Createduser from "../Admin/createduser/Createduser";
import Devicetypecreate from "./devicetype/Devicetypecreate";
import Ocr from "./Ocr";
import Thermal from "./Thermal";
import UserAccounts from "./createduser/UserAccounts";
import UseraccountDevices from "./createduser/UseraccountDevices";
import NgxDynamic from "./createduser/NgxDynamic";
import Deviceassignctrl from "./devicetype/Deviceassignctrl";
import ResearchAndDev from "./ResearchAndDev";
import Maintenance from "./Maintenance";

const AdminMainPage = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const mobno = urlParams.get("mono");
  useEffect(() => {
    if (mobno) {
      localStorage.setItem("admin_id", mobno);
      navigate("/adminside/usernotification");
    }
  }, [mobno, navigate]);

  return (
    <div>
      <SideBar />

      <Routes>
        <Route path="/usernotification" element={<Usernotification />} />
        <Route path="/createduser" element={<Createduser />} />
        <Route
          path="/createduser/useraccounts/:mob"
          element={<UserAccounts />}
        />
        <Route
          path="/createduser/useraccounts/UseraccountDevices/:accountid"
          element={<UseraccountDevices />}
        />
        <Route
          path="/createduser/useraccounts/UseraccountDevices/ngxdynamics"
          element={<NgxDynamic />}
        />
        <Route path="/devicetypecreate" element={<Devicetypecreate />} />
        <Route
          path="/devicetypecreate/deviceassignctrls/:devicename/:version"
          element={<Deviceassignctrl />}
        />
        <Route
          path="/createduser/useraccounts/UseraccountDevices/ngxdynamics/:accountid/:deviceType/:deviceId"
          element={<NgxDynamic />}
        />
        <Route path="/ocr" element={<Ocr />} />
        <Route path="/thermal" element={<Thermal />} />
        <Route path="/researchAndDev" element={<ResearchAndDev/>}/>
        <Route path="/maintenance" element={<Maintenance/>}/>
      </Routes>

      <Footer />
    </div>
  );
};

export default AdminMainPage;
