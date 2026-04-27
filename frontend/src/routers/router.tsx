import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../layout/Home";
import Pay from "../pages/Wallet";
import Cash from "../pages/Cash";
import MyPage from "../pages/MyPage";
import AppIntro from "../pages/AppIntroduction"; 
import Notice from "../pages/Notice";
import FAQ from "../pages/faq";
import CustomerCenter from "../pages/CustomerService";
import Login from "../layout/Login";
import Brand from "../pages/Brand";
import Door from "../layout/Door"; 
import Communication from "../pages/Communication";
import AdminPage from "../pages/AdminPage";
import MyPagep from "../pages/MyPagep";
import Membership from "../pages/Membership";
import ReservationPage from "../pages/ReservationPage";
import Editmember from "../pages/Editmember";


const router = createBrowserRouter([
  // 1️⃣ [독립 페이지] Navbar/Footer가 없는 깨끗한 화면
  {
    path: "/",
    element: <Home />, // 인트로 및 로그인
  },
  {
    path: "/membership", 
    element: <Membership />, // 회원가입 (Layout 밖으로 꺼낸 것 유지)
  },

  // 2️⃣ [레이아웃 페이지] Navbar가 공통으로 들어가는 페이지들
  {
    path: "/main",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> }, // /main 접속 시 기본 화면
      { path: "brand", element: <Brand /> },
      { path: "reservation", element: <ReservationPage /> },
      { path: "pay", element: <Pay /> },
      { path: "cash", element: <Cash /> },
      { path: "app", element: <AppIntro /> },
      { path: "notice", element: <Notice /> },
      { path: "faq", element: <FAQ /> },
      { path: "community", element: <Communication /> },
      { path: "customer-center", element: <CustomerCenter /> },
      { path: "editmember", element: <Editmember /> },
      
      // 💡 중복 제거 및 관리: 마이페이지와 어드민은 하나씩만 유지
      { path: "mypage", element: <MyPage /> },
      { path: "mypagep", element: <MyPagep /> },
      { path: "admin", element: <AdminPage /> },
      { path: "edit", element: <Editmember /> },
      
      // 별도의 로그인 페이지가 main 내부에 필요한 경우 유지
      { path: "login", element: <Login /> }, 
    ],
  },
  
  // 3️⃣ [예외 처리] 잘못된 주소로 들어왔을 때 Door로 리다이렉트 (선택 사항)
  {
    path: "*",
    element: <Door />,
  }
]);

export default router;