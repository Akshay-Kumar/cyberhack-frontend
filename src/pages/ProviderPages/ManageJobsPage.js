import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";
import SpinnerComponent from "../../components/UI/SpinnerComponent";
import ManageTab from "../../Job Provider/Components/ManageJobs/ManageTab";
import ReactModal from "../../Job Provider/Components/ManageJobs/ReactModal";
import AddJob from "../../Job Provider/Components/AddJob/AddJob";
import Config from "../../config/Config.json";

let jobId;
export default function ManageJobsPage() {
  const [action, setAction] = useState(false);
  const [showSpinner, setSpinner] = useState(false);

  const [showAddJobModal, setAddJobModal] = useState(false);
  const [showEditJobModal, setEditJobModal] = useState({
    show: false,
    inititalValues: {},
  });
  const [showDeleteModal, setDeleteModal] = useState(false);
  const editJobHandler = (jobData) => {
    console.log('inside editJobHandler', jobData);
    setEditJobModal({ show: true, inititalValues: jobData });
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    document.title = Config.TITLE.MANAGE_JOBS;
  }, []);
  const deleteModalHandler = (jId) => {
    jobId = jId;
    setDeleteModal(true);
  };
  const deleteItemHandler = () => {
    setDeleteModal(false);
    setSpinner(true);
    const readAuthToken = jwtDecode(token);
    const user_id = readAuthToken.user_id;
    console.log('userId', user_id);
    axios
      .get(`${Config.SERVER_URL + "api/posts/provider/jobs/delete/" + jobId + "/" + user_id}`)
      .then((result) => {
        setSpinner(false);
        setAction(!action);
        toast.success(result.data.message);
      })
      .catch((err) => {
        // console.log(err);
        setSpinner(false);
        toast.error("Oops something went wrong");
      });
  };
  const addJobHandler = (values) => {
    console.log('format values', values);
    setSpinner(true);

    const readAuthToken = jwtDecode(token);
    const user_id = readAuthToken.user_id;
    // create job object
    const jobObject = {
      title: values.title,
      description: values.description,
      category: values.category,
      end_date: values.endDate,
      provider_id: user_id,
      start_date: values.startDate,
    };

    axios
      .post(
        `${Config.SERVER_URL + "api/posts/provider/add-job"}`,
        jobObject
      )
      .then((result) => {
        // console.log(result);
        setAction(!action);
        setSpinner(false);
        setAddJobModal(false);
        toast.success(result.data.message);
      })
      .catch((err) => {
        // console.log(err);
        setSpinner(false);
        toast.error("Oops something went wrong");
      });
  };
  const editJobItemHandler = (values) => {
    console.log('inside editJobItemHandler');
    console.log('updated job values', values);
    const readAuthToken = jwtDecode(token);
    const user_id = readAuthToken.user_id;
    console.log('userId', user_id);
    console.log('old job title', values.title);
    const job_id = values.job_id;
    const provider_id = user_id;
    const updatedValues = {
      job_id: job_id,
      title: values.title,
      description: values.description,
      category: values.category,
      end_date: values.end_date,
      provider_id: provider_id,
      start_date: values.start_date,
    };
    console.log('updatedValues', updatedValues);
    setSpinner(true);

    axios
      .put(
        `${Config.SERVER_URL + "api/posts/provider/edit-job/" + job_id}`,
        updatedValues
      )
      .then((result) => {
        // console.log(result);
        setAction(!action);
        setSpinner(false);
        setEditJobModal((prev) => {
          return { show: false, inititalValues: prev.inititalValues };
        });
        toast.success(result.data.message);
      })
      .catch((err) => {
        // console.log(err);
        setSpinner(false);
        toast.error("Oops something went wrong");
      });
  };
  return (
    <>
      <Suspense fallback={<SpinnerComponent />}>
        {/* EDIT MODAL */}
        {showSpinner && <SpinnerComponent />}
        <ReactModal
          show={showAddJobModal}
          onHide={() => {
            setAddJobModal(false);
          }}
        >
          {{
            title: "Add new Job",
            body: <AddJob onAdd={addJobHandler} />,
          }}
        </ReactModal>
        <ReactModal
          show={showEditJobModal.show}
          onHide={() => {
            setEditJobModal((prev) => {
              return { show: false, inititalValues: prev.inititalValues };
            });
          }}
        >
          {{
            title: "Edit the Job",
            body: (
              <AddJob
                jobInfo={showEditJobModal.inititalValues}
                onAdd={editJobItemHandler}
              />
            ),
          }}
        </ReactModal>
      </Suspense>
      {/* DELETE MODAL */}
      <ReactModal
        show={showDeleteModal}
        isDelete={true}
        onOk={deleteItemHandler}
        onHide={() => {
          setDeleteModal(false);
        }}
      >
        {{ title: "Delete Job", body: <h1>Are you sure?</h1> }}
      </ReactModal>

      <ManageTab
        onShowAddUser={setAddJobModal}
        onEditJob={editJobHandler}
        onShowDelete={deleteModalHandler}
        changes={action}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
