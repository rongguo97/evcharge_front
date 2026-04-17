import { Outlet, useLocation } from "react-router-dom"; // useLocation 추가
import Header from "./Header"
import Footer from "./Footer";
import "./Layout.css";

function Layout() {
  const location = useLocation();

  const isMyPage = location.pathname === '/mypage';

  
  return (
    <>
      <div className="container mx-auto mt-8 px-3">
       
        {!isMyPage && (
          <div>
            <Header />
          </div>
        )}
  

        <div className="mt-10">
          <Outlet />
        </div>

       
        <Footer />
      </div>
    </>
  );
}

export default Layout;

