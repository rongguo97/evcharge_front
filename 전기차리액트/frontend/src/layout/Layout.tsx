import { Outlet, useLocation } from "react-router-dom"; // useLocation 추가
import Header from "../layout/Header";
import QuickMenu from "./Quickmenu";

function Layout() {
  // 1. 현재 페이지의 경로 정보를 가져옵니다.
  const location = useLocation();

  // 2. 헤더를 숨기고 싶은 경로들을 배열로 정의합니다.
  // 주소가 '/mypage'나 '/admin'으로 시작하는지 체크합니다.
  const hideHeaderPaths = ["/mypage", "/admin"];
  
  // 3. 현재 경로가 숨김 목록에 포함되어 있는지 확인합니다.
  const shouldHideHeader = hideHeaderPaths.some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div id="wrapper">
      {/* 4. shouldHideHeader가 false일 때만 Header를 렌더링합니다. */}
      {!shouldHideHeader && <Header />}

      <QuickMenu />

      <div className="content-area">
        <Outlet />
      </div>


    </div>
  );
}

export default Layout;