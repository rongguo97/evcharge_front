import { Outlet } from "react-router-dom";
import Header from "../layout/Header"; // 1. Header 컴포넌트 임포트
import Footer from "./Footer";
import QuickMenu from "./Quickmenu";


function Layout() {
  return (
    <div id="wrapper">
      {/* 1. 헤더 영역 */}
      <Header />

      {/* 2. 우측 고정 퀵메뉴 (헤더 밖에 따로 배치) */}
      <QuickMenu />

      {/* 2. 본문 영역: Outlet을 통해 페이지 내용이 표시됨 */}
      <div className="content-area">
        <Outlet />
      </div>

      {/* 3. 푸터 영역 */}
      <Footer />
    </div>
  );
}
export default Layout;