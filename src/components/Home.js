import styled from "styled-components";
import userContext from "../context/UserContext";
import { useContext, useEffect, useState } from "react";
import Rows from "./Rows";
import Addtask from "./Addtask";
import Tree from "./Tree";
import {useNavigate} from 'react-router-dom';
import Profile from "./Profile";

const GlassDiv = styled.div`
  position: absolute;
  top: 1.5%;
  left: 2.5%;
  z-index: 100;
  width: 1825px;
  height: 905px;
  border-radius: 30px;
  background: rgba(10, 10, 10, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Home = () => {
  const navigate = useNavigate();
  const context = useContext(userContext);
  const { userData, glass, setGlass,sendSMSAction } = context;

  const [floatDiv, setFloatDiv] = useState(false);
  const [floatDivGraph, setFloatDivGraph] = useState(false);
  const [dispAction, setDispAction] = useState(true);
  const [dispCompl, setDispCompl] = useState(false);
  const [dispAll, setDispAll] = useState(false);
  const [floatProfile, setFloatProfile] = useState(false);

  console.log(userData);

  let initialNodes = [];
  let initialEdges = [];
  let completedTask = [];
  let notCompletedTask = [];

  const taskMap = new Map();
  if(userData!=="Wrong email or password!"){
    for (let i = 0; i < userData.task.length; i++) {
        taskMap.set(userData.task[i].task_id, userData.task[i].task_name);
        if(userData.task[i].status === "Not Completed"){
            initialNodes.push({
              id: `${userData.task[i].task_id}`,
              position: { x: 800 + Math.pow(-1, i) * i * 50, y: (i + 1) * 50 },
              data: { label: userData.task[i].task_name },
            });
        }
      }
      for (let i = 0; i < userData.depen.length; i++) {
        initialEdges.push({
          id: `${userData.depen[i].task_id}_${userData.depen[i].dependency_id}`,
          source: `${userData.depen[i].task_id}`,
          target: `${userData.depen[i].dependency_id}`,
          animated: true,
    style: { stroke: 'red' }
        });
      }
      for (let i = 0; i < userData.task.length; i++) {
        if (userData.task[i].status !== "Not Completed") {
          completedTask.push(userData.task[i]);
        } else {
          notCompletedTask.push(userData.task[i]);
        }}
  }

  const handleClickAdd = () => {
    setFloatDivGraph(false);
    setFloatDiv(true);
    setGlass(true);
  };
  const handleClickProfile = () => {
    setFloatDivGraph(false);
    setFloatDiv(false);
    setFloatProfile(true);
    setGlass(true);
  };
  const handleClickAP = () => {
    setDispAll(false);
    setDispCompl(false);
    setDispAction(true);
  };
  const handleClickAT = () => {
    setDispAll(true);
    setDispCompl(false);
    setDispAction(false);
  };
  const handleClickCT = () => {
    setDispAll(false);
    setDispCompl(true);
    setDispAction(false);
  };

  const handleClickGraph = () => {
    setFloatDiv(false);
    setFloatDivGraph(true);
    setGlass(true);
  };
  const handleClickLogout = ()=>{
    navigate('/');
  }
  const handleClickSMS = async ()=>{
    let response = await sendSMSAction(userData.user.phoneNo);
    alert(`Action plan sent to your mobile +91 ${userData.user.phoneNo}`)
    console.log(response);
  }
  useEffect(() => {
    if(userData!=="Wrong email or password!"){
        for (let i = 0; i < userData.task.length; i++) {
            if (userData.task[i].status !== "Not Completed") {
              completedTask.push(userData.task[i]);
            } else {
              notCompletedTask.push(userData.task[i]);
            }
          }
    } 
  }, [userData]);

  return (
    userData!=="Wrong email or password!" && <>
      {glass && floatDiv && (
        <GlassDiv>
          <Addtask setDivAdd={setFloatDiv} />
        </GlassDiv>
      )}
      {glass && floatDivGraph && (
        <GlassDiv>
          {" "}
          <Tree
            data={{ initialNodes, initialEdges }}
            glass={setFloatDivGraph}
          />{" "}
        </GlassDiv>
      )}
      {glass && floatProfile && (
        <GlassDiv><Profile data={userData.user} floatProfile={setFloatProfile}/></GlassDiv>
      )
      }

      <div className="context">
        <div className="welcome welcome-xl">
          <div className="user-name">
            <div className="app-name">
            <i className="fa-brands fa-servicestack" style={{ color: "deepskyblue",'fontSize': '50px','marginRight':'10px' }}></i>
              <span>Task Tracker</span>
              </div>
            <div className="user-name-display">{`Welcome, ${userData.user.fname}`}</div>
          </div>
          <div className="menu">
            <div className="menu-item">
              <button className="options" onClick={handleClickAP}>
              <i className="fa-solid fa-clipboard-list" style={{ color: "blueviolet",'fontSize': '20px','marginRight':'10px' }}></i>
                <span>Action Plan</span>
                </button>
              <button className="options" onClick={handleClickAT}>
              <i className="fa-solid fa-map" style={{ color: "cadetblue",'fontSize': '20px','marginRight':'10px' }}></i>
                <span>All task</span>
              </button>
              <button className="options" onClick={handleClickCT}>
              <i className="fa-regular fa-rectangle-list" style={{ color: "orange",'fontSize': '20px','marginRight':'10px' }}></i>
                <span>Completed Task</span>
              </button>
              <button className="options" onClick={handleClickGraph}>
                <i className="fa-solid fa-diagram-project" style={{ color: "yellowgreen",'fontSize': '20px','marginRight':'10px' }}></i>
                <span> Task Graph</span>
              </button>
            </div>
            <div className="menu-item">
              <button className="options" onClick={handleClickAdd}>
              <i className="fa-solid fa-plus" style={{ color: "cyan",'fontSize': '20px','marginRight':'10px' }}></i>
                <span>Add new task</span>
              </button>
              <button className="options" onClick={handleClickSMS}>
              <i className="fa-solid fa-envelope" style={{ color: "red",'fontSize': '20px','marginRight':'10px' }}></i>
              SMS Action Plan
                </button>
            </div>
            <div className="menu-item">
              <button className="options" onClick={handleClickProfile}>
              <i className="fa-solid fa-user" style={{ color: "pink",'fontSize': '20px','marginRight':'10px' }}></i>
                <span> Profile</span>
              </button>
              <button className="options" onClick={handleClickLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket" style={{ color: "brown",'fontSize': '20px','marginRight':'10px' }}></i>
                <span> LOGOUT </span>
              </button>
            </div>
          </div>
          <div className="main-user-body">
            {dispAll && userData.task.map((data) => {
                return (<Rows key={data.task_id} data={data} setFloatAdd={setFloatDiv} />);
              })}
            {dispAction && notCompletedTask.map((data) => {
                return (<Rows key={data.task_id} data={data} setFloatAdd={setFloatDiv} />);
              })}
            {dispCompl &&  completedTask.map((data) => {
                return (<Rows key={data.task_id} data={data} setFloatAdd={setFloatDiv} />);
              })}
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
