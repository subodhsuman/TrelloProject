import { useState} from "react";
import axios from "axios";
import SwalClass from "../common/Swal.js";
import { useNavigate } from "react-router-dom";


function Board() {
  let baseUrl = "http://localhost:5003/board_create";
  let token = localStorage.getItem("token");

  const navigate=useNavigate()
  const headers = {
    Authorization:`Bearer ${token}`, 
    "Content-Type": "application/json",
  };

  const [boardval, setBoardVal] = useState({
    title: "",
    visibility: "public",
  });

  const changeHandler = (e) => {
    setBoardVal({ ...boardval, [e.target.name]: e.target.value });
  };

  const handleBoardCreate = async (e) => {
    e.preventDefault();
    const postData = {
      title: boardval?.title,
      visibility: boardval?.visibility,
    };
    axios.post(baseUrl, postData, { headers })
      .then((response) => {
        if (response?.data?.status_code == 1) {
          setBoardVal((boardval) => ({
          ...boardval,
            title: "",
            visibility: "",
          }));
          navigate(`/boardget?id=${response?.data?.data?._id}`);
          return SwalClass.success(response?.data?.message);
        }
        if(response?.data?.status_code == 1){
          return SwalClass.error(response?.data?.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div className="bg-image">
        <img
          src="https://mdbcdn.b-cdn.net/img/new/standard/city/053.webp"
          className="img-fluid"
          alt="Sample"
          style={{ position: "relative" }}
        />
        <div
          className="mask "
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            position: "absolute",
            zIndex: "1",
            left: "40%",
            top: "40%",
          }}
        >
          <div
            className="d-flex justify-content-center align-items-center h-100 "
            style={{ width: "390px", color: "white" }}
          >
            <form onSubmit={handleBoardCreate}>
              <div className="form-group ">
                <label htmlFor="exampleFormControlInput1">Board Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="board title...."
                  name="title"
                  value={boardval?.title}
                  onChange={changeHandler}
                />
              </div>
              <div className="form-group my-4">
                <label htmlFor="exampleFormControlSelect1">
                  Select Visibility
                </label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  onChange={changeHandler}
                  value={boardval.visibility}
                  name="visibility"
                >
                  <option value="public">public</option>
                  <option value="private">private</option>
                  <option value="workspace">WorkSpace</option>
                </select>
              </div>

              <div className="d-flex justify-content-center ">
                <button type="submit" className="btn btn-primary btn-lg">
                  Board Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;
