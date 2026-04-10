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
  "1": "B타입(5핀)", "01": "B타입(5핀)",
  "2": "C타입(5핀)", "02": "C타입(5핀)",
  "3": "BC타입(5핀)", "03": "BC타입(5핀)",
  "4": "BC타입(7핀)", "04": "BC타입(7핀)",
  "5": "DC차데모", "05": "DC차데모",
  "6": "AC3상", "06": "AC3상",
  "7": "DC콤보", "07": "DC콤보",
  "8": "DC차데모+DC콤보", "08": "DC차데모+DC콤보"
};

export const SPEED_MAP: { [key: string]: string } = {
  "01": "급속",
  "02": "완속",
  "1": "급속",
  "2": "완속",
  Fast: "급속",
  Slow: "완속",
};

// 주소의 첫 단어가 "서울"이면 "서울특별시"로, "경남"이면 "경상남도"로 통일합니다.
export const normalizeSido = (addr: string) => {
  if (!addr) return "기타";
  const sido = addr.split(" ")[0];
  switch (sido) {
    case "서울": return "서울특별시";
    case "경기": return "경기도";
    case "인천": return "인천광역시";
    case "대구": return "대구광역시";
    case "광주": return "광주광역시";
    case "대전": return "대전광역시";
    case "울산": return "울산광역시";
    case "부산": return "부산광역시";
    case "세종": return "세종특별자치시";
    case "강원": return "강원특별자치도";
    case "충북": return "충청북도";
    case "충남": return "충청남도";
    case "전북": return "전라북도";
    case "전남": return "전라남도";
    case "경북": return "경상북도";
    case "경남": return "경상남도";
    case "제주": return "제주특별자치도";
    default: return sido; // 이미 풀네임인 경우 그대로 반환
  }
};

/**
 * 코드를 한글 명칭으로 변환해주는 헬퍼 함수들
 */
export const getStatusLabel = (code: string | number) => statusMap[String(code)] || "정보없음";
export const getTypeLabel = (code: string | number) => typeMap[String(code)] || "정보없음";
export const getMethodLabel = (code: string | number) => methodMap[String(code)] || "정보없음";