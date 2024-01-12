import { Routes, Route } from "react-router-dom";

import Register from "./login/Components/RegisterYup";
import ForgotPassword from "./login/Components/ForgotPassword";
import Mdashboard from "./login/Components/Mdashboard";
import ForgotPassValidation from "./login/Components/ForgotPassValidation";
import Updatepassword from "./components/UI/Updatepassword";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Mdashboard />} />

      <Route path="/Login" element={<Mdashboard />} />

      <Route path="/Reset" element={<ForgotPassword />} />

      <Route exact path="/ResetPasswordVerify/:user_id" element={<ForgotPassValidation />} />

      <Route exact path="/Updatepassword/:user_id" element={<Updatepassword />} />

      <Route path="/Register" element={<Register />} />
      {/* <Route path="*" element={<Navigate to="/Login" />} /> */}
    </Routes>
  );
}
export default App;
