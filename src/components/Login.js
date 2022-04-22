import React, { useState } from 'react'
import { useNavigate  } from "react-router-dom";

const Login = (props) => { 
    const [credentials, setCredentials] = useState({email: "", password:""});
    let navigate  = useNavigate();   

    const handleSubmit = async (e) =>{    
        e.preventDefault();
        // console.log(credentials);
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
          });
          const json = await response.json();
          console.log(json); 
          if (json.success) {
              //Save auth token and redirect
              localStorage.setItem('token', json.authtoken);
              navigate("/");
              props.showAlert("Login successfully", "success")

          }else{
            props.showAlert("invalid credentials", "danger")
           }
    }
    const onChange = (e) =>{
        setCredentials({...credentials, [e.target.name]:e.target.value})
    }
  return (
<div className='container'>
<h3>Login to continue to iNoteBook</h3>

 <form onSubmit={handleSubmit}>
  <div className="form-group mb-3">
    <label htmlFor="email">Email address</label>
    <input type="email" className="form-control" id="email" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" placeholder="Enter email"/>
  </div>
  <div className="form-group">
    <label htmlFor="password">Password</label>
    <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChange} placeholder="Password"/>
  </div>
  <button type="submit" className="btn btn-primary my-2">Submit</button>
 </form>
</div>
  )
}

export default Login