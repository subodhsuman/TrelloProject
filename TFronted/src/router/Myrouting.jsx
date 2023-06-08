import { Routes, Route} from "react-router-dom";
import Registration from "../pages/Registration.jsx";
import Login from "../pages/Login.jsx";
import Board from "../pages/Board.jsx";
import Navbar from "../pages/Navbar.jsx";
import BoardGet from "../component/BoardGet.jsx";

const  Router = ()=> {
  const routes = [
    {
      path: "/",
      name: "Registration",
      Component:Registration 
    },
    {
      name: "Login",
      path: "/login",
      Component:Login 
    },
    {
      name: "Board",
      path: "/board",
      Component:Board 
    },
    {
      name: "navbar",
      path: "/navbar",
      Component:Navbar 
    },
    {
      name: "boardget",
      path: "/boardget",
      Component:BoardGet 
    },
  ];

  // translate (map) your array of objects into jsx
  const Routing = routes.map(({ path, Component }, i) => (
    <Route key={i} path={path} element={<Component />} />
  ));

  return (
    <div className="">
      <Routes>{Routing}</Routes>
    </div>
  );
}
export default Router;