import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Form as BootStrapForm, Button } from "react-bootstrap";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import classes from "./Updatepassword.module.css";
import "react-toastify/dist/ReactToastify.css";
import Config from "../../config/Config.json";
import jwtDecode from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <BootStrapForm.Group className={`${classes.formBox} mb-2`}>
        <BootStrapForm.Label htmlFor={props.id || props.name}>
          {label}
        </BootStrapForm.Label>
        <BootStrapForm.Control
          className={meta.touched && meta.error && "invalid"}
          {...field}
          {...props}
        />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </BootStrapForm.Group>
      {/* <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null} */}
    </>
  );
};

const Updatepassword = () => {
  const navigate = useNavigate();
  const params = useParams();
  const user_id = params.user_id;
  console.log('user_id',user_id);
  return (
    <>
      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
          passwordConfirmation: "",
        }}
        validationSchema={Yup.object({
          newPassword: Yup.string()
            .required("New Password Required"),
          passwordConfirmation: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Password mismatch")
            .required("Confirm New Password Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 400);
          values.user_id = user_id;
          axios
            .post(`${Config.SERVER_URL + "api/users/updatepassword" }`,values)
            .then((res) => {
              console.log('resposne', res.data);
              //props.onEdit(res.data.user);
              toast.success(res.data.message, {
                position: "bottom-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              navigate("/", { replace: true });
            })
            .catch((err) => console.log(err));
        }}
      >
        <Form>
          <div className={classes.formContainer}>
            <h4 className="text-center text-primary">Change Password!</h4>

            <MyTextInput
              label="New Password"
              name="newPassword"
              type="password"
              id="newPassword"
            />
            <MyTextInput
              label="Confirm New Password"
              name="passwordConfirmation"
              type="password"
              id="confirmPassword"
            />
            <Button type="submit">Submit</Button>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default Updatepassword;
