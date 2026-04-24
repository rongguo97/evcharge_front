import { HeadProvider } from "react-head";
import { RouterProvider } from "react-router-dom";
import "./App.css"
import router from "./routers/router";
// 목적: 리액트가 실행하면 제일 처음 읽는 파일, 여기에 me 를 넣어도 됩니다.
function App() {

  return (
    <>
      {/* 메뉴 설정(RouterProvider), 검색엔진 순위 올림(HeadProvider) */}
      <HeadProvider>
        <RouterProvider router={router} />
      </HeadProvider>
    </>
  );
}

export default App;