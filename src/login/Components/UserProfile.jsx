// import axios from "axios";
import { Field, Form, Formik } from "formik";
import { TextField, SelectInput } from "../../Job Provider/Components/AddJob/FormTypes";
import { useEffect } from "react";
import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Container, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Config from "../../config/Config.json";
import Header from "./Header";
import classes from "./Register.module.css";
import SpinnerComponent from "../../components/UI/SpinnerComponent";
import { useParams } from "react-router-dom";
import Navigation from "../../components/navigation/Navigation";
import { useLocation } from "react-router-dom";
import ReactModal from "../../components/UI/ReactModal";
import { useDispatch } from "react-redux";

const UserProfile = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = location.state;
  console.log("state", location.state);
  
  const user_id = userData.user_id;
  console.log('user_id',user_id);

  const [showSpinner, setShowSpinner] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);
  //const [user, setUser] = useState("");
  const navigate = useNavigate();

  let initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    role_name: "",
  };

  /*
  useEffect(() => {
    console.log("inside useEffect function");
    axios
      .get(`${Config.SERVER_URL + "api/users/" + user_id}`)
      .then((response) => {
        console.log('response', response.data);
        setUser(response.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  */
  
  if (userData) {
    initialValues = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      role_name: userData.role_name,
    };
  }

  const deleteModalHandler = () => {
    console.log("inside deleteModalHandler");
    setDeleteModal(true);
  };
  
  const handleDelete = (userId) =>{
    setDeleteModal(false);
    console.log("inside handleDelete method");
    console.log(userId);
    axios
      .delete(`${Config.SERVER_URL + "api/users/" + user_id}`)
      .then((res) => {
        setShowSpinner(false);
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch({ type: "CLEARAUTHTOKEN" });
        navigate("/", { replace: true });
      })
      .catch((err) => {
        setShowSpinner(false);
        toast.error("Oops something went wrong", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log('errors', err);
      });
  };

  const formSubmitHandler = (values, setSubmitting) => {
    setShowSpinner(true);
    //console.log('incoming values', values);
    axios
      .put(`${Config.SERVER_URL + "api/users/" + user_id}`, { ...values })
      .then((res) => {
        console.log(res.data.message);
        setShowSpinner(false);
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        /* navigate("/login", { replace: true }); */
      })
      .catch((err) => {
        setShowSpinner(false);
        toast.error("Oops something went wrong", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log('errors', err);
      });
  };
  // const history = useHistory();
  return (
    <React.Fragment>
       <Navigation />
      <Header />
      <Container>
        <h1 className="p-3 text-center rounded" style={{ color: "#2c49ed" }}>
          User Details
        </h1>
        {showSpinner && <SpinnerComponent />}
        <Row className="mb-5">
          <Col
            lg={7}
            md={6}
            sm={12}
            className={`${classes.formContainer} p-5 m-auto shadow-sm rounded-lg`}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                first_name: Yup.string()
                  .min(4, "First Name should be more than 4 characters")
                  .max(25, "First Name should be less than 25 characters")
                  .required("First Name is a required field"),
                last_name: Yup.string()
                  .min(4, "Last Name should be more than 4 characters")
                  .max(25, "Last Name should be less than 25 characters")
                  .required("Last Name is a required field"),
                email: Yup.string()
                  .email("Invalid email address")
                  .required("Email is a required field"),
                role_name: Yup.string(),
              })}
              onSubmit={(values, { setSubmitting }) => {
                const editedValues = { ...values };
                formSubmitHandler(editedValues, setSubmitting, this);
              }}
            >
              {(formik) => (
                <div className={classes.main}>
                  <Container>
                  <Form>
                    <div>
                      <Row>
                       <Col><TextField label="First Name" name="first_name" type="text"/></Col>
                      </Row>
                      
                      <Row>
                      <Col><TextField label="Last Name" name="last_name" type="text" /></Col>
                      </Row>
                      
                      <Row>
                      <Col><TextField label="Email" name="email" type="email" /></Col>
                      </Row>
                      
                      <Row>
                        <Col>
                          <SelectInput label="Role " name="role_name" disabled={true}>
                            <option value="">Select</option>
                            <option value="cyber_security_expert">
                              Cyber Security Expert
                            </option>
                            <option value="ngo">NGO</option>
                            { userData.role_name == "admin" ? <option value="admin">Admin</option> : "" }
                          </SelectInput>
                        </Col>
                      </Row>
                    </div>
                    
                    <Row>
                    <Col>
                    <Button variant="success" type="submit" className="mt-4 " >
                      Update
                    </Button>
                    </Col>
                    
                    <Col>
                    <Button variant="danger" type="submit" className="mt-4 " onClick={() => {deleteModalHandler();}}>
                      Delete
                    </Button>
                    </Col>
                    
                    </Row>
                          {/* DELETE MODAL */}
                          <ReactModal
                            show={showDeleteModal}
                            isDelete={true}
                            onOk={() => {
                              handleDelete(userData.user_id);
                            }}
                            onHide={() => {
                              setDeleteModal(false);
                            }}
                          >
                            {{ title: "Delete User", body: <h1>Are you sure?</h1> }}
                          </ReactModal>
                  </Form>
                  </Container>
                </div>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default UserProfile;
