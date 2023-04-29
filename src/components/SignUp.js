import "./CompCSS.css";
import "./inputCSS.css";
import userContext from "../context/UserContext";
import { useContext, useState } from "react";
import {Link,useNavigate} from 'react-router-dom';


const SignUp = () => {
  const navigate = useNavigate();
  const context = useContext(userContext);
  const { createUser } = context;

  const [data, setData] = useState({fname:"",lname:"",email:"",phone:"",password:""})

  const handleClick = async (e)=>{
    e.preventDefault();
    
    let response = await createUser(data.fname,data.lname,data.email,data.phone,data.password);
    console.log(response);
    navigate('/home');
  }

  const onChange = (e) => {
    setData({...data,[e.target.name]: e.target.value});
  }
  return (
    <>
      <div className="context">
        <div className="welcome">
          <h1 className="label">SIGN UP</h1>
          <form className="welcome welcome-xls" autoComplete="off">
            <div className="input-name">
            <div className="form__group field input">
              <input type="input" className="form__field" autoComplete="off" placeholder="First Name" name="fname" id="fname" value={data.fname} onChange={onChange} required />
              <label htmlFor="name" className="form__label"> First Name</label>
            </div>
            <div className="form__group field input">
              <input type="text" className="form__field" placeholder="Last Name" name="lname" id="lname" value={data.lname} onChange={onChange} required />
              <label htmlFor="name" className="form__label">Last Name</label>
            </div>
            </div>

            <div className="form__group field">
              <input type="input" className="form__field" autoComplete="off" placeholder="Email" name="email" value={data.email} onChange={onChange} id="email" required />
              <label htmlFor="name" className="form__label"> Email</label>
            </div>
            <div className="form__group field">
              <input type="input" className="form__field" autoComplete="off" placeholder="Phone" name="phone" id="phone" value={data.phone} onChange={onChange} required />
              <label htmlFor="name" className="form__label"> Phone</label>
            </div>
            <div className="form__group field">
              <input type="password" className="form__field" placeholder="Password" name="password" id="password" autoComplete="new-password" value={data.password} onChange={onChange} required />
              <label htmlFor="name" className="form__label">New Password</label>
            </div>           
            <Link className="btn" to="/signup" onClick={handleClick}>Sign Up</Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
