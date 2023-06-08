import { useState } from "react";
import axios from "axios";
import SwalClass from "../common/Swal";
import { useNavigate,Link  } from "react-router-dom";


function Registration() {
  const navigate = useNavigate();

  let baseUser = "http://localhost:5003/user_create";
  const [allValues, setAllValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const changeHandler = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };
  const HandleSubmit = async (e) => {
    e.preventDefault();
    const form_Data = {
      name: allValues?.username,
      email: allValues?.email,
      password: allValues?.password,
    };
    await axios
      .post(baseUser, form_Data)
      .then(function (response) {
        if (response.data.status_code == 1) {
          setAllValues((allValues) => ({
            ...allValues,
            username:"",
            email:'',
            password:'',
            confirmPassword:""
          }));
          navigate("/login")
          return SwalClass.success(response?.data?.message);
        } else {
          return SwalClass.error(response?.data?.message);
        }
      })
      .catch((err) => {
        SwalClass.error(err.message);
      });
  };
  return (
    <div>
      <section className="vh-100" style={{ backgroundColor: "#eee" }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div
                className="card text-black"
                style={{ backgroundColor: "#eee" }}
              >
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                        Sign up
                      </p>

                      <form className="mx-1 mx-md-4" onSubmit={HandleSubmit}>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              id="username"
                              name="username"
                              value={allValues?.username}
                              onChange={changeHandler}
                              className="form-control"
                              placeholder="enter name...."
                            />
                            <label
                              className="form-label"
                              htmlFor="form3Example1c"
                            >
                              Your Name
                            </label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="email"
                              id="email"
                              className="form-control"
                              value={allValues.email}
                              name="email"
                              onChange={changeHandler}
                              placeholder="enter email...."
                            />
                            <label
                              className="form-label"
                              htmlFor="form3Example3c"
                            >
                              Your Email
                            </label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="password"
                              id="form3Example4c"
                              className="form-control"
                              name="password"
                              value={allValues?.password}
                              onChange={changeHandler}
                              placeholder="enter password...."
                            />
                            <label
                              className="form-label"
                              htmlFor="form3Example4c"
                            >
                              Password
                            </label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="password"
                              id="confirmPassword"
                              className="form-control"
                              value={allValues?.confirmPassword}
                              name="confirmPassword"
                              onChange={changeHandler}
                              placeholder="enter confirm password"
                            />
                            <label
                              className="form-label"
                              htmlFor="form3Example4cd"
                            >
                              Repeat your password
                            </label>
                          </div>
                        </div>

                        <div className="form-check d-flex justify-content-center mb-5">
                          <input
                            className="form-check-input me-2"
                            type="checkbox"
                            value=""
                            id="form2Example3c"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="form2Example3"
                          >
                            I agree all statements in
                            <a href="#!">Terms of service</a>
                          </label>
                        </div>

                        <p className="text-center text-muted mt-5 mb-1">
                          Have already an account?
                          <Link className="fw-bold text-body" to="/login"><u>Login here</u></Link>
                        </p>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                          >
                            Register
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                        className="img-fluid"
                        alt="Sample image"
                      />
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

export default Registration;
