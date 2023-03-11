import "../../css/utility/header.css";
import { useState } from "react";
import { useEffect } from "react";

export function Header() {
  const [loginPopup, setLoginPopup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(null);
  const [credentials, setCredentials] = useState('')

  useEffect(() => {
    setCredentials(localStorage.getItem('username'))
  })
  const loginModalPopup = () => {
    setLoginPopup(!loginPopup);
  };
  const body = {
    username: username,
    password: password,
  }
  const login = async (e) => {
    try {
      const push = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const res = await push.json()
      console.log(res);
      getUser();
    } catch (err) {
      console.log(err);
    }
  }


    const getUser = async (e) => {
      try {
        const push = await fetch("http://localhost:8000/getUser",
         {
          method: "GET",
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
        });
        const data = await push.json()
        console.log(data);
        localStorage.setItem('username', data.message.userName)
        setCredentials(localStorage.getItem('username'))
        console.log(credentials)
     
  
      } catch (err) {
        console.log(err);
      }
    }
  const recordUsername = (e) => {
    setUsername(e.target.value)
  }
  const recordPassword = (e) => {
    setPassword(e.target.value)
  }
  return (
    <header className="headermainwrap">
      <div className="logowrap"><p>Paperplanes</p><svg className="paperplanesvg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z"/></svg></div>
      {/* <section className="loginsvgandmodalwrap"> */}
      <div onClick={loginModalPopup} className="loginwrap">
      <svg className="accountsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-circle-outline</title><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z" /></svg>
      </div>
      <div className={loginPopup ? "loginpopup" : "hide"}>
        <button>X</button>
        <p>Not a member?<a href="register">Join Now!</a></p>
        <label>
          <input className="loginInputs" onChange={(e) => recordUsername(e)} name="username" placeholder="Username"></input>
        </label>
        <label>
          <input  className="loginInputs" onChange={(e) => recordPassword(e)} name="password" placeholder="Password"></input>
        </label>
        <button onClick={login}>Login</button>
        {/* <button>Register</button> */}
        </div>
    </header>
  );
}
export default Header;
