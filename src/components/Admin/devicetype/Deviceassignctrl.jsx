import React, { useState, useContext, useEffect, useRef } from "react";
import "../Adminpage.css";
import { AdminContext } from "../../../App";
import { useParams } from "react-router-dom";
import axios from "axios";
import './Deviceassignctrls.css'
const Deviceassignctrl = () => {
  const { devicename, version } = useParams();

  ////////////////Assigned controls logic start for EDIT- Modal of BUtton,Slider & Graph//////////////////

  // Handel dynamic add and delete  fields  start

  const [fields, setFields] = useState([]);

  const handleAddField = () => {
    setFields([...fields, { graph_color: "", graph_label: "" }]);
  };

  const handleDeleteField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleSubmit = () => {
    // Handle form submission with updated field data
    console.log(fields);
  };
  // Handel dynamic add and delete  fields  End

  const [assignedctrldata, setAssignedctrldata] = useState([]);

  const [asignctrlEditmodalforButton, setAsignctrlEditmodalforButton] =
    useState(false);

  const [asignctrlEditmodalforSlider, setAsignctrlEditmodalforSlider] =
    useState(false);

  const [asignctrlEditmodalforLinegrapg, setAsignctrlEditmodalforLinegrapg] =
    useState(false);

  const [index, setIndex] = useState(null);

  const asignctrlEditmodalbutton = (inde) => {
    setIndex(inde);
    console.log(assignedctrldata);
    // eslint-disable-next-line
    if (Object.keys(assignedctrldata[inde]) == "button") {
      setAsignctrlEditmodalforButton(!asignctrlEditmodalforButton);
      // eslint-disable-next-line
    } else if (Object.keys(assignedctrldata[inde]) == "slider") {
      setAsignctrlEditmodalforSlider(!asignctrlEditmodalforSlider);
      // eslint-disable-next-line
    } else if (Object.keys(assignedctrldata[inde]) == "graph") {
      setAsignctrlEditmodalforLinegrapg(!asignctrlEditmodalforLinegrapg);
      setFields(assignedctrldata[inde]?.graph.params);
      // eslint-disable-next-line
    } else if (inde == 0) {
      setAsignctrlEditmodalforButton(false);
      setAsignctrlEditmodalforLinegrapg(false);
      setAsignctrlEditmodalforSlider(false);
    }
    return;
  };

  //variable start for buttoncontrolonOff

  const [displayNamebtn, setDisplayNamebtn] = useState("");

  const [virtualbtn, setVirtualbtn] = useState("");

  const [allowuserbtn, setAllowUserbtn] = useState("");

  async function buttonEdit(editvalue) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_App_Ip}/on_off_control_edit/`,
        editvalue
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  //variable start for buttoncontrolonOff

  //variable start for Slider

  const [displayNameslider, setDisplayNameslider] = useState("");

  const [virtualslider, setVirtualslider] = useState("");

  const [minslider, setminslider] = useState("");

  const [maxslider, setmaxslider] = useState("");

  const [stepslider, setStepslider] = useState("");

  const [allowuserslider, setAllowUserslider] = useState("");

  async function sliderEdit(editvalue) {
    try {
      console.log(editvalue);
      const response = await axios.post(
        `${process.env.REACT_APP_App_Ip}/slider_control_edit/`,
        editvalue
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  //variable END forSlider

  //Variable  START for Graph

  const [displayNamegraph, setDisplayNamegraph] = useState("");

  const [xgraph, setxgraph] = useState("");

  const [ygraph, setygraph] = useState("");

  const [allowusergraph, setAllowUsergraph] = useState(false);

  async function graphedit(editvalue) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_App_Ip}/graph_control_edit/`,
        editvalue
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  //Variable  END for Graph

  useEffect(() => {
    if (assignedctrldata[index]?.button) {
      setDisplayNamebtn(assignedctrldata[index].button.display_name);
      setVirtualbtn(assignedctrldata[index].button.virtual_pin);
      setAllowUserbtn(assignedctrldata[index].button.allow_user);
    } else if (assignedctrldata[index]?.slider) {
      setDisplayNameslider(assignedctrldata[index].slider.display_name);
      setVirtualslider(assignedctrldata[index].slider.virtual_pin);
      setminslider(assignedctrldata[index].slider.min);
      setmaxslider(assignedctrldata[index].slider.max);
      setStepslider(assignedctrldata[index].slider.step_value);
      setAllowUserslider(assignedctrldata[index].slider.allow_user);
    } else if (assignedctrldata[index]?.graph) {
      setDisplayNamegraph(assignedctrldata[index].graph.display_name);
      setxgraph(assignedctrldata[index].graph.x);
      setygraph(assignedctrldata[index].graph.y);
    }
    // eslint-disable-next-line
  }, [index]);

  //////////////////// //Assigned controls logic END for EDIT Modal of BUtton,Slider & Graph//////////////////////

  //////////////// START Assigned controls DELETE////////////////

  const [deletebutton, setDeleteButton] = useState(false);
  const [dataisgoingtodelete, setDataisgoingtodelete] = useState([]);
  const openDeleteModels = () => {
    setDeleteButton(!deletebutton);
  };
  async function deletectrl(todelete) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_App_Ip}/control_delete/`,
        todelete
      );
     console.log(response);
    } catch (error) {
      console.log(error, "Api issue");
    }
  }

  //////////////// END Assigned controls DELETE////////////////

  ////////////////START Avilable controls logic for EDIT Modal of BUtton,Slider & Graph////////////////////////////

  // START dynamic field add and delete

  const [formData, setFormData] = useState([]);

  const addFormData = () => {
    const newFormData = {
      id: formData.length + 1,
      graph_label: "",
      graph_color: "",
    };
    setFormData([...formData, newFormData]);
  };

  const removeFormData = (id) => {
    const updatedFormData = formData.filter((data) => data.id !== id);
    setFormData(updatedFormData);
  };

  const handleChangedata = (id, fieldName, value) => {
    const updatedFormData = formData.map((data) =>
      data.id === id ? { ...data, [fieldName]: value } : data
    );
    setFormData(updatedFormData);
  };

  const handleSubmitdata = () => {
    // Send formData to your API or wherever it's needed
    console.log(formData);
  };

  // END dynamic field add and delete

  // START  variable for avilable control modal
  const [tobeedit, setTobeEdit] = useState(false);
  const [sliderinputmodal, setsliderinputmodal] = useState(false);
  const [linegraphmodal, setLinegraphmodal] = useState(false);

  // END variable for avilable control  modal

  // START variable for field of ONOFFbutton modal

  const disnamebutton = useRef(null);
  const vpinbutton = useRef(null);
  const allowbutton = useRef(null);
  async function addbutton(datatoadd) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_App_Ip}/on_off_control/`,
        datatoadd
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  // END variable for field of ONOFFbutton modal

  // START variable for field of slider modal

  const disnameslider = useRef(null);
  const vpinslider = useRef(null);
  const minnslider = useRef(null);
  const maxxslider = useRef(null);
  const steppslider = useRef(null);
  const allowslider = useRef(null);

  async function addslider(datatoadd) {
    try {
      const response = axios.post(
        `${process.env.REACT_APP_App_Ip}/slider_control/`,
        datatoadd
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  // END variable for field of slider modal

  // START variable for field of graph modal

  const disnamegraph = useRef(null);
  const xlable = useRef(null);
  const ylabel = useRef(null);
  const allowgraph = useRef(null);

  async function addgraph(datatoadd) {
    try {
      const response = axios.post(
        `${process.env.REACT_APP_App_Ip}/graph_control/`,
        datatoadd
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  // END variable for field of graph modal

  const editmodal = () => {
    setTobeEdit(!tobeedit);
  };
  
  const editmodalRef = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (editmodalRef.current && !editmodalRef.current.contains(event.target)) {
        editmodal();
      }
    };

    // Add event listener when calendar is shown
    if (tobeedit) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line
  }, [editmodal]);


  const sliderinputaddmodal = () => {
    setsliderinputmodal(!sliderinputmodal);
  };
  const slidermodalRef = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (
        slidermodalRef.current &&
        !slidermodalRef.current.contains(event.target)
      ) {
        sliderinputaddmodal();
      }
    };

    // Add event listener when calendar is shown
    if (sliderinputmodal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [sliderinputaddmodal]);

  const linegraphaddmodal = () => {
    setLinegraphmodal(!linegraphmodal);
  };
  const linermodalRef = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (
        linermodalRef.current &&
        !linermodalRef.current.contains(event.target)
      ) {
        linegraphaddmodal();
      }
    };

    // Add event listener when calendar is shown
    if (linegraphmodal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [linegraphaddmodal]);

  /////////////////// END Avilable controls logic  for EDIT Modal of BUtton,Slider & Graph////////////////////////////////

  //context Api use START
  const { isSidebarOpen } = useContext(AdminContext);
  //context Api END

  //Main Api for this page START
  async function fetchdata() {
    const response = await axios.get(
      `${process.env.REACT_APP_App_Ip}/controls_view/${devicename}/${version}/`
    );
    setAssignedctrldata(response.data);
    console.log(response.data);
  }
  useEffect(() => {
    fetchdata();
    // eslint-disable-next-line
  }, []);
  //Main Api for this page END

  return (
    <>
      <div
        className={`createdusercontent  ${isSidebarOpen ? "open" : "closed"}`}
      >
        {/* Table  start */}

        <div className=" tables d-flex justify-content-around">
          <div
            className="table1"
            style={{
              width: "45%",
              border: "1px solid",
              borderRadius: "10px",
              marginTop: "20px",
              maxHeight: "600px",

              overflowY: "scroll",
            }}
          >
            <p style={{ fontSize: 30, fontWeight: "bold", marginLeft: "30px" }}>
              Assigned Controls
            </p>
            <table className="table table-bordered table-striped table-hover table-design ">
              <thead>
                <tr>
                  <th className="text-center" scope="col">
                    Control Name
                  </th>
                  <th className="text-center" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
              
                {assignedctrldata?.length > 0 &&
                // eslint-disable-next-line
                  assignedctrldata?.map((data, index) => {
                    if (data.button) {
                      return (
                        <tr key={index}>
                          <td className="text-center">
                            {data.button.display_name}
                          </td>
                          <td className="text-center d-flex justify-content-center">
                            <button
                              type="button"
                              className="btn btn-warning"
                              style={{
                                borderRadius: "16px",
                                
                                verticalAlign: "center",
                              }}
                              onClick={() => {
                                asignctrlEditmodalbutton(index);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{
                                borderRadius: "16px",
                                
                                verticalAlign: "center",
                                marginLeft: "8px",
                              }}
                              onClick={() => {
                                openDeleteModels();
                                const dataobedelete = {
                                  type_name: devicename,
                                  type_ver: version,
                                  display_name: data.button.display_name,
                                  virtual_pin: data.button.virtual_pin,
                                };
                                setDataisgoingtodelete(dataobedelete);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    } else if (data.slider) {
                      // Use else if here
                      return (
                        <tr key={index}>
                          <td className="text-center">
                            {data.slider.display_name}
                          </td>

                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-warning"
                              style={{
                                borderRadius: "16px",
                                
                                verticalAlign: "center",
                              }}
                              onClick={() => asignctrlEditmodalbutton(index)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{
                                borderRadius: "16px",
                                
                                verticalAlign: "center",
                                marginLeft: "8px",
                              }}
                              onClick={() => {
                                openDeleteModels();
                                const dataobedelete = {
                                  type_name: devicename,
                                  type_ver: version,
                                  display_name: data.slider.display_name,
                                  virtual_pin: data.slider.virtual_pin,
                                };
                                setDataisgoingtodelete(dataobedelete);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    } else if (data.graph) {
                      return (
                        <tr key={index}>
                          <td className="text-center">
                            {data.graph.display_name}
                          </td>

                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-warning"
                              style={{
                                borderRadius: "16px",
                                
                                verticalAlign: "center",
                              }}
                              onClick={() => asignctrlEditmodalbutton(index)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{
                                borderRadius: "16px",
                                
                                verticalAlign: "center",
                                marginLeft: "8px",
                              }}
                              onClick={() => {
                                openDeleteModels();
                                const dataobedelete = {
                                  type_name: devicename,
                                  type_ver: version,
                                  display_name: data.graph.display_name,
                                  virtual_pin: data.graph.params,
                                };
                                setDataisgoingtodelete(dataobedelete);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  })}
              </tbody>
            </table>
          </div>

          {/* asignCOntrol End */}

          {/* Delete button Modal Start */}

          {deletebutton ? (
            <div className="check-model ">
              <div
                className="model accedit"
                style={{ fontSize: "16px", width: "600px", height: "200px" }}
              >
                {/* Modal Heading */}
                <div className="heading d-flex justify-content-between  ">
                  <p
                    style={{
                      marginTop: "8px",
                      marginLeft: "30px",
                      fontSize: 20,
                    }}
                  >
                    Delete Account
                  </p>
                  <i
                    className="bi bi-x-octagon cancel-button-modal "
                    style={{ fontSize: 30 ,color:'#df010d',alignItems:'center',display:'flex'}}
                    onClick={openDeleteModels}
                  ></i>
                </div>
                {/* Modal Content */}
                <div className="accounteditmodaldv" style={{ marginLeft: "20px", marginTop: "5%" }}>
                  <div style={{ marginLeft: "25px" }}>
                    <p>Are you sure to Delete control Permanently ?</p>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                      style={{
                        textAlign: "cenetr",
                        marginRight: "15px",
                      }}
                      onClick={() => {
                        console.log(dataisgoingtodelete);
                        deletectrl(dataisgoingtodelete);
                        openDeleteModels();
                        setTimeout(() => {
                          fetchdata();
                        }, 400);
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                      style={{
                        textAlign: "cenetr",
                        marginRight: "15px",
                      }}
                      onClick={openDeleteModels}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {/* DeleteButton Modal End */}
          {/* Avilable control start  */}
          <div
            className="table2"
            style={{
              width: "40%",
              height: "360px",
              border: "1px solid",
              borderRadius: "10px",
              margin: "20px 10px 0 10px",
            }}
          >
            <p style={{ fontSize: 30, fontWeight: "bold", marginLeft: "30px" }}>
              Available Controls
            </p>
            <table className="table table-bordered table-striped table-hover table-design ">
              <thead>
                <tr>
                  <th className="text-center" scope="col">
                    Control Name
                  </th>
                  <th className="text-center" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">On Off Button</td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-success "
                      style={{
                        borderRadius: "16px",
                        
                        verticalAlign: "cenetr",
                      }}
                      onClick={editmodal}
                    >
                      Add
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="text-center">Slider Input</td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{
                        borderRadius: "16px",
                        
                        verticalAlign: "cenetr",
                      }}
                      onClick={sliderinputaddmodal}
                    >
                      Add
                    </button>
                  </td>
                </tr>

                <tr>
                  <td className="text-center">Line Graph</td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{
                        borderRadius: "16px",
                        
                        verticalAlign: "cenetr",
                      }}
                      onClick={linegraphaddmodal}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Table  End */}
        </div>
      </div>

      {/* Available Controls Modal add  start */}

      {tobeedit ? (
        <div className="check-model ">
          <div
          ref={editmodalRef}
            className="model accedit"
            style={{  width: "650px",  }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginLeft: "30px", fontSize: 20 }}>On Off Button</p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30,color:'#df010d' ,alignItems:'center',display:'flex'}}
                onClick={editmodal}
              ></i>
            </div>
            {/* Modal Heading End */}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const buttondata = {
                  type_name: devicename,
                  type_ver: version,
                  btn_dis_name: disnamebutton.current.value,
                  btn_pin: vpinbutton.current.value,
                  alw_usr: allowbutton.current.checked,
                };
                console.log(buttondata);
                addbutton(buttondata);
                editmodal();
                setTimeout(() => {
                  fetchdata();
                }, 400);
              }}
            >
              <table className="table">
                <tbody style={{ marginLeft: "20px" }}>
                  <tr>
                    <td>Display Name:- </td>
                    <td>
                      <input
                        ref={disnamebutton}
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        required
                        onInvalid={(e) =>
                          e.target.setCustomValidity("Please Enter Your Name")
                        }
                        onChange={(e) => e.target.setCustomValidity("")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Virtual pin:- </td>
                    <td>
                      <input
                        ref={vpinbutton}
                        type="number"
                        className="form-control"
                        placeholder="Virtual pin"
                        required
                        onInvalid={(e) =>
                          e.target.setCustomValidity("Please Enter Your  pin")
                        }
                        onChange={(e) => e.target.setCustomValidity("")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <input
                      ref={allowbutton}
                      className="form-check-input"
                      type="checkbox"
                      id="gridCheck1"
                      style={{ marginLeft: "10px" }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="gridCheck1"
                      style={{ marginLeft: "10px", padding: "0px",width:'103%' }}
                    >
                      Allow User Access
                    </label>
                  </tr>
                </tbody>
              </table>
              <button
                type="submit"
                className="btn btn-success"
                style={{
                  borderRadius: "16px",
                  
                  verticalAlign: "cenetr",
                  margin: "0 0 5% 20px",
                }}
              >
                Add
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {/* Available Controls Modal End for ON Off Button*/}

      {/* Available Controls Modal for Slider Input */}
      {sliderinputmodal ? (
        <div className="check-model ">
          <div
          ref={slidermodalRef}
            className="model accedit"
            style={{
              
              width: "650px",
            
              marginTop: "70px",
            }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginLeft: "30px", fontSize: 20 }}>Slider Input</p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30,color:'#df010d' ,alignItems:'center',display:'flex' }}
                onClick={sliderinputaddmodal}
              ></i>
            </div>
            {/* Modal Heading End */}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const sliderdata = {
                  type_name: devicename,
                  type_ver: version,
                  slider_dis_name: disnameslider.current.value,
                  slider_pin: vpinslider.current.value,
                  slider_min: minnslider.current.value,
                  slider_max: maxxslider.current.value,
                  slider_step_value: steppslider.current.value,
                  slider_allow_user: allowslider.current.checked,
                };
                console.log(sliderdata);
                sliderinputaddmodal();
                addslider(sliderdata);
                setTimeout(() => {
                  fetchdata();
                }, 400);
              }}
            >
              <table className="table table-hover">
                <tbody style={{ marginLeft: "20px" }}>
                  <tr>
                    <td>Display Name:- </td>
                    <td>
                      <input
                        ref={disnameslider}
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        required
                        onInvalid={(e) =>
                          e.target.setCustomValidity("Please Enter Name")
                        }
                        onChange={(e) => e.target.setCustomValidity("")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Virtual pin:- </td>
                    <td>
                      <input
                        ref={vpinslider}
                        type="number"
                        className="form-control"
                        placeholder="Virtual pin"
                        required
                        onInvalid={(e) =>
                          e.target.setCustomValidity("Please Enter Virtual Pin")
                        }
                        onChange={(e) => e.target.setCustomValidity("")}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>Min:- </td>
                    <td>
                      <input
                        ref={minnslider}
                        type="number"
                        className="form-control"
                        placeholder="Min"
                        required
                        onInvalid={(e) =>
                          e.target.setCustomValidity("Please Enter Min")
                        }
                        onChange={(e) => e.target.setCustomValidity("")}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>Max:- </td>
                    <td>
                      <input
                        ref={maxxslider}
                        type="number"
                        className="form-control"
                        placeholder="Max"
                        required
                        onInvalid={(e) =>
                          e.target.setCustomValidity("Please Enter Max")
                        }
                        onChange={(e) => e.target.setCustomValidity("")}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>Step Value:- </td>
                    <td>
                      <input
                        ref={steppslider}
                        type="number"
                        className="form-control"
                        placeholder="Step value"
                        required
                        onInvalid={(e) =>
                          e.target.setCustomValidity("Please Enter Step value")
                        }
                        onChange={(e) => e.target.setCustomValidity("")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        className="form-check-input"
                        ref={allowslider}
                        type="checkbox"
                        id="gridCheck1"
                        style={{ marginLeft: "10px" }}
                      />
                      <label
                        className="form-check-label"
                        htmlfor="gridCheck1"
                        style={{ marginLeft: "10px", padding: "0px",width:'103%'}}
                      >
                        Allow User Access
                      </label>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <button
                type="submit"
                className="btn btn-success"
                style={{
                  borderRadius: "16px",
                  
                  verticalAlign: "cenetr",
                  margin: "0 0 5% 20px",
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {/* Available Controls Modal for Slider Input End */}

      {/* START  Available Controls Modal for Linegraph  */}
      {linegraphmodal ? (
        <div className="check-model ">
          <div
          ref={linermodalRef}
            className="model accedit"
            style={{
              
              width: "650px",

              marginTop: "70px",
            }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginLeft: "30px", fontSize: 20 }}>Line Graph</p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30,color:'#df010d' ,alignItems:'center',display:'flex'}}
                onClick={linegraphaddmodal}
              ></i>
            </div>
            {/* Modal Heading End */}

            <table className="table table-hover">
              <tbody style={{ marginLeft: "20px" }}>
                <tr>
                  <td>Display Name:- </td>
                  <td>
                    <input
                      ref={disnamegraph}
                      type="text"
                      className="form-control"
                      placeholder="First name"
                    />
                  </td>
                </tr>
                <tr>
                  <td>X-axis Label Name:- </td>
                  <td>
                    <input
                      ref={xlable}
                      type="text"
                      className="form-control"
                      placeholder="X-axis Label Name"
                    />
                  </td>
                </tr>

                <tr>
                  <td>Y-axis Label Name:- </td>
                  <td>
                    <input
                      ref={ylabel}
                      type="text"
                      className="form-control"
                      placeholder="Y-axis Label Name"
                    />
                  </td>
                </tr>

                <tr>
                  <td>Label</td>
                  <td className="d-flex flex-row justify-content-between">
                    Color
                    <td>Action</td>
                  </td>
                </tr>

                {formData.map((data) => (
                  <tr key={data.id}>
                    <td>
                      <input
                        type="text"
                        placeholder="Label"
                        className="form-control"
                        value={data.label}
                        onChange={(e) =>
                          handleChangedata(
                            data.id,
                            "graph_label",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="d-flex flex-row justify-content-between">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Color"
                        value={data.color}
                        onChange={(e) =>
                          handleChangedata(
                            data.id,
                            "graph_color",
                            e.target.value
                          )
                        }
                       
                      />

                      <i
                        className="bi bi-trash"
                        onClick={() => removeFormData(data.id)}
                        style={{
                          marginRight: "15px",
                          cursor: "pointer",
                          color: "red",
                        }}
                      ></i>
                    </td>
                  </tr>
                ))}

                <tr>
                  <td>
                    <input
                      className="form-check-input"
                      ref={allowgraph}
                      type="checkbox"
                      id="gridCheck1"
                      style={{ marginLeft: "10px" }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="gridCheck1"
                      style={{ marginLeft: "10px", padding: "0px" ,width:'103%'}}
                    >
                      Allow User Access
                    </label>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{
                        borderRadius: "16px",
                        
                        verticalAlign: "cenetr",
                        marginLeft: "20px",
                      }}
                      onClick={addFormData}
                    >
                      Add
                    </button>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <button
              type="button"
              className="btn btn-success"
              style={{
                borderRadius: "16px",
                
                verticalAlign: "cenetr",
                marginLeft: "20px",
                marginBottom:'5px'
              }}
              onClick={() => {
                handleSubmitdata();
                linegraphaddmodal();

                const graphdataavlctrl = {
                  type_name: devicename,
                  type_ver: version,
                  graph_dis_name: disnamegraph.current.value,
                  params: formData,
                  graph_allow_user: allowgraph.current.checked,
                  x: xlable.current.value,
                  y: ylabel.current.value,
                };
                addgraph(graphdataavlctrl);
                console.log(graphdataavlctrl);
                setTimeout(() => {
                  fetchdata();
                }, 400);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      ) : null}

      {/*  END MOdal for LInegraph */}

      {/* Assigned Controls Modal Start for  onof button  EDIT */}

      {asignctrlEditmodalforButton && (
        <div className="check-model ">
          <div
            className="model accedit"
            style={{  width: "650px"}}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginLeft: "30px", fontSize: 20 }}>On Off Button</p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30,color:'#df010d',alignItems:'center',display:'flex' }}
                onClick={() =>
                  setAsignctrlEditmodalforButton(!asignctrlEditmodalforButton)
                }
              ></i>
            </div>
            {/* Modal Heading End */}
            <table className=" table">
              <tbody style={{ marginLeft: "20px" }}>
                <tr>
                  <td>Display Name:- </td>
                  <td>
                    <input
                      onChange={(e) => setDisplayNamebtn(e.target.value)}
                      value={displayNamebtn}
                      type="text"
                      className="form-control"
                      placeholder="First name"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Virtual pin:- </td>
                  <td>
                    <input
                      onChange={(e) => setVirtualbtn(e.target.value)}
                      value={virtualbtn}
                      type="text"
                      className="form-control"
                      placeholder="Virtual pin"
                    />
                  </td>
                </tr>
                <tr>
                  <input
                    className="form-check-input"
                    onChange={(e) => setAllowUserbtn(e.target.checked)}
                    value={allowuserbtn}
                    type="checkbox"
                    id="gridCheck1"
                    style={{ marginLeft: "10px" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="gridCheck1"
                    style={{ marginLeft: "10px", padding: "0px",width:'100%' }}
                  >
                    Example checkbox
                  </label>
                </tr>
              </tbody>
            </table>
            <button
              type="button"
              className="btn btn-success"
              style={{
                borderRadius: "16px",
                
                verticalAlign: "center", 
                margin: "0 0 5px 20px",
              }}
              onClick={() => {
                const btndata = {
                  type_name: devicename,
                  type_ver: version,
                  control_key: "button",
                  old_dis_name: assignedctrldata[index].button.display_name,
                  old_vpin: assignedctrldata[index].button.virtual_pin,
                  new_dis_name: displayNamebtn,
                  new_vpin: virtualbtn,
                  new_alwusr: allowuserbtn,
                };
                console.log(btndata);
                buttonEdit(btndata);
                setAsignctrlEditmodalforButton(!asignctrlEditmodalforButton);
                setTimeout(() => {
                  fetchdata();
                }, 400);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Assigned Controls Modal End for  onof button  EDIT */}

      {/* Assigned Controls Modal Start for  Edit Button of SliderInput */}

      {asignctrlEditmodalforSlider && (
        <div className="check-model ">
          <div
            className="model accedit"
            style={{
              
              width: "650px",
              height: "460px",
              marginTop: "70px",
            }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginLeft: "30px", fontSize: 20 }}>Slider Input</p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30,color:'#df010d' ,alignItems:'center',display:'flex'}}
                onClick={() =>
                  setAsignctrlEditmodalforSlider(!asignctrlEditmodalforSlider)
                }
              ></i>
            </div>
            {/* Modal Heading End */}
            <table className="table table-hover">
              <tbody style={{ marginLeft: "20px" }}>
                <tr>
                  <td>Display Name:- </td>
                  <td>
                    <input
                      value={displayNameslider}
                      onChange={(e) => setDisplayNameslider(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Display name"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Virtual pin:- </td>
                  <td>
                    <input
                      value={virtualslider}
                      onChange={(e) => setVirtualslider(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Virtual pin"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Min:- </td>
                  <td>
                    <input
                      value={minslider}
                      onChange={(e) => setminslider(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Min"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Max:- </td>
                  <td>
                    <input
                      value={maxslider}
                      onChange={(e) => setmaxslider(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Max"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Step Value:- </td>
                  <td>
                    <input
                      value={stepslider}
                      onChange={(e) => setStepslider(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Step Value"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      value={allowuserslider}
                      onChange={(e) => setAllowUserslider(e.target.checked)}
                      className="form-check-input"
                      type="checkbox"
                      id="gridCheck1"
                      style={{ marginLeft: "10px" }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="gridCheck1"
                      style={{ marginLeft: "10px", padding: "0px" }}
                    >
                      Allow User Access
                    </label>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <button
              type="button"
              className="btn btn-success"
              style={{
                borderRadius: "16px",
                
                verticalAlign: "cenetr",
                marginLeft: "20px",
              }}
              onClick={() => {
                const sliderdata = {
                  type_name: devicename,
                  type_ver: version,
                  control_key: "slider",
                  old_dis_name: assignedctrldata[index].slider.display_name,
                  old_vpin: assignedctrldata[index].slider.virtual_pin,
                  new_dis_name: displayNameslider,
                  new_vpin: virtualslider,
                  new_min: minslider,
                  new_max: maxslider,
                  new_step_value: stepslider,
                  new_alwusr: allowuserslider,
                };
                console.log(sliderdata);
                sliderEdit(sliderdata);
                setAsignctrlEditmodalforSlider(!asignctrlEditmodalforSlider);
                setTimeout(() => {
                  fetchdata();
                }, 400);
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}
      {/* Assigned Controls Modal End for Edit Button of SliderInput */}

      {/* Assigned Controls Modal START for  Edit Button of Graph   */}

      {asignctrlEditmodalforLinegrapg && (
        <div className="check-model ">
          <div
            className="model accedit"
            style={{
              
              width: "650px",

              marginTop: "70px",
            }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginLeft: "30px", fontSize: 20 }}>Line Graph</p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30,color:'#df010d' ,alignItems:'center',display:'flex'}}
                onClick={() =>
                  setAsignctrlEditmodalforLinegrapg(
                    !asignctrlEditmodalforLinegrapg
                  )
                }
              ></i>
            </div>
            {/* Modal Heading End */}
            <table className="table table-hover">
              <tbody style={{ marginLeft: "20px" }}>
                <tr>
                  <td>Display Name:- </td>
                  <td>
                    <input
                      value={displayNamegraph}
                      onChange={(e) => setDisplayNamegraph(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="First name"
                    />
                  </td>
                </tr>
                <tr>
                  <td>X-axis Label Name:- </td>
                  <td>
                    <input
                      value={xgraph}
                      onChange={(e) => setxgraph(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="X-axis Label Name"
                    />
                  </td>
                </tr>

                <tr>
                  <td>Y-axis Label Name:- </td>
                  <td>
                    <input
                      value={ygraph}
                      onChange={(e) => setygraph(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Y-axis Label Name"
                    />
                  </td>
                </tr>

                <tr>
                  <td>Label</td>
                  <td className="d-flex flex-row justify-content-between">
                    Color
                    <td>Action</td>
                  </td>
                </tr>

                {fields?.map((value, inf) => (
                  <tr key={inf}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={value.graph_label}
                        onChange={(e) =>
                          handleChange(inf, "graph_label", e.target.value)
                        }
                        style={{ width: "240px" }}
                      />
                    </td>
                    <td className="d-flex flex-row justify-content-between">
                      <input
                        type="text"
                        className="form-control"
                        value={value.graph_color}
                        onChange={(e) =>
                          handleChange(inf, "graph_color", e.target.value)
                        }
                        style={{ width: "240px" }}
                      />

                      <i
                        className="bi bi-trash"
                        onClick={() => handleDeleteField(inf)}
                        style={{
                          marginRight: "15px",
                          cursor: "pointer",
                          color: "red",
                        }}
                      ></i>
                    </td>
                  </tr>
                ))}

                <tr>
                  <td>
                    <input
                      className="form-check-input"
                      value={allowusergraph}
                      onChange={(e) => setAllowUsergraph(e.target.checked)}
                      type="checkbox"
                      id="gridCheck1"
                      style={{ marginLeft: "10px" }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="gridCheck1"
                      style={{ marginLeft: "10px", padding: "0px" }}
                    >
                      Allow User Access
                    </label>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{
                        borderRadius: "16px",
                        
                        verticalAlign: "cenetr",
                        marginLeft: "20px",
                      }}
                      onClick={handleAddField}
                    >
                      Add
                    </button>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <button
              type="button"
              className="btn btn-success"
              style={{
                borderRadius: "16px",
                
                verticalAlign: "cenetr",
                marginLeft: "20px",
              }}
              onClick={() => {
                handleSubmit();
                const graphDataassnctrl = {
                  type_name: devicename,
                  type_ver: version,
                  control_key: "graph",
                  old_dis_name: assignedctrldata[index].graph.display_name,
                  new_dis_name: displayNamegraph,
                  new_params: fields,
                  new_x: xgraph,
                  new_y: ygraph,
                  new_alwusr: allowusergraph,
                };
                console.log(graphDataassnctrl);
                graphedit(graphDataassnctrl);
                setAsignctrlEditmodalforLinegrapg(
                  !asignctrlEditmodalforLinegrapg
                );
                setTimeout(() => {
                  fetchdata();
                }, 400);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {/* Assigned Controls  Modal END for  Edit Button of Graph   */}
    </>
  );
};

export default Deviceassignctrl;
