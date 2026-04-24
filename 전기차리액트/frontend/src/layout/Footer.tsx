import '../css/main.css'
import logo from '../image/브랜드logo.png'

const Footer = () => {
   return (
<footer className="white-footer">
  <div className="container footer-flex">
    <div className="footer-logo">
      <img src={logo} alt="CHARCAGE" />
    </div>
    <div className="footer-info">
      <p>회사이름 : 차카지 </p>
      <p> 대표이사 : 이팀이지 </p>
      <p>사업자번호 : 123-45-67890</p>
      <p>주소 : 부산광역시 부산구 중앙대로</p>
      <p>E-mail : help00charcage.com</p>
      <p className="copy">© 2026 CHARCAGE. All Rights Reserved.</p>
    </div>
    <div className="footer-contact">
      <p>
        영업 및 협력문의 <strong>1577-1234</strong>
      </p>
      <p>
        비즈니스 투자문의 <strong>1577-1234</strong>
      </p>
      <p>
        고객센터 <strong>1577-1234</strong>
      </p>
    </div>
  </div>
</footer>
  );
};

export default Footer;
