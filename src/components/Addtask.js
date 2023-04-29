import "./inputCSS.css";
import Multiselect from "multiselect-react-dropdown";

import userContext from "../context/UserContext";
import { useContext, useState } from "react";

const Addtask = (props) => {
    const context = useContext(userContext);
    const { createTask,setGlass,userData,setUserData } = context;

    const [data, setData] = useState({
    t_name: "",
    t_desc: "",
    t_due: "",
    dependency: []
    });

    let depenInitial = []
    for(let i=0;i<userData.task.length;i++){
      if(userData.task[i].status==="Not Completed"){
        depenInitial.push(userData.task[i].task_name);
      }
    }

    const handleClick = async (e) => {
    e.preventDefault();
    setGlass(false);
    props.setDivAdd(false);
    let depenID= [];

    for(let i=0;i<data.dependency.length;i++){
      for(let j=0;j<userData.task.length;j++){
        if(data.dependency[i]===userData.task[j].task_name)
          depenID.push(userData.task[j].task_id);
      }
    }

    let response = await createTask(userData.user,data.t_name,data.t_desc,data.t_due,depenID);
    setUserData(response);
    console.log(response);
    };
    const handleCancel = (e) => {
    e.preventDefault();
    setGlass(false);
    };

    const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    };

    return (
    <>
      <form className="crud-add fluid" autoComplete="off">
        <input
          type="text"
          className="field_input"
          autoComplete="off"
          placeholder="Task name"
          name="t_name"
          onChange={onChange}
          value={data.t_name}
          required
        />
        <textarea
          type="text"
          className="field_input t_desc_input"
          placeholder="Task description"
          name="t_desc"
          autoComplete="off"
          onChange={onChange}
          value={data.t_desc}
          required
        />
        <input
          type="date"
          name="t_due"
          onChange={onChange}
          value={data.t_due}
          required
        />
        <Multiselect
          options={depenInitial} // Options to display in the dropdown
          isObject={false} // Preselected value to persist in dropdown
          onSelect={(e)=>{
          data.dependency = e;  
          }}
          onRemove={()=>{}} // Function will trigger on remove event
        />
        <div className="crud-button-div fluid">
          <button className="crud-button" onClick={handleClick}>
            Create Task
          </button>
          <button className="crud-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};
export default Addtask;
