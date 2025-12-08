// src/App.js
import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import CategoryPage from "./pages/CategoryPage";
import MainPage1 from "./pages/MainPage1";
import MainPage2 from "./pages/MainPage2";
import DetailPage from "./pages/DetailPage";   // ⬅️ 추가

function App() {
  const [page, setPage] = useState("login");
  const [filters, setFilters] = useState(null); // 카테고리/위치 선택값
  const [selectedPlace, setSelectedPlace] = useState(null); // ⬅️ 어떤 장소를 선택했는지

  if (page === "login") {
    return <LoginPage onLogin={() => setPage("category")} />;
  }

  if (page === "category") {
    return (
      <CategoryPage
        onNext={(data) => {
          setFilters(data);   // { category, location }
          setPage("main1");   // 기본은 지도 화면으로 이동
        }}
      />
    );
  }

  if (page === "main1") {
    return (
      <MainPage1
        filters={filters}
        currentPage="map"
        onShowList={() => setPage("main2")}
        onShowMap={() => setPage("main1")}
        onSelectPlace={(place) => {
          setSelectedPlace(place);
          setPage("detail");
        }}
      />
    );
  }

  if (page === "main2") {
    return (
      <MainPage2
        filters={filters}
        currentPage="list"
        onShowList={() => setPage("main2")}
        onShowMap={() => setPage("main1")}
        onSelectPlace={(place) => {
          setSelectedPlace(place);
          setPage("detail");
        }}
      />
    );
  }

  if (page === "detail") {
    return (
      <DetailPage
        place={selectedPlace}
        onBackToList={() => setPage("main2")}
        onBackToMap={() => setPage("main1")}
      />
    );
  }
  // 기본: 목록(main2)
  return (
    <MainPage2
      filters={filters}
      currentPage="list"
      onShowList={() => setPage("main2")}
      onShowMap={() => setPage("main1")}
      onSelectPlace={(place) => {
        setSelectedPlace(place); // 어떤 카드 눌렀는지 저장
        setPage("detail");       // 자세히 보기 화면으로 전환
      }}
    />
  );
}

export default App;
