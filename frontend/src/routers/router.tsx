import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../layout/Home";
import Pay from "../pages/Wallet";
import Cash from "../pages/Cash";
import MyPage from "../pages/MyPage";
import App from "../pages/App";
import Admin from "../pages/AdminPage";
import ReservationPage from "../pages/ReverlationPage";
import Notice from "../pages/Notice";
import FAQ from "../pages/faq";
import CustomerCenter from "../pages/CustomerService";
import Login from "../layout/Login";
import Brand from "../pages/Brand";

// (이론)성능 증가 팁 코딩: 코드 스플리팅(Route Code Splitting) 기능(페이지 뜨는 속도가 빨라짐)
// 보충설명: 1) 기본: 화면이 뜨면 리액트의 모든 페이지를(부서,사원) 가져옵니다.
//          2) 메뉴를 클릭할때만 해당 화면을 가져옵니다.(코드 스플리팅 기능)
//  => 1) Suspense 태그 이용
//  => 2) lazy(), import() 함수이용

// 인터넷주소와 화면을 연결하는 곳:
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // { index: true, path: "인터넷주소", element: <리액트페이지 /> },
      // 위와 같이 코딩하면 인터넷주소와 화면이 연결됩니다. 예) /(http://localhost:5173/) 주소는 Home 화면이 뜹니다.
      // index: true - 첫페이지를 의미
      { index: true, path: "/", element: <Home /> },
      // 예약페이지
      { index: true, path: "/reservation", element: <ReservationPage /> },
      // 지갑 및 결제 관련 페이지
      { path: "/pay", element: <Pay /> },
      { path: "/cash", element: <Cash /> },
      // 마이페이지
      { path: "/mypage", element: <MyPage /> },
      // 관리자 페이지
      { path: "/admin", element: <Admin /> },
      // 앱 소개 페이지
      { path: "/app", element: <App /> },
      // 공지사항 페이지
      { path: "/notice", element: <Notice />},
      // FAQ 페이지
      { path: "/faq", element: <FAQ /> },
      // 고객센터 페이지
      { path: "/customer-center", element: <CustomerCenter /> },
      // 로그인 페이지
      { path: "/login", element: <Login /> },
      // 브랜드 소개 페이지
      { path: "/brand", element: <Brand /> }




      

    ],
  },
]);

export default router;
