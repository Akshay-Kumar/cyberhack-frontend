import { React, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { Link, useNavigate, NavLink } from "react-router-dom";
import classes from "./Navigation.module.css";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "../../config/Config.json";
import { toast, ToastContainer } from "react-toastify";

const Navigation = () => {
  // const selectauthToken = (rootstate) => rootstate.authToken;
  // const authToken = useSelector(selectauthToken);
  // console.log(authToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authToken = localStorage.getItem("token");
  const redAuthToken = jwtDecode(authToken);

  const logoutHandler = () => {
    dispatch({ type: "CLEARAUTHTOKEN" });
    navigate("/", { replace: true });
  };

  /*
  const deleteAccountHandler = () => {
    //delete account code
    const user_id = redAuthToken.user_id;
    axios
      .delete(
        `${Config.SERVER_URL + "api/users/" + user_id}`)
      .then((result) => {
        console.log(result);
        toast.success(result.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Oops something went wrong");
      });
    
    // clear token and go to login page
    dispatch({ type: "CLEARAUTHTOKEN" });
    navigate("/", { replace: true });
  };
  */

  const userAccountHandler = () => {
    //fetch user details code
    const user_id = redAuthToken.user_id;
    axios
      .get(
        `${Config.SERVER_URL + "api/users/" + user_id}`)
      .then((result) => {
        console.log("userInfo", result);
        toast.success(result.data.message);
        navigate("/UserProfile", {state: result.data.user});
      })
      .catch((err) => {
        console.log(err);
        toast.error("Oops something went wrong");
      });
  };

  return (
    <Navbar
      fixed="top"
      variant="dark"
      expand="md"
      bg="primary"
      className={classes.nav}
    >
      <Container fluid>
        {/* <Navbar.Brand href="/dashboard" className={classes.brand}>
          Job Hunt
        </Navbar.Brand> */}

        <NavLink
          // activeClassName={classes.active}
          className={classes.brand}
          to="/dashboard"
        >
          <span className={classes.logo}>
            <i className="bi bi-search"></i>
          </span>
          CYBERHACK
        </NavLink>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
          {redAuthToken.role_name === "admin" && (
            <Nav className={`me-auto ${classes.pageLinks}`}>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/manage-users"
              >
                Users
              </NavLink>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/manage-jobs"
              >
                Jobs
              </NavLink>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/reports"
              >
                Reports
              </NavLink>
            </Nav>
          )}
          {redAuthToken.role_name === "ngo" && (
            <Nav className={`me-auto ${classes.pageLinks}`}>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/manage-applicants"
              >
                Applicant
              </NavLink>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/manage-jobs"
              >
                Jobs
              </NavLink>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/provider-report"
              >
                Reports
              </NavLink>
            </Nav>
          )}
          {redAuthToken.role_name === "cyber_security_expert" && (
            <Nav className={`me-auto ${classes.pageLinks}`}>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/dashboard"
              >
                Apply
              </NavLink>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/appliedJobs"
              >
                Applied Jobs
              </NavLink>
              {/* <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/ProviderReport"
                onClick={(event) => event.preventDefault()}
              >
                Reports
              </NavLink> */}
            </Nav>
          )}
          <Nav>
            {
            /*
              <NavDropdown
              id="nav-dropdown-dark-example"
              title={
                <span className={classes.username}>
                  <span className={classes.userLogo}>
                    <i className="bi bi-person-circle"></i>
                  </span>
                  {authToken.username}
                </span>
              }
              menuVariant="light"
              align="end"
              className={classes.user}
              as={"button"}
            >
              <NavDropdown.Item>
                <NavLink
                  className={classes.changePassword}
                  to="/change-password"
                >
                  Change Password
                </NavLink>
              </NavDropdown.Item>
              <NavDropdown.Divider />

              <Dropdown.Item href="/login">Logout</Dropdown.Item>
            </NavDropdown>
          </Nav> */}
            <Dropdown align={"end"} className={classes.dropDown}>
              <Dropdown.Toggle className={classes.user}>
                <span className={classes.username}>
                  <span className={classes.userLogo}>
                    <i className="bi bi-person-circle"></i>
                  </span>
                  {redAuthToken.first_name}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Link to="/change-password" className={classes.changePassword}>
                  Change Password
                </Link>
                <Dropdown.Divider />
                {
                  /*
                    <Dropdown.Item
                      as={"button"}
                      onClick={deleteAccountHandler}
                      className={classes.changePassword}
                    >
                      Delete account
                    </Dropdown.Item>
                    <Dropdown.Divider />
                  */
                }
                <Dropdown.Item
                  as={"button"}
                  onClick={userAccountHandler}
                  className={classes.changePassword}
                >
                  Manage User account
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  as={"button"}
                  onClick={logoutHandler}
                  className={classes.changePassword}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
