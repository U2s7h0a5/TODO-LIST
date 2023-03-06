import React, { useState, useEffect } from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Home = () => {
  const [activity, setActivity] = useState("");
  const [listData, setListData] = useState([]);
  const [status, setStatus] = useState("Incomplete");
  const [selectedId, setSelectedId] = useState(0);
  const [data, setData] = useState();

  const addActivity = () => {
    if (activity) {
      setData([
        ...data,
        { activity: activity, status: status, id: data.length + 1 },
      ]);
      setListData([
        ...listData,
        { activity: activity, status: status, id: listData.length + 1},
      ]);
      toast("ITEM added successfully!");
      setActivity("");
      setStatus("Incomplete");
    } else {
      window.alert("Please Enter TODO Title")
    }
    window.localStorage.setItem('data', JSON.stringify(([
      ...data,
      { activity: activity, status: status, id: data.length + 1 },
    ])));
  };

  const deleteItem = (e) => {
    const filterData = listData.filter((data) => data.id !== Number(e.target.id));
    setListData(filterData);
    setData(filterData);
    toast("ITEM Deleted successfully!");
    window.localStorage.setItem('data', JSON.stringify(filterData));
  };

  const editItem = (e) => {
    const item = data.filter((d) => d.id === Number(e.target.id));
    setActivity(item[0].activity);
    setStatus(item[0].status);
    setSelectedId(Number(e.target.id));    
  };

  const filterStatus = (status) => {
    if (status !== "All") {
      setListData(data.filter((x) => x.status === status));
      console.log(status);
    } else {
      setListData(data);
    }
  };

  const updateActivity = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        item.activity = activity;
        item.status = status;
      }
    });
    window.localStorage.setItem('data', JSON.stringify(data))
    setData(data);
    setListData(data);
    setSelectedId(0);
    toast("ITEM Updated successfully!");
    setActivity("");
    setStatus("Incomplete");
  };

  useEffect(() => {
    const data =  JSON.parse(localStorage.getItem('data')) || []
    setListData(data);
    setData(data);
  }, []);

  return (
    <>
      <div className="container">
        <h1> TODO-LIST </h1>
      </div>

      <div className="Header">
        <div className="add-task">
          <button
            type="button"
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#addTaskModal"
          >
            Add Task
          </button>
        </div>
        <div className="option">
          <select
            className="option-head"
            id="status"
            onChange={(e) => {
              filterStatus(e.target.value);
            }}
          >
            <option value="All">All</option>
            <option value="Incomplete">Incomplete</option>
            <option value="Complete">Complete</option>
          </select>
        </div>
      </div>

      <div className="body-part">
        {listData.length === 0 ? <p className="no-records"> no records </p> : ""}
        {listData !== [] &&
          listData.map((item, i) => {
            return (
              <div className="title" key={item.id}>
                <div className="checkbox">
                  <input
                    type="checkbox"
                    className="main-checkbox"
                    checked={item.status === "Complete" ? true : false}
                  />
                  <div className="activity-text">
                  {item.status === "Incomplete" && item.activity}
                  {item.status === "Complete" && <s> {item.activity}</s>}
                  </div>
                </div>
                <div>
                  <button
                    className="button-edit"
                    id={item.id}
                    onClick={(e) => editItem(e)}
                    data-toggle="modal"
                    data-target="#addTaskModal"
                  >
                    <i className="fa-solid fa-pen-to-square" id={item.id}></i>
                  </button>
                  <button
                    className="button-del"
                    id={item.id}
                    onClick={(e) => deleteItem(e)}
                  >
                    <i className="fa-solid fa-trash" id={item.id}></i>
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      <ToastContainer position="top-right" />

      <div className="modal" id="addTaskModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              {selectedId !== 0 && <h5 className="modal-title">update TODO</h5>}
              {selectedId === 0 && <h5 className="modal-title">ADD TODO</h5>}
            </div>
            <div className="modal-body">
              <h2>Title <span className="span">*</span></h2>
              <div>
                <input
                  type="text"
                  required
                  className="input-text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                />
              </div>              
              <div>
                <h3>Status</h3>
              </div>
              <select
                value={status}
                className="option-new"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Incomplete">Incomplete</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary"              
                data-dismiss={activity.length === 0 ? "" : "modal"}
                onClick={
                  selectedId === 0
                    ? () => addActivity()
                    : () => updateActivity(selectedId)
                }
              >
                {selectedId === 0 ? "Add" : "Update"} Task
              </button>
              <button
                type="submit"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
