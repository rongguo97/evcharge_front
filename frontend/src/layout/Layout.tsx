import { Outlet, useLocation } from "react-router-dom";
import Header from "../layout/Header";
import QuickMenu from "./Quickmenu";
import { useAuth } from "../context/AuthContext"; // 인증 상태 가져오기

function Layout() {
  const location = useLocation();
  const { isLoggedIn } = useAuth(); // 로그인 여부 확인

  // 1. 헤더와 퀵메뉴를 아예 숨겨야 하는 경로 (예: 인트로 비디오 화면, 로그인 화면)
  // 마이페이지나 어드민에서도 서비스 로고나 로그아웃 버튼이 필요하므로 보통 헤더는 유지합니다.
  const hideAllPaths = ["/"]; 
  
  const shouldHideUI = hideAllPaths.includes(location.pathname);

  return (
    <div id="wrapper">
      {/* 2. 인트로 화면이 아닐 때만 헤더를 보여줍니다. */}
      {!shouldHideUI && <Header />}

      {/* 3. 퀵메뉴 제어: 
         인트로 화면이 아니면서 + 실제 로그인된 사용자에게만 퀵메뉴를 노출합니다. 
         (QuickMenu 내부에서 체크해도 되지만, 여기서 제어하는 것이 더 명확합니다.)
      */}
      {!shouldHideUI && isLoggedIn && <QuickMenu />}

      <div className="content-area">
        {/* 4. 여백 최적화: 
           헤더가 fixed일 경우, 헤더가 있는 페이지에서만 상단 여백(padding-top)을 
           주도록 스타일을 동적으로 조절할 수 있습니다. 
        */}
        <main className={!shouldHideUI ? "has-header" : ""}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;