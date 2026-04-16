import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import App from "../pages/servi/App";
import Cash from "../pages/servi/Cash";
import MyPage from "../pages/servi/MyPage";
import MyPagep from "../pages/servi/MyPagep";
import Membership from "../pages/servi/Membership";
import Pay from "../pages/servi/Pay";




// 인터넷주소와 화면을 연결하는 곳: 
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // 리액트 기본주소: http://localhost:5173 + /(path)
      // path: "인터넷주소"
      // element: 조각(리액트 페이지)
      // 옵션 : index: true(처음에 뜨는 페이지, 메인페이지)
      { index: true, path: "/", element: <Home/> },
      // 위와 같이 코딩하면 인터넷주소와 화면이 연결됩니다. 예) /(http://localhost:5173/) 주소는 Home 화면이 뜹니다.
      // /variable 메뉴 클릭-> Variable.tsx 페이지가 화면에 표시됨

          // ⭐️ 추가   
    
    ]},
    {path: "mypage", element: <MyPage />}, 
    {path: "mypagep", element: <MyPagep />},
    {path: "membership", element: <Membership />},
    {path: "app", element: <App />},
    {path: "cash", element:<Cash />},
    {path: "pay", element:<Pay />}, 
  ],);

export default router;
