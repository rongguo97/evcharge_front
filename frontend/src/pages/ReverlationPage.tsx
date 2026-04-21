import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReservationService from "../services/ReservationService";
import StationService from "../services/StationService";
import type { IStation } from "../types/IStation";
import {
  getStatusLabel,
  getTypeLabel,
  getMethodLabel,
} from "../common/stationConverter";
// 달력 import
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
// 달력 css
import "../css/calendar.css";

function ReservationPage() {
  const location = useLocation();

  // --- [1] 상태 관리 ---
  const [keyword, setKeyword] = useState(""); // 검색어
  const [results, setResults] = useState<any[]>([]); // 검색 결과
  const [selectedStation, setSelectedStation] = useState<any>(null); // 선택된 충전소
  const [isSearching, setIsSearching] = useState(false); // 검색 중 여부

  const [chargers, setChargers] = useState<any[]>([]); // 선택된 충전소의 충전기 목록
  const [selectedCharger, setSelectedCharger] = useState<any>(null); // 선택된 충전기
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // 선택된 예약 시간

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달창 열림 여부
  const [modalStep, setModalStep] = useState(1); // 모달 단계 (1: 정보 확인, 2: 결제 정보 확인, 3: 예약 완료)

  const [currentPage, setCurrentPage] = useState(1); // 페이징 현재 페이지
  const ITEMS_PER_PAGE = 10; // 페이지당 보여줄 개수

  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // 달력에서 선택한 날짜
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // 달력 창 열림 여부

  // DB에서 가져온 예약 목록을 담을 변수를 선언합니다.
  const [reservedList] = useState<string[]>([]); // 초기값은 빈 배열
  

  // 날짜 선택 시 호출되는 함수 (시간 초기화)
  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  // 다른 페이지에서 충전소 정보를 들고 왔을 때 초기 세팅
  useEffect(() => {
    if (location.state?.preSelectedStation) {
      const station = location.state.preSelectedStation;
      setSelectedStation(station);
      setChargers(station.chargers || []);
    }
  }, [location.state]);

  // --- [2] 검색 핸들러 ---
  const handleSearch = async () => {
    if (!keyword.trim()) return;
    const searchParams = {
      searchKeyword: keyword,
      status: "",
      chargerType: "",
      chargerMethod: "",
      page: 0,
      size: 10000,
    };
    try {
      const response = await StationService.getAll(searchParams);
      const data =
        response.data.result || response.data.content || response.data;
      if (Array.isArray(data)) {
        // 동일 충전소 중복 제거 및 충전기 묶기 로직
        const groups: { [key: string]: any } = {};
        data.forEach((s: IStation) => {
          const groupKey = `${s.stationName}_${s.address}`;
          if (!groups[groupKey]) {
            groups[groupKey] = { ...s, chargers: [], groupKey };
          }
          groups[groupKey].chargers.push(s);
        });
        setResults(Object.values(groups));
        setCurrentPage(1);
        setIsSearching(true);
        setSelectedStation(null);
      }
    } catch (error) {
      console.error("충전소 검색 실패:", error);
      setResults([]);
    }
  };

  // 충전소 클릭 시 상태 업데이트
  const handleStationSelect = (group: any) => {
    setSelectedStation(group);
    setChargers(group.chargers);
    setIsSearching(false);
    setSelectedCharger(null);
    setSelectedTime(null);
  };

  // 충전기 종류(급속/완속)에 맞춰 예약 시간 슬롯 생성
  const generateTimeSlots = (charger: any) => {
    if (!charger) return [];
    const typeLabel = getTypeLabel(charger.chargerType);
    const methodLabel = getMethodLabel(charger.chargerMethod);
    let duration = 240;
    if (typeLabel.includes("급속") || methodLabel.includes("100kW"))
      duration = 40;
    else if (methodLabel.includes("50kW")) duration = 70;

    const buffer = 10; // 정비 시간(10분)
    const totalMinutes = 24 * 60;
    const slots = [];
    let currentMin = 0;

    // 00:00부터 시작해서 duration+buffer 간격으로 슬롯 계산
    while (currentMin + duration <= totalMinutes) {
      const startH = String(Math.floor(currentMin / 60)).padStart(2, "0");
      const startM = String(currentMin % 60).padStart(2, "0");
      const endMinTotal = currentMin + duration;
      let endH = String(Math.floor(endMinTotal / 60)).padStart(2, "0");
      const endM = String(endMinTotal % 60).padStart(2, "0");
      if (endMinTotal === 1440) endH = "24";
      slots.push(`${startH}:${startM} - ${endH}:${endM}`);
      currentMin = endMinTotal + buffer;
    }
    return slots;
  };

  // 최종 예약 처리 로직
  const handleConfirmReservation = async () => {
    try {
      const loggedInEmail = "test@example.com"; // 임시 이메일
      const startTimeStr = selectedTime?.split(" - ")[0];
      if (!startTimeStr || !selectedCharger) {
        alert("예약 정보를 확인해주세요.");
        return;
      }
      // 날짜와 시간을 합쳐서 백엔드 형식에 맞게 조립
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      const isoStartTime = `${formattedDate}T${startTimeStr}:00`;

      const reservationData = {
        email: loggedInEmail,
        stationId: selectedCharger.stationId || selectedCharger.id,
        rDate: formattedDate,
        startTime: isoStartTime,
      };

      // 예약 API 호출
      const response = await ReservationService.createReservation(
        reservationData as any,
      );
      if (response.status === 201 || response.data.success) {
        setModalStep(3); // 성공하면 완료 모달로 이동
        return;
      }
    } catch (error: any) {
      console.error("예약 전송 실패:", error);
      if (error.response && error.response.status === 409)
        alert(error.response.data.message || "이미 예약된 시간입니다.");
      else alert("서버 연결에 실패했습니다.");
    }
  };

  // --- [페이징 계산 로직] ---
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const PAGES_PER_BLOCK = 10;
  const currentBlock = Math.ceil(currentPage / PAGES_PER_BLOCK);
  const startPage = (currentBlock - 1) * PAGES_PER_BLOCK + 1;
  const endPage = Math.min(startPage + PAGES_PER_BLOCK - 1, totalPages);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  // 결제 관련 임시 데이터
  const MOCK_RESERVATION_FEE = 2000;
  const MOCK_CURRENT_POINTS = 5000;
  const remainPoints = MOCK_CURRENT_POINTS - MOCK_RESERVATION_FEE;


  // --- [예약 달력 최대 선택 가능 날짜 계산 로직] ---
  const getMaxDate = () => {
    const today = moment();
    const lastDayOfThisMonth = moment().endOf("month");

    // 오늘 날짜가 이번 달의 마지막 날짜(예: 30일, 31일)와 같은지 확인
    if (today.date() === lastDayOfThisMonth.date()) {
      // 마지막 날이면, 다음 달의 마지막 날짜까지 선택 가능하도록 확장
      return moment().add(1, "month").endOf("month").toDate();
    } else {
      // 마지막 날이 되기 전(예: 29일, 30일 등)이면, 이번 달의 마지막 날짜까지만 선택 가능
      return lastDayOfThisMonth.toDate();
    }
  };

  const isSlotDisabled = (
slotRange: string, selectedDate: moment.MomentInput, ch: any, reservedList: any
  ) => {
    const now = new Date();

    //  충전기 상태 체크 (고장, 점검, 통신장애, 계획정지 등)
  const status = getStatusLabel(ch.status);
  const brokenStatuses = ["고장/점검", "통신장애", "계획정지"];
  if (brokenStatuses.includes(status)) return true;

  //  이미 예약된 슬롯인지 체크 (DB 기반)
  // reservedSlots는 해당 충전기/날짜에 이미 예약된 시간대 리스트라고 가정
  if (reservedList.includes(slotRange)) return true;

    // 한국 시간 기준으로 오늘 날짜 구하기 (YYYY-MM-DD)
    const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    // 1. 선택한 날짜가 오늘보다 이전이면 무조건 막음
    const formattedSelectedDate = moment(selectedDate).format("YYYY-MM-DD");
    if (formattedSelectedDate < today) return true;

    // 2. 선택한 날짜가 오늘일 경우
    if (formattedSelectedDate === today) {
      // slotRange가 "09:00 - 13:00" 형태이므로 앞의 "09:00"만 추출
      const startTimeStr = slotRange.split(" - ")[0];
      const [slotHour, slotMinute] = startTimeStr.split(":").map(Number);

      // 비교를 위한 슬롯 시작 시간 객체 생성
      const slotStartTime = new Date();
      slotStartTime.setHours(slotHour, slotMinute, 0, 0);

      // [핵심] 현재 시간보다 10분 뒤의 시각을 계산
      const limitTime = new Date(now.getTime() + 10 * 60000);

      // 슬롯 시작 시간이 (현재+10분)보다 이전이면 true(차단)
      if (slotStartTime < limitTime) {
        return true;
      }
    }

    return false;
  };

  return (
    <div
      style={{
        backgroundColor: "#f4f5fa",
        minHeight: "100vh",
        padding: "0 0 40px 0",
      }}
    >
      {/* 헤더 영역 */}
      <header
        style={{
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), 
                     url('https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200') no-repeat center/cover`,
          height: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#ffffff",
          width: "100%",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            fontSize: "36px",
            fontWeight: "900",
            margin: 0,
          }}
        >
          충전소 예약
        </h1>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "16px",
            marginTop: "10px",
          }}
        >
          원하시는 충전소와 시간대를 선택해 주세요.
        </p>
      </header>

      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          padding: "0 20px",
        }}
      >
        {/* [STEP 1] 충전소 선택 영역 */}
        <section
          style={{
            backgroundColor: "#fff",
            borderRadius: "24px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                backgroundColor: "#B452B5",
                color: "#fff",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              1
            </span>
            <h3
              style={{
                margin: 0,
                color: "#333",
                fontSize: "18px",
                fontWeight: "800",
              }}
            >
              충전소 선택
            </h3>
          </div>

          {/* 검색창 */}
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              placeholder="예약하실 충전소 이름을 검색하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                width: "100%",
                padding: "16px 50px 16px 20px",
                borderRadius: "14px",
                border: "2px solid #eaddff",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
                color: "#333",
                background: "#fff",
              }}
            />
            <svg
              onClick={handleSearch}
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "22px",
                height: "22px",
                color: "#B452B5",
                cursor: "pointer",
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          {/* 검색 결과 목록 및 페이징 */}
          {isSearching && !selectedStation && (
            <div
              style={{
                marginTop: "10px",
                border: "1px solid #eaddff",
                borderRadius: "14px",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              {paginatedResults.length > 0 ? (
                <>
                  {/* 검색 결과 리스트 렌더링 */}
                  {paginatedResults.map((group, index) => (
                    <div
                      key={group.groupKey || index}
                      onClick={() => handleStationSelect(group)}
                      style={{
                        padding: "15px 20px",
                        borderBottom: "1px solid #f0f0f0",
                        cursor: "pointer",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#f8f9ff")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "#fff")
                      }
                    >
                      <span style={{ fontWeight: "600", color: "#333" }}>
                        {group.stationName}
                      </span>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#888",
                          marginTop: "4px",
                        }}
                      >
                        {group.address}
                      </div>
                    </div>
                  ))}

                  {/* 검색 하단 페이징 처리 UI */}
                  {totalPages > 1 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "15px",
                        gap: "8px",
                        background: "#fafafa",
                        borderTop: "1px solid #eee",
                      }}
                    >
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          background: currentPage === 1 ? "#f0f0f0" : "#F5E6FF",
                          color: currentPage === 1 ? "#aaa" : "black",
                          fontWeight: "600",
                          cursor: currentPage === 1 ? "default" : "pointer",
                        }}
                      >
                        이전
                      </button>
                      {pageNumbers.map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            background:
                              currentPage === page ? "#B452B5" : "transparent",
                            color: currentPage === page ? "#fff" : "#555",
                          }}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          background:
                            currentPage === totalPages ? "#f0f0f0" : "#F5E6FF",
                          color: currentPage === totalPages ? "#aaa" : "black",
                          fontWeight: "600",
                          cursor:
                            currentPage === totalPages ? "default" : "pointer",
                        }}
                      >
                        다음
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          )}

          {/* 선택 완료된 충전소 정보 표시 영역 */}
          {selectedStation && (
            <div
              style={{
                marginTop: "15px",
                padding: "15px",
                borderRadius: "12px",
                background: "#f8f9ff",
                border: "1px solid #eaddff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong style={{ color: "#4a3b8a", display: "block" }}>
                  {selectedStation.stationName}
                </strong>
                <span style={{ fontSize: "12px", color: "#888" }}>
                  {selectedStation.address}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedStation(null);
                  setResults([]);
                  setIsSearching(false);
                }}
                style={{
                  fontSize: "12px",
                  color: "#B452B5",
                  background: "none",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                변경
              </button>
            </div>
          )}
        </section>

        {/* [STEP 2] 충전기 및 예약시간 선택 영역 (충전소가 선택된 상태에서만 렌더링) */}
        {selectedStation && (
          <section
            style={{
              backgroundColor: "#fff",
              borderRadius: "24px",
              padding: "30px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "25px",
              }}
            >
              <span
                style={{
                  backgroundColor: "#B452B5",
                  color: "#fff",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                2
              </span>
              <h3
                style={{
                  margin: 0,
                  color: "#333",
                  fontSize: "18px",
                  fontWeight: "800",
                }}
              >
                충전기 및 예약시간 선택
              </h3>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {/* 충전기 리스트 반복문 */}
              {chargers.length > 0 ? (
                chargers.map((ch, index) => {
                  const isSelected = selectedCharger === ch;
                  const isFast = getTypeLabel(ch.chargerType).includes("급속");

                  return (
                    <div key={ch.chargerId || index}>
                      {/* 개별 충전기 버튼 */}
                      <button
                        onClick={() => {
                          setSelectedCharger(isSelected ? null : ch);
                          setSelectedTime(null);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          cursor: "pointer",
                          padding: "12px",
                          borderRadius: "12px",
                          marginBottom: "8px",
                          background: isSelected ? "#f8f9ff" : "#ffffff",
                          border: isSelected
                            ? "1px solid #f0f0f0"
                            : "1px solid #eaddff",
                          boxShadow: isSelected
                            ? "0 4px 10px rgba(180, 82, 181, 0.15)"
                            : "none",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <strong
                            style={{ color: "#4a3b8a", fontSize: "13px" }}
                          >
                            {ch.chargerName || `${ch.chargerId}호기`}
                          </strong>
                          <span
                            style={{
                              color:
                                getStatusLabel(ch.status) === "충전가능"
                                  ? "#28a745"
                                  : "#7a5de8",
                              fontWeight: "800",
                              fontSize: "11px",
                              border: `1px solid ${getStatusLabel(ch.status) === "충전가능" ? "#28a745" : "#7a5de8"}`,
                              padding: "2px 6px",
                              borderRadius: "6px",
                              background: "#fff",
                            }}
                          >
                            {getStatusLabel(ch.status)}
                          </span>
                        </div>
                        <div
                          style={{
                            color: "#666",
                            fontSize: "11px",
                            marginTop: "5px",
                          }}
                        >
                          {getTypeLabel(ch.chargerType)} |{" "}
                          {getMethodLabel(ch.chargerMethod)}
                        </div>
                      </button>

                      {/* 특정 충전기를 클릭했을 때 열리는 달력 및 시간 선택 UI */}
                      {isSelected && (
                        <div
                          style={{
                            margin: "10px 0 20px 0",
                            padding: "20px",
                            background: "#fcfcfc",
                            borderRadius: "12px",
                            border: "1px solid #eaddff",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "15px",
                            }}
                          >
                            <h4
                              style={{
                                fontSize: "14px",
                                fontWeight: "800",
                                color: "#333",
                                margin: 0,
                              }}
                            >
                              🕒 예약 가능 시간{" "}
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "#B452B5",
                                  fontWeight: "normal",
                                }}
                              >
                                ({isFast ? "* 40분 충전" : "* 60분 충전"})
                              </span>
                            </h4>

                            {/* 날짜 선택 달력 래퍼 */}
                            <div style={{ position: "relative" }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsCalendarOpen(!isCalendarOpen);
                                }}
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: "10px",
                                  border: "1px solid #eaddff",
                                  background: "#f8f9ff",
                                  color: "#B452B5",
                                  fontWeight: "700",
                                  cursor: "pointer",
                                  fontSize: "13px",
                                }}
                              >
                                {" "}
                                {moment(selectedDate).format("YYYY-MM-DD")}
                              </button>
                              {isCalendarOpen && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "35px",
                                    right: 0,
                                    zIndex: 1000,
                                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    backgroundColor: "#fff",
                                  }}
                                >
                                  <Calendar
                                    className="custom-calendar"
                                    onChange={(date) => {
                                      handleDateChange(date);
                                      setIsCalendarOpen(false);
                                    }}
                                    value={selectedDate}
                                    minDate={new Date()}
                                    tileDisabled={({ date, view }) =>
                                      view === "month" && date > getMaxDate()
                                    }
                                    formatDay={(_, date) =>
                                      moment(date).format("D")
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(4, 1fr)",
                              gap: "8px",
                            }}
                          >
                            {generateTimeSlots(ch).map((timeRange) => {
                              // 10분 전/지나간 시간인지 확인
                              const isDisabled = isSlotDisabled(
                                timeRange,
                                selectedDate,
                                ch,
                                reservedList 
                              );

                              return (
                                <button
                                  key={timeRange}
                                  disabled={isDisabled}
                                  onClick={() =>
                                    !isDisabled && setSelectedTime(timeRange)
                                  } // 비활성화가 아닐 때만 선택 가능
                                  style={{
                                    padding: "10px 0",
                                    borderRadius: "8px",
                                    // 1. 비활성화(#eee) -> 2. 선택됨(#F5E6FF) -> 3. 기본(#fff) 순서로 색상 결정
                                    background: isDisabled
                                      ? "#eee"
                                      : selectedTime === timeRange
                                        ? "#F5E6FF"
                                        : "#fff",
                                    color: isDisabled ? "#ccc" : "#555",
                                    cursor: isDisabled
                                      ? "not-allowed"
                                      : "pointer",
                                    border:
                                      selectedTime === timeRange
                                        ? "1px solid #eaddff"
                                        : "1px solid #eee",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    transition: "all 0.2s ease", // 부드러운 효과 추가
                                  }}
                                >
                                  {timeRange}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  등록된 충전기가 없습니다.
                </div>
              )}
            </div>
          </section>
        )}

        {/* [STEP 3] 하단 예약 버튼 (모든 정보가 선택되어야만 활성화됨) */}
        <button
          disabled={!selectedStation || !selectedCharger || !selectedTime}
          onClick={() => {
            setIsModalOpen(true);
            setModalStep(1);
          }}
          style={{
            width: "100%",
            padding: "20px",
            borderRadius: "18px",
            border: "none",
            background:
              !selectedStation || !selectedCharger || !selectedTime
                ? "#ccc"
                : "linear-gradient(135deg, #B452B5 0%, #7a5de8 100%)",
            color: "#fff",
            fontSize: "18px",
            fontWeight: "900",
            cursor: "pointer",
          }}
        >
          {!selectedStation
            ? "충전소를 선택해주세요"
            : !selectedCharger
              ? "충전기를 선택해주세요"
              : !selectedTime
                ? "예약 시간을 선택해주세요"
                : "이 시간대로 예약하시겠습니까?"}
        </button>
      </main>

      {/* 📍 예약/결제 프로세스 팝업 모달 */}
      {isModalOpen && selectedStation && selectedCharger && selectedTime && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "40px",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            {/* 모달 Step 1. 선택한 예약 정보 요약 확인창 */}
            {modalStep === 1 && (
              <>
                <h3
                  style={{
                    margin: "0 0 25px 0",
                    color: "#333",
                    fontSize: "22px",
                    textAlign: "center",
                    fontWeight: "800",
                  }}
                >
                  예약 정보 확인
                </h3>
                <div
                  style={{
                    background: "#f8f9ff",
                    borderRadius: "12px",
                    padding: "25px",
                    border: "1px solid #eaddff",
                    marginBottom: "30px",
                  }}
                >
                  {/* 충전소명 */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <span style={{ color: "#666", fontSize: "15px" }}>
                      충전소 :
                    </span>
                    <strong style={{ color: "#333", fontSize: "16px" }}>
                      {selectedStation.stationName}
                    </strong>
                  </div>

                  {/* 충전기 상세 (선택된 충전기 객체 참조) */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <span style={{ color: "#666", fontSize: "15px" }}>
                      충전기 :
                    </span>
                    <strong style={{ color: "#333", fontSize: "16px" }}>
                      {selectedCharger?.chargerName ||
                        `${selectedCharger?.chargerId}호기`}
                    </strong>
                  </div>

                  {/* 예약 날짜 (moment 형식 변환 적용) */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <span style={{ color: "#666", fontSize: "15px" }}>
                      예약 날짜 :
                    </span>
                    <strong style={{ color: "#333", fontSize: "16px" }}>
                      {moment(selectedDate).format("YYYY-MM-DD")}
                    </strong>
                  </div>

                  {/* 예약 시간 */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#666", fontSize: "15px" }}>
                      예약 시간 :
                    </span>
                    <strong style={{ color: "#B452B5", fontSize: "20px" }}>
                      {selectedTime}
                    </strong>
                  </div>
                </div>

                <p
                  style={{
                    textAlign: "center",
                    color: "#333",
                    fontSize: "16px",
                    fontWeight: "bold",
                    margin: "0 0 30px 0",
                  }}
                >
                  해당 정보로 예약을 진행하시겠습니까?
                </p>

                <div style={{ display: "flex", gap: "15px" }}>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: "18px",
                      borderRadius: "14px",
                      border: "1px solid #ddd",
                      background: "#fff",
                      color: "#333",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    취소
                  </button>
                  <button
                    onClick={() => setModalStep(2)}
                    style={{
                      flex: 1,
                      padding: "18px",
                      borderRadius: "14px",
                      border: "none",
                      background:
                        "linear-gradient(135deg, #B452B5 0%, #7a5de8 100%)",
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    예약하기
                  </button>
                </div>
              </>
            )}

            {/* 모달 Step 2. 금액 확인 및 예약 최종 승인 (결제 단계) */}
            {modalStep === 2 && (
              <>
                <h3
                  style={{
                    margin: "0 0 25px 0",
                    color: "#333",
                    fontSize: "22px",
                    textAlign: "center",
                    fontWeight: "800",
                  }}
                >
                  결제 정보 확인
                </h3>
                <div
                  style={{
                    background: "#f8f9ff",
                    borderRadius: "12px",
                    padding: "25px",
                    border: "1px solid #eaddff",
                    marginBottom: "30px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                      color: "#333",
                    }}
                  >
                    <span>예약 금액 :</span>
                    <strong>{MOCK_RESERVATION_FEE.toLocaleString()} 원</strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                      color: "#333",
                    }}
                  >
                    <span>현재 적립금 :</span>
                    <strong>{MOCK_RESERVATION_FEE.toLocaleString()} 원</strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                      color: "#333",
                    }}
                  >
                    <span>차감 금액 :</span>
                    <strong style={{ color: "#DC143C" }}>
                      {" "}
                      -{remainPoints.toLocaleString()} 원
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#333",
                    }}
                  >
                    <span>결제 후 잔액 :</span>
                    <strong style={{ color: "#B452B5" }}>
                      {remainPoints.toLocaleString()} P
                    </strong>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "15px" }}>
                  <button
                    onClick={() => setModalStep(1)}
                    style={{
                      flex: 1,
                      padding: "18px",
                      borderRadius: "14px",
                      border: "1px solid #ddd",
                      background: "#fff",
                      color: "#333",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    이전
                  </button>
                  <button
                    onClick={handleConfirmReservation}
                    style={{
                      flex: 1,
                      padding: "18px",
                      borderRadius: "14px",
                      border: "none",
                      background:
                        "linear-gradient(135deg, #B452B5 0%, #7a5de8 100%)",
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    예약 확정
                  </button>
                </div>
              </>
            )}

            {/* 모달 Step 3. 예약 완료 확인창 */}
            {modalStep === 3 && (
              <div style={{ textAlign: "center" }}>
                <h3
                  style={{
                    margin: "0 0 25px 0",
                    color: "#333",
                    fontSize: "24px",
                    fontWeight: "900",
                  }}
                >
                  예약이 완료되었습니다!
                </h3>
                <div
                  style={{
                    background: "#f8f9ff",
                    borderRadius: "12px",
                    padding: "25px",
                    border: "1px solid #eaddff",
                    marginBottom: "30px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <span style={{ color: "#666", fontSize: "15px" }}>
                      충전소 :
                    </span>
                    <strong style={{ color: "#333", fontSize: "16px" }}>
                      {selectedStation.stationName}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <span style={{ color: "#666", fontSize: "15px" }}>
                      충전기 :
                    </span>
                    <strong style={{ color: "#333", fontSize: "16px" }}>
                      {selectedCharger?.chargerName ||
                        `${selectedCharger?.chargerId}호기`}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <span style={{ color: "#666", fontSize: "15px" }}>
                      예약 날짜 :
                    </span>
                    <strong style={{ color: "#333", fontSize: "16px" }}>
                      {moment(selectedDate).format("YYYY-MM-DD")}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#666", fontSize: "15px" }}>
                      예약 시간 :
                    </span>
                    <strong style={{ color: "#B452B5", fontSize: "20px" }}>
                      {selectedTime}
                    </strong>
                  </div>
                </div>
                <button
                  onClick={() => (window.location.href = "/")}
                  style={{
                    width: "100%",
                    padding: "18px",
                    borderRadius: "14px",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #B452B5 0%, #7a5de8 100%)",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  홈으로 돌아가기
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationPage;
