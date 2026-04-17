// 리액트에서 제일 처음 실행되는 파일 
// TODO: css 코딩하는 곳 

import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './router/router'

function App() {



  return (
    <>
    
    <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
