import {Link,useNavigate} from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import SwalClass from "../common/Swal";
function Login() {
  const navigate = useNavigate();
  let baseUrl="http://localhost:5003/login"
  const [loginVal, setLoginValues] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setLoginValues({ ...loginVal, [e.target.name]: e.target.value });
  };
  const handleLogin= async (e)=>{
      e.preventDefault()
      const loginData={
        "email":loginVal.email,
        "password":loginVal.password
      }

     await axios.post(baseUrl,loginData).then((response)=>{
        if(response?.data?.status_code==1){
          setLoginValues((loginVal)=>({
           ...loginVal,
           email:"",
           password:""
          }))
         
          localStorage.setItem("token",JSON.parse(JSON.stringify(response?.data?.data?.token)))
          navigate("/board")
           return SwalClass.success(response?.data?.message)
        }else{
          return SwalClass.error(response.data.message)
        }
     }).catch((err)=>{
      console.log(err)
     })
      
      
  }


  return (
    <div>
      <section className="vh-100" style={{backgroundColor: "#9A616D"}}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{borderRadius: "1rem"}}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="https://images.unsplash.com/photo-1580882681223-9ac7aecf1ba4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80  "
                      alt="login form"
                      className="img-fluid"
                      style={{borderRadius: "1rem 0 0 1rem"}}
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={handleLogin} >
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <i
                            className="fas fa-cubes fa-2x me-3"
                            style={{color: "#ff6219"}}
                          ></i>
                       
                        </div>

                        <h5
                          className="fw-normal mb-3 pb-3"
                          style={{letterSpacing: "1px"}}
                        >
                          Sign into your account
                        </h5>

                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={loginVal.email}
                            className="form-control form-control-lg"
                            onChange={changeHandler}
                          />
                          <label className="form-label" htmlFor="form2Example17">
                            Email address
                          </label>
                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="password"
                            className="form-control form-control-lg"
                            name="password"
                            value={loginVal.password}
                            onChange={changeHandler}
                          />
                          <label className="form-label" htmlFor="form2Example27">
                            Password
                          </label>
                        </div>

                        <div className="pt-1 mb-4">
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            type="submit"
                          >
                            Login
                          </button>
                        </div>

                        <a className="small text-muted" href="#!">
                          Forgot password?
                        </a>
                        <p className="mb-5 pb-lg-2" style={{color: "#393f81"}}>
                          Don have an account?
                
                          <Link to="/" style={{color: "#393f81"}} > Register here</Link>
                        </p>
                        <a href="#!" className="small text-muted">
                          Terms of use.
                        </a>
                        <a href="#!" className="small text-muted">
                          Privacy policy
                        </a>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
