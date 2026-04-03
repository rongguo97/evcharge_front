import { Outlet } from "react-router-dom";
import Header from "./Header";

// 홈페이지 구조를 표시하는 곳: 머리말, 본문, 꼬리말
function Layout() {
  return (
    <>
      <div>
        {/* 머리말 코딩 */}
        <Header></Header>

        <div className="container mx-auto mt-8 px-3">
          {/* 본문: 메뉴를 클릭하면 Outlet 위치에 본문 화면이 표시됩니다. 예) 홈 클릭 -> Home 화면이 Outlet 위치에 표시됨 */}
          <Outlet />
        </div>

        {/* 꼬리말 코딩*/}
      </div>
    </>
  );
}

export default Layout;
