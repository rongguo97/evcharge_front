import { Outlet } from "react-router-dom";
import Header from "../layout/Header"; // 1. Header 컴포넌트 임포트
import Footer from "./Footer";


// 홈페이지 구조를 표시하는 곳: 머리말, 본문, 꼬리말
function Layout() {
  return (
    <div id="wrapper">
      {/* 2. 소문자 <header /> 대신 대문자 <Header /> 사용 */}
      <Header />
      
    
      {/* 지도가 화면에 꽉 차게 나오길 원하신다면 
         className에서 'mx-auto'나 'px-3'을 제거하거나 조절할 수 있습니다. 
      */}
      <div className="content-area">
        {/* 본문: 메뉴를 클릭하면 Outlet 위치에 본문 화면이 표시됩니다. */}
    
        <Outlet />
      </div>
  <Footer/>
    </div>
  );
}

export default Layout;