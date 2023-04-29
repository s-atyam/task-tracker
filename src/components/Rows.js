import userContext from "../context/UserContext";
import { useState,useContext } from "react";

const Rows = (props)=>{

    const context = useContext(userContext);
    const { complete,userData } = context;

    let bool = false;
    if(props.data.status!=="Not Completed"){
        bool=true;
    }

    const [check,setCheck] = useState(bool);

    const handleClick = async () =>{
        let q = window.confirm("Are you sure?");
        if(q){
            let response = await complete(userData.user,props.data.task_id);
            if(response.length===0){
                if(!check)
                setCheck(true);
            }else{
                console.log(response[0])
                let s = "Cannot complete task, it depend on : \n"
                for(let i=0;i<response.length;i++){
                    s = s + response[i].dependency_id + "\n"
                }
                alert(s);
            }
        }
    }
    return (
        <>
        <div className="row">
            <div className="row-task t_id" style={{'color':'cyan'}}>{props.data.task_id}</div>
            <div className="row-task t_name" style={{'color':'pink'}}>{props.data.task_name}</div>
            <div className="row-task t_desc" style={{'color':'white'}}>{props.data.description}</div>
            <p className="row-task t_due" style={{'color':'cadetblue'}}>{props.data.due_date.substring(0,10)}</p>
            <div className="row-task t_operations">
            
            <i className={!check?'fa-regular fa-square-check t_icon t_icon_cross':'fa-solid fa-square-check t_icon t_icon_complete'} onClick={handleClick}></i>
            </div>
            <div className=""></div>
        </div>
        </>
    )
}
export default Rows;