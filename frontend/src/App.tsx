import { HeadProvider } from "react-head";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./routers/router"; //  여기서 모든 경로를 관리합니다.
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <HeadProvider>
        {/* 💡 router 파일에 정의된 규칙대로 페이지를 보여줍니다. */}
        <RouterProvider router={router} />
      </HeadProvider>
    </AuthProvider>
  );
}

export default App;