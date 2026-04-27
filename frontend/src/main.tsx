import ReactDOM from 'react-dom/client'
import App from './App' // 확장자 .tsx는 생략 가능합니다.
import './index.css'

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <App />
  );
} else {
  console.error("index.html에서 id가 'root'인 태그를 찾을 수 없습니다.");
}