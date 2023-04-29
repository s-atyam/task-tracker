import "./CompCSS.css";
import {Link} from 'react-router-dom';
const Landing = () => {
  return (
    <>
      <div className="context">
        <div className="welcome">
          <h1>Welcome to Task Tracker</h1>
          <p className="yellow" style={{'fontSize':'20px'}}>
            Manage your tasks efficiently
          </p>
          <div className="logSign">
            <Link className="btn" to="/login">Login</Link>
            <Link className="btn" to="/signup" >Sign up</Link>
          </div>
          <h4>Made with React, Javascript, Mysql</h4>
        </div>
      </div>
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </>
  );
};
export default Landing;
