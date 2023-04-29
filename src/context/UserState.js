import React,{useState} from "react";
import userContext from "./UserContext";

const UserState = (props) => {
  const host = "http://localhost:5000"
  const userDataInitial = {user:{},task:[],depen:[]};
  const [userData,setUserData] = useState(userDataInitial);
  const [user,setUser] = useState({});
  const [glass,setGlass] = useState(true);

  // create a user
  const createUser = async (fname,lname,email,phone,password) => {
    // API Call
    const response = await fetch(`${host}/user/createuser`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ fname,lname,email,phone,password})
    });

    const json = await response.json();
    setUser(json.user);
    setUserData(json);
    console.log(json);
    return json;
  }

  // login user using credentials
  const login = async (email,password) => {
    // API Call
    const response = await fetch(`${host}/user/login`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json','email': email,'password': password}
    });
    const json = await response.json();
    if(json!=="Wrong email or password!"){
      console.log(json)
      setUser(json.user);
      setUserData(json);
    }
    return json;
  }
  
  // create a task
  const createTask = async (userDetails,name, description, due_date,dependency) => {
    // API Call
    let userID = user.user_id;
    const response = await fetch(`${host}/user/createtask`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ userDetails,userID,name, description, due_date,dependency})
    });

    const data = await response.json();
    console.log(data);
    setUserData(data);
    return data;
  }
  const complete = async (userDetails,taskId) => {
    // API Call
    let userID = user.user_id;
    const response = await fetch(`${host}/user/complete`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ userDetails,userID,taskId})
    });

    const data = await response.json();
    console.log(data);
    if(data.task.length!==0){
      setUserData({ user: data.user, task: data.task, depen: data.depen });
    }
    return data.taskDepend;
  }
  const sendSMSAction = async (phone) => {
    // API Call
    let userID = user.user_id;
    const response = await fetch(`${host}/user/smsaction`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({userID,phone })
    });

    const data = await response.json();
    console.log(data);
    return data;
  }
  const editemailphone = async (task,depen,email,phone) => {
    // API Call
    let userID = user.user_id;
    const response = await fetch(`${host}/user/editemailphone`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ userID,task,depen,email,phone})
    });

    const data = await response.json();
    console.log(data);
    setUserData({ user: data.user, task: data.task, depen: data.depen });
    return data;
  }


  return (
    <userContext.Provider value={{ glass,setGlass,userData ,createUser, createTask,login,setUserData,complete,sendSMSAction,editemailphone }}>
      {props.children}
    </userContext.Provider>
  )
}

export default UserState;