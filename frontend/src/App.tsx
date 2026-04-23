import { HeadProvider } from "react-head";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./routers/router";
import { AuthProvider } from "./context/AuthContext"; // 1. AuthProvider 임포트

function App() {
  return (
    <>
      {/* 2. AuthProvider로 전체를 감싸줍니다. 
        이렇게 하면 router.ts 안에 정의된 모든 페이지(Login, Home 등)에서 
        useAuth()를 사용할 수 있게 됩니다. 
      */}
      <AuthProvider>
        <HeadProvider>
          <RouterProvider router={router} />
        </HeadProvider>
      </AuthProvider>
    </>
  );
}

export default App;