import React from "react";
import { Form, Button, Container, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Header from "./Header";
import Config from "../../config/Config.json";
import classes from "./Register.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// import "./src/App.css";
toast.configure();

const ForgotPassValidation = () => {
  const navigate = useNavigate();
  const params = useParams();
  const user_id = params.user_id;
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = Config.TITLE.FORGOT_PASSWORD;
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  // const [msg, setmsg] = useState("No problem!");

  // function update(){
  //   setmsg("Link has been sent to your email.")
  // }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      //forgot password request
      console.log('props.user_id', user_id);
      inputs.user_id = user_id;
      axios
      .post(`${Config.SERVER_URL + "api/users/validatetoken"}`, inputs)
      .then((res) => {
          if(res.data.user_id){
            console.log('message', res.data.message);
            console.log('user_id', res.data.user_id);
            toast.success(
              "Secret token verified successfully!",
              { position: toast.POSITION.TOP_CENTER },
              { autoClose: 5000 }
            );
            navigate(`/Updatepassword/${res.data.user_id}`);
          }
          else{
            toast.error(
              "Invalid secret token!",
              { position: toast.POSITION.TOP_CENTER },
              { autoClose: 5000 }
            );
          }
          
      });
      //end
      
    }
  };

  const validate = () => {
    let isValid = true;
    let error = {};

    if (!inputs["secret_token"]) {
      isValid = false;
      error["secret_token"] = "Please enter secret code.";
    }
    setErrors(error);

    return isValid;
  };
  return (
    <React.Fragment>
      <Header />
      <Container>
        <h1 className=" text-primary mt-5 p-3 text-center rounded">
          Enter scret token sent to your email
        </h1>
        <div
          className="d-flex justify-content-center  align-items-center"
          // style={{ height: "400px " }}
        >
          <Form
            className={`${classes.formContainer} ${classes.formWidth} rounded p-4 p-sm-3`}
          >
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>
                Enter Secret Token <span style={{ color: "red" }}> *</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter secret code"
                name="secret_token"
                value={inputs.secret_token}
                onChange={handleChange}
              />
              <p style={{ color: "red" }}> {errors.secret_token} </p>
            </Form.Group>
            <Col className={classes.actions}>
              <Button
                onClick={handleSubmit}
                // onClick={update}
                variant="success"
                // type="submit"
                className="mt-4 "
              >
                Submit
              </Button>
              {/* <br/> */}
            </Col>
          </Form>
        </div>
        {/* <p className="shadow-sm text-primary mb-5 p-3 text-center rounded">
        {" "}
        No problem.Enter your Email here and we'll send you
        a link to reset it.
      </p> */}
      </Container>
    </React.Fragment>
  );
};

export default ForgotPassValidation;
