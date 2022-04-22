import React, { useState } from 'react'
import { useNavigate  } from "react-router-dom";


const Signup = (props) => {
    const [credentials, setCredentials] = useState({name: "",email: "", password:"",cpassword:""});
    let navigate  = useNavigate();   

    const handleSubmit = async (e) =>{    
        e.preventDefault();
        const {name, email, password}=credentials;
        console.log(name,email,password);

        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, password})
          });
          const json = await response.json();
          console.log("response",json); 
          if (json.success) {
              //Save auth token and redirect
              localStorage.setItem('token', json.authtoken);
              navigate("/login");
              props.showAlert("Account Created Successfully", "success")

          }else{
              props.showAlert("invalid credentials", "danger")
          }
    }

    const onChange = (e) =>{
        setCredentials({...credentials, [e.target.name]:e.target.value})
    }
  return (
    <div className="container">
    <h3>Create an account to use iNoteBook</h3>

      <form onSubmit={handleSubmit}>
          
        <div className="form-group my-3">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={onChange}
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={onChange}
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name='password'
            onChange={onChange}
            placeholder="Password"
            minLength={5}
            required
          />
        </div>
        
        <div className="form-group my-3">
          <label htmlFor="exampleInputPassword1">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            onChange={onChange}
            name="cpassword"
            placeholder="Password"
            minLength={5}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary my-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
