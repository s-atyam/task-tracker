import "./CompCSS.css";
import "./inputCSS.css";
import userContext from "../context/UserContext";
import { useContext, useState } from "react";
import {Link,useNavigate} from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const context = useContext(userContext);
  const { login } = context;

  const [data, setData] = useState({email:"",password:""})

  const handleClick = async (e)=>{
    e.preventDefault();
    let response = await login(data.email,data.password);
    if(response==="Wrong email or password!"){
      alert(response);
      console.log(response)
    }else{
      navigate('/home');
      console.log(response)
    }
  }
  const onChange = (e) => {
    setData({...data,[e.target.name]: e.target.value});
  }
  return (
    <>
      <div className="context">
        <div className="welcome">
            <h1 className="label">LOGIN</h1>
          <form className="welcome welcome-xs" autoComplete="off">
            <div className="form__group field">
              <input type="input" className="form__field" autoComplete="off" placeholder="Email" name="email" id="email" onChange={onChange} value={data.email} required/>
              <label htmlFor="name" className="form__label">Email</label>
            </div>
            <div className="form__group field">
              <input type="password" className="form__field" placeholder="Password" name="password" id="password" autoComplete="new-password" onChange={onChange} value={data.password} required/>
              <label htmlFor="name" className="form__label">Password</label>
            </div>
            <Link className="btn" onClick={handleClick}>Login</Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
