import "./boardget.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SwalClass from "../common/Swal";

function BoardGet() {
  const [val, setVal] = useState({});
  const [title, setTitle] = useState("");
  const [boardList, setBoardList] = useState([]);
  const [cardtile, setCareTitle] = useState({ value: "", listId: "" });
  const[renameList,setRenameList]=useState({ListedId:"",listName:""})
  // const [cardData, setCardData] = useState([]);

  let token = localStorage.getItem("token");
  const [searchParams] = useSearchParams();
  let id = searchParams.get("id");

  let headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const getBoard = async () => {
    await axios
      .get(`http://localhost:5003/getboard_id/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(function (response) {
        setVal(response.data.data);
        if (response?.data?.status_code == 1) {
          return SwalClass.success(response?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AddList = async (e) => {
    e.preventDefault();
    const postData = {
      boardId: id,
      title: title,
    };
    await axios
      .post(`http://localhost:5003/add_list`, postData, { headers })
      .then((response) => {
        if (response?.data?.status_code == 1) {
          setTitle("");
          getBoardList();
          return SwalClass.success(response?.data?.message);
        }
        if (response?.data?.status_code == 0) {
          return SwalClass.error(response?.data?.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const RenameListName=()=>{

  }

  const getBoardList = async () => {
    await axios
      .get(`http://localhost:5003/get_list_board/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(function (response) {
        if (response?.data?.status_code == 1) {
          setBoardList(response?.data?.data);

          return SwalClass.success(response?.data?.message);
        }
        if (response?.data?.status_code == 0) {
          return SwalClass.error(response?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AddToCard = async (e) => {
    e.preventDefault();
    const postData = {
      title: cardtile?.value,
      listId: cardtile?.listId,
      boardId: id,
    };

    await axios
      .post(`http://localhost:5003/add_card`, postData, { headers })
      .then((response) => {
        if (response?.data?.status_code == 1) {
          setCareTitle({ value: "", listId: "" });
          getBoardList();
          return SwalClass.success(response?.data?.message);
        }
        if (response?.data?.status_code == 0) {
          return SwalClass.error(response?.data?.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const DeleteCard = async (cardId, ListId) => {
    const deletedId = {
      listId: ListId,
      cardId: cardId,
    };
    let response = await axios.delete("http://localhost:5003/delete_card", {
      headers: headers,
      data: deletedId,
    });
    if (response?.data?.status_code == 1) {
      SwalClass.success(response?.data?.message);
      await new Promise((resolve) => setInterval(resolve, 2000));
      getBoardList();
    }
    if (response?.data?.status_code == 0) {
      return SwalClass.error(response?.data?.message);
    }
  };

  useEffect(() => {
    getBoard();
    getBoardList();
  }, []);

console.log({ListedId:renameList.ListedId,listName:renameList.listName},"heelo")
  return (
    <div className="board-get">
      <nav className="navbar rounded-0 mb-3">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#">
            {val?.title}
          </a>
        </div>
      </nav>
      <div className="p-2 d-flex gap-4 main-div">
        {/* <button className="add-list border-0 py-3 rounded-3 text-white text-start ps-3">
          + Add a list
        </button> */}
        <div className="add-list-input bg-black text-white p-2 rounded-3 text-white">
          <form onSubmit={AddList}>
            <input
              type="text"
              className="rounded-1 bg-black border-2 border-primary-subtle w-100 p-2 text-white"
              placeholder="Enter list title"
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              value={title}
              id="title"
            />

            <div className="py-2 d-flex gap-2">
              {val?.lists?.length == 0 ? (
                <>
                  <button className="border-0 bg-primary text-white rounded-1 px-3 py-1">
                    + Add a list
                  </button>
                  <button className="border-0 bg-transparent text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="#fff"
                    >
                      <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <button className="border-0 bg-primary text-white rounded-1 px-3 py-1">
                    Add list
                  </button>
                  <button className="border-0 bg-transparent text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="#fff"
                    >
                      <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
        {boardList?.map((v, i) => {
          return (
            <div
              className="add-card bg-black p-2 rounded-1 d-flex flex-column justify-content-between"
              key={i}
            >
              <div className="add-card-inner d-flex align-items-center justify-content-between">
                <p className="text-white">{v?.title}</p>
                <div className="dropdown">
                  <button
                    className="btn "
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                    onClick={() => {setRenameList({ListedId:v._id})}}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#fff"
                      className="bi bi-three-dots"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="add-card-btn-box">
                {v?.cards?.map((val, index) => {
                  return (
                    <p
                      className="text-white bg-dark p-2 rounded-1 d-flex justify-content-between"
                      key={index}
                    >
                      <span>{val?.title}</span>
                      <div className="d-flex gap-2">
                        <button className="border-0 bg-transparent p-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="#fff"
                          >
                            <path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path>
                            <path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path>
                          </svg>
                        </button>
                        <button className="border-0 bg-transparent p-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="#fff"
                            onClick={() => DeleteCard(val._id, v._id)}
                          >
                            <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
                            <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
                          </svg>
                        </button>
                      </div>
                    </p>
                  );
                })}
                <div>
                  <form onSubmit={AddToCard}>
                    <input
                      type="text"
                      className="rounded-1 bg-black border-2 border-primary-subtle w-100 p-2 text-white"
                      placeholder="Enter a title for this card"
                      value={cardtile?.listId == v?._id ? cardtile?.value : ""}
                      onChange={(e) => {
                        setCareTitle({ value: e.target.value, listId: v?._id });
                      }}
                    />
                    <button
                      className="add-card-btn border-0 mt-3 w-100 bg-transparent rounded-3 text-white text-start ps-3"
                      type="submit"
                    >
                      + Add a card
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Edi List Title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <label htmlFor="exampleInputEmail1" className="form-label">
                   Add List Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  onChange={(e)=>{setRenameList({listName:e.target.value})}}
                  value={renameList}
                  name="renameList"
                />
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Understood
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardGet;
