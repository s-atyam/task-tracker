import "./profileCSS.css";
import userContext from "../context/UserContext";
import { useContext,useState,useEffect } from "react";

const Profile = (props) => {
    const context = useContext(userContext);
    const { setGlass,userData,editemailphone,setUserData } = context;

    const [phoneD,setPhoneD] = useState(userData.user.phoneNo);
    const [emailD,setEmailD] = useState(userData.user.email);

    const handleClick = ()=>{
        props.floatProfile(false);
        setGlass(false); 
    }
    const handleEditPhone = async()=>{
      let data = window.prompt("Write your correct Phone no.",userData.user.phoneNo);
      let newData
      if (data == null || data === "") {
        newData = "User cancelled the prompt.";
      } else {
        newData = data;
        let response = await editemailphone(userData.task,userData.depen,userData.user.email,newData);
        setPhoneD(data);
        setUserData(response);
        console.log(response);
      }
    }
    const handleEditEmail = async ()=>{
      let data = window.prompt("Write your correct Email",userData.user.email);
      let newData
      if (data == null || data === "") {
        newData = "User cancelled the prompt.";
      } else {
        newData = data;
        let response = await editemailphone(userData.task,userData.depen,newData,userData.user.phoneNo);
        setEmailD(data);
        setUserData(response);
        console.log(response);
      }
    }
    useEffect(() => {
      
    }, [emailD,phoneD])
  return (
    <>
      <div className="card-container">
        <i className="fa-regular fa-face-smile xxl_size" ></i>
        <h3>
          {props.data.fname} {props.data.lname}
        </h3>
        <div className="fluid editphone" >
        <h2>Email : {emailD}</h2>
        <i className="fa-regular fa-pen-to-square editPhoneicon" onClick={handleEditEmail}></i>
        </div>
        <div className="fluid editphone" >
        <h2>Phone : {phoneD}</h2>
        <i className="fa-regular fa-pen-to-square editPhoneicon" onClick={handleEditPhone}></i>
        </div>

        <button className="primary" onClick={handleClick}>BACK</button>
      </div>
    </>
  );
};

export default Profile;
