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
import Door from "../layout/Door";
import Communication from "../pages/Communication";
import AdminPage from "../pages/AdminPage";
import MyPagep from "../pages/MyPagep";
import Membership from "../pages/Membership";



const router = createBrowserRouter([
  // ✅ Door - 첫 진입 페이지 (navbar 없음)
  {
    path: "/",
    element: <Door />,
  },

  // ✅ Layout(navbar) 있는 페이지들
  {
    path: "/main",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "reservation", element: <ReservationPage /> },
      { path: "pay", element: <Pay /> },
      { path: "cash", element: <Cash /> },
      { path: "mypage", element: <MyPage /> },
      { path: "admin", element: <Admin /> },
      { path: "app", element: <App /> },
      { path: "notice", element: <Notice /> },
      { path: "faq", element: <FAQ /> },
      { path: "customer-center", element: <CustomerCenter /> },
      { path: "login", element: <Login /> },
      { path: "brand", element: <Brand /> },
      { path: "community", element: <Communication /> },
      { path: "mypage", element: <MyPage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "mypagep", element: <MyPagep /> },
      { path: "membership", element: <Membership /> },
    ],
  },
]);

export default router;


