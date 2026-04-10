// 1. 상태(Status) 매핑
export const statusMap: { [key: string]: string } = {
  "1": "충전가능",
  "2": "충전중",
  "3": "고장/점검",
  "4": "통신장애",
  "5": "통신미연결",
  "6": "충전종료",
  "7": "계획정지"
};

// 2. 충전기 타입(Type) 매핑 (보내주신 switch 문 기준)
export const typeMap: { [key: string]: string } = {
  "1": "완속",
  "2": "급속"
};

// 3. 충전 방식(Method) 매핑 (보내주신 switch 문 기준)
export const methodMap: { [key: string]: string } = {
  "1": "B타입(5핀)",
  "2": "C타입(5핀)",
  "3": "BC타입(5핀)",
  "4": "BC타입(7핀)",
  "5": "DC차데모",
  "6": "AC3상",
  "7": "DC콤보",
  "8": "DC차데모+DC콤보"
};

/**
 * 코드를 한글 명칭으로 변환해주는 헬퍼 함수들
 */
export const getStatusLabel = (code: string | number) => statusMap[String(code)] || "정보없음";
export const getTypeLabel = (code: string | number) => typeMap[String(code)] || "정보없음";
export const getMethodLabel = (code: string | number) => methodMap[String(code)] || "정보없음";