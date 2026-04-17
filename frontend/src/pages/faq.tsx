import React, { useState } from 'react';
import '../css/faq.css' // 제공해주신 중복 제거된 faq.css를 사용하세요.

interface IFAQ {
  question: string;
  answer: string;
}

const FAQPage: React.FC = () => {
  // FAQ 데이터를 배열로 관리하여 유지보수를 편하게 합니다.
  const faqData: IFAQ[] = [
    {
      question: "충전소는 어떻게 찾나요?",
      answer: "앱 또는 웹에서 위치 기반으로 주변 충전소를 바로 확인할 수 있습니다."
    },
    {
      question: "결제 방식은 무엇이 있나요?",
      answer: "카드결제, 간편결제, 그리고 CHARCAGE 지갑 충전을 지원합니다."
    },
    {
      question: "충전 중 오류가 발생하면?",
      answer: "고객센터 또는 앱 내 문의하기를 통해 즉시 지원받을 수 있습니다."
    },
    {
      question: "환불은 가능한가요?",
      answer: "미사용 금액에 한해 정책 기준에 따라 환불 처리됩니다."
    }
  ];

  // 클릭된 카드의 인덱스를 저장하는 상태 (아코디언 동작)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    // 이미 열려있는 것을 클릭하면 닫고, 아니면 해당 인덱스를 엽니다.
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      {/* 1. Hero Section */}
      <section className="app-hero">
        <div className="container app-hero-flex">
          <div className="hero-text">
            <span className="badge">고객지원</span>
            <h1>언제나 만족스러운 CHARCAGE 고객지원센터 입니다.</h1>
            <p>
              전국 충전소 검색부터 예약, 결제까지<br />
              차카지 앱 하나면 충분합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FAQ Card Section */}
      <section className="faq-card-section">
        <div className="container">
          <h2 className="faq-title">자주 묻는 질문</h2>
          <div className="faq-grid">
            {faqData.map((item, index) => (
              <div 
                key={index} 
                className={`faq-card ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                <div className="faq-q">
                  <h3>{item.question}</h3>
                  <span>›</span>
                </div>
                <div className="faq-a">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;