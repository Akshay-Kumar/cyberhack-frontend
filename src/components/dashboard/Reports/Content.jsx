import React from "react";
import {
  FormGroup,
  FormControl,
  Col,
  Row,
  Table,
  Container,
  FormLabel,
} from "react-bootstrap";
import classes from "./Content.module.css";
import { useState, useEffect } from "react";
import useTable from "../../../hooks/useTable";
import TableFooter from "../Tables/TableFooter";
import { CSVLink } from "react-csv";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Config from "../../../config/Config.json";
// import dateFormat from 'dateformat';

function Reports() {
  const [reportsData, setReportsData] = useState([]);

  const [page, setPage] = useState(1);
  const { slice, range } = useTable(reportsData, page, 5);

  const [forminputs, setFormInputs] = useState({});
  const setFilterDates = useState({
    start_date: "",
    end_date: "",
  })[1];

  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    /*
    const readAuthToken = jwtDecode(token);
    const user_id = readAuthToken.user_id;
    */
    console.log('trying to fetch jobs data');
    axios
      .get(`${Config.SERVER_URL + "api/users/jobs"}`)
      .then((res) => {
        console.log('jobsData', res.data);
        setReportsData([...res.data.jobs]);
      });
  }, []);

  const validateStart = () => {
    let error = "";
    if (!forminputs["start_date"] && forminputs["end_date"]) {
      error = "please enter start date";
    }
    if (!forminputs["start_date"] && !forminputs["end_date"]) {
      setErrors({});
    }
    setErrors((values) => ({ ...values, start_date: error }));
  };

  const validateEnd = () => {
    let error = "";
    if (!forminputs["end_date"] && forminputs["start_date"]) {
      error = "please enter end date";
    }
    if (!forminputs["start_date"] && !forminputs["end_date"]) {
      setErrors({});
    } else if (forminputs["end_date"] && forminputs["start_date"]) {
      let startdate = new Date(forminputs["start_date"]);
      let enddate = new Date(forminputs["end_date"]);
      if (startdate > enddate) {
        error = "end date should be greater than start date";
      }
    }
    setErrors((values) => ({ ...values, enddate: error }));
  };

  const validate = () => {
    validateStart();
    validateEnd();
    if (errors.startdate || errors.enddate) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      setFilterDates({ ...forminputs });
    }
    let stdate = new Date(forminputs.start_date);
    let endate = new Date(forminputs.end_date);
    console.log("reportsData", reportsData);
    let newData = reportsData.filter((report) => {
      console.log("report",report);
      let date = new Date(report.start_date);
      if (date >= stdate && date <= endate) {
        return report;
      }
        return;
    });
    console.log("newData", newData);
    setReportsData(newData);
  };
  //console.log("reportsData", reportsData);
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormInputs((values) => ({ ...values, [name]: value }));
    console.log("name", name, "value", value);
    
  };
  const Jobs = [...reportsData];

  const headers = [
    {
      label: "JobId",
      key: "job_id",
    },
    {
      label: "Title",
      key: "title",
    },
    {
      label: "StartDate",
      key: "start_date",
    },
    {
      label: "EndDate",
      key: "end_date",
    },
  ];

  const csvLink = {
    headers: headers,
    data: Jobs,
    filename: "csvfile.csv",
  };

  return (
    <>
      <Container>
        <Row className={classes.rowStyle}>
          <Col className={`${classes.repo} col-md-3`}>
            <span className={classes.span11}>Reports</span>
          </Col>
        </Row>

        <Row className={classes.filters}>
          <Col className={`${classes.str1} ${classes}`}>
            <FormGroup controlId="reportstartdate">
              <Row>
                <Col>
                  <FormLabel className={classes.textstyl}>
                    <b>Start Date</b>
                  </FormLabel>
                </Col>
                <Col className={classes.input}>
                  <FormControl
                    className={classes.str2}
                    onBlur={validateStart}
                    onChange={handleChange}
                    name="start_date"
                    type="date"
                    placeholder="Start Date"
                  />

                  <Col className="text-danger text-center">
                    {errors.startdate}
                  </Col>
                </Col>
              </Row>
            </FormGroup>
          </Col>

          <Col className={classes.end1}>
            <FormGroup controlId="reportenddate">
              <Row>
                <Col>
                  <FormLabel className={classes.textstyl}>
                    <b>End Date</b>
                  </FormLabel>
                </Col>
                <Col className={classes.input}>
                  <FormControl
                    className={classes.str21}
                    onBlur={validateEnd}
                    onChange={handleChange}
                    name="end_date"
                    type="date"
                    placeholder="End Date"
                  />

                  <Col className="text-danger text-center">
                    {errors.enddate}
                  </Col>
                </Col>
              </Row>
            </FormGroup>
          </Col>
          <Col className={classes.actions}>
            <Col className={classes.subm}>
              <button className={classes.buttonsty} onClick={handleSubmit}>
                Submit
              </button>
            </Col>
            <Col className={classes.expo}>
              <button className={classes.csvsty}>
                <CSVLink className={classes.sty11} {...csvLink}>
                  Export to CSV
                </CSVLink>
              </button>
            </Col>
          </Col>
        </Row>

        <div className={classes.tableBox}>
          <Table striped hover>
            <thead>
              <tr className={classes.tableHeader}>
                <th>JobId</th>
                <th>Title</th>
                <th>Category</th>
                <th>StartDate</th>
                <th>EndDate</th>
              </tr>
            </thead>
            <tbody className={classes.tableBody}>
              {slice.map((contact) => (
                <tr key={contact.job_id}>
                  <td>{contact.job_id}</td>
                  <td>{contact.title}</td>
                  <td>{contact.category}</td>
                  <td>{contact.start_date}</td>
                  <td>{contact.end_date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {reportsData.length === 0 && (
            <h3 className="text-center fw-bold">No jobs Data!</h3>
          )}
        </div>
        <TableFooter
          range={range}
          slice={slice}
          setPage={setPage}
          page={page}
        />
      </Container>
    </>
  );
}
export default Reports;
