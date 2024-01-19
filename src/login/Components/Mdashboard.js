import { useSelector } from "react-redux";
import AdminScreen from "../../AdminScreen";
import Login from "./Login";
import ProviderScreen from "../../ProviderScreen";
import JobSeekerScreen from "../../JobSeekerScreen";
import jwtDecode from "jwt-decode";

function Mdashboard() {
  // const dispatch = useDispatch();
  console.log("inside Mdashboard");
  const authToken = localStorage.getItem("token");

  console.log("authToken", authToken);


  // if(redToken == {}){
  //   if(authToken){
  //     dispatch({type:"SETAUTHTOKEN",data:authToken});
  //   }
  // }

  // if (authToken !== null && redAuthToken == {}) {
  //   dispatch({ type: "SETAUTHTOKEN", data: authToken });
  // }

  if (authToken !== "undefined" && authToken !== null && authToken !== undefined) {
    console.log("inside if block", authToken);
    const redAuthToken = jwtDecode(authToken);
    // console.log("lol", decoded);
    if (redAuthToken.role_name === "admin") {
      return <AdminScreen />;
    }
    if (redAuthToken.role_name === "ngo") {
      return <ProviderScreen />;
    }
    if (redAuthToken.role_name === "cyber_security_expert") {
      return <JobSeekerScreen />;
    }
  }
  return (
      <Login />
  );
}

export default Mdashboard;
