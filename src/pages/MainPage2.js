// src/pages/MainPage2.js
import React, { useState } from "react";
import places from "../data/data.json";
import wingImg from "./wing.png";

// 카드 썸네일용 이미지 경로 생성
const getImageSrc = (name) => {
  if (!name) return "/images/default.jpg";
  const safeName = name; // 필요하면 여기서 파일명 안전하게 가공
  return `/images/${safeName}.jpg`;
};

function MainPage2({
  filters,
  onShowList,
  onShowMap,
  currentPage,
  onSelectPlace,
}) {
  const [searchText, setSearchText] = useState("");
  const [selectedGu, setSelectedGu] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all"); // 장소 접근성(score)

  // 🔹 구 옵션 추출: "서울 중랑구 망우동" → "중랑구"
  const guOptions = Array.from(
    new Set(
      places
        .map((item) =>
          item.area
            ? item.area.split(" ").find((x) => x.includes("구"))
            : null
        )
        .filter(Boolean)
    )
  );

  // 🔹 카테고리 옵션 추출: JSON의 category 배열 기반
  const categoryOptions = Array.from(
    new Set(
      places
        .flatMap((item) =>
          Array.isArray(item.category) ? item.category : []
        )
        .filter(Boolean)
    )
  );

  // 🔍 검색 + 구 + 카테고리 + 가격 + 점수 필터
  const itemsToShow = (places || []).filter((item) => {
    const text = searchText.trim().toLowerCase();

    // 1) 검색 필터 (이름, area, tags)
    const inName = item.name.toLowerCase().includes(text);
    const inArea = (item.area || "").toLowerCase().includes(text);
    const inTags =
      Array.isArray(item.tags) &&
      item.tags.some((tag) => (tag || "").toLowerCase().includes(text));
    const matchSearch = !text || inName || inArea || inTags;

    // 2) 구 필터
    const gu = item.area
      ? item.area.split(" ").find((x) => x.includes("구"))
      : "";
    const matchGu = selectedGu === "all" || gu === selectedGu;

    // 3) 카테고리 필터 (JSON의 category 사용)
    const matchCategory =
      selectedCategory === "all" ||
      (Array.isArray(item.category) &&
        item.category.includes(selectedCategory));

    // 4) 가격 필터 (isFree 사용)
    const matchPrice =
      priceFilter === "all"
        ? true
        : priceFilter === "free"
        ? item.isFree
        : !item.isFree;

    // 5) 장소 접근성(score) 필터
    const matchScore =
      scoreFilter === "all" ||
      Number(item.score) === Number(scoreFilter);

    return matchSearch && matchGu && matchCategory && matchPrice && matchScore;
  });

  console.log("places data: ", places);

  return (
    <div className="main2-layout">
      {/* 상단 바 */}
      <header className="main2-topbar">
        <div className="main2-topbar-left">
          <div
            className="main2-logo"
            onClick={onShowMap}   // 🔥 요걸로 변경!
            style={{ cursor: "pointer" }}
          >
            <span className="main2-logo-text">YouthFly</span>
            <img
              src={wingImg}
              alt="YouthFly 날개 로고"
              className="main2-logo-wing"
            />
          </div>


        </div>

        <div className="main2-topbar-right">
          <div className="topbar-toggle">
            <div
              className={
                "toggle-pill " +
                (currentPage === "map" ? "toggle-right" : "toggle-left")
              }
            />
            <button
              type="button"
              className={
                "toggle-btn " + (currentPage === "list" ? "active" : "")
              }
              onClick={onShowList}
            >
              목록
            </button>
            <button
              type="button"
              className={
                "toggle-btn " + (currentPage === "map" ? "active" : "")
              }
              onClick={onShowMap}
            >
              지도
            </button>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <div className="main2-body">
        {/* 왼쪽 필터 영역 */}
        <aside className="main2-sidebar">
          <div className="main2-sidebar-header">
            <div className="main2-sidebar-title">필터</div>
          </div>

          {/* 🔹 구 선택 */}
          <div className="main2-filter-block">
            <div className="main2-filter-subtitle">지역 (구)</div>
            <select
              className="main2-select"
              value={selectedGu}
              onChange={(e) => setSelectedGu(e.target.value)}
            >
              <option value="all">전체</option>
              {guOptions.map((gu) => (
                <option key={gu} value={gu}>
                  {gu}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 카테고리 선택 */}
          <div className="main2-filter-block">
            <div className="main2-filter-subtitle">카테고리</div>
            <select
              className="main2-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">전체</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 가격 선택 */}
          <div className="main2-filter-block">
            <div className="main2-filter-subtitle">비용</div>
            <select
              className="main2-select"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="free">무료만</option>
              <option value="paid">유료만</option>
            </select>
          </div>

          {/* 🔹 장소 접근성(score) 선택 */}
          <div className="main2-filter-block">
            <div className="main2-filter-subtitle">장소 접근성 (점수)</div>
            <select
              className="main2-select"
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="5">5점</option>
              <option value="4">4점</option>
              <option value="3">3점</option>
              <option value="2">2점</option>
              <option value="1">1점</option>
            </select>
          </div>
        </aside>

        {/* 오른쪽 콘텐츠 영역 */}
        <section className="main2-content">
          {/* 검색바 */}
          <div className="main2-search-wrap">
            <input
              className="main2-search-input"
              type="text"
              placeholder="장소명, 지역, 카테고리로 검색"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="main2-search-btn">🔍</button>
          </div>

          {/* 카드 리스트 */}
          <div className="main2-card-grid">
            {itemsToShow.map((item, index) => (
              <article
                key={index}
                className="main2-card"
                onClick={() => onSelectPlace && onSelectPlace(item)}
                style={{ cursor: "pointer" }}
              >
                <div className="main2-card-img-wrap">
                  {/* ✅ teen === "T"일 때만 #청소년용 노란 뱃지 표시 */}
                  {item.teen === "T" && (
                    <div className="main2-card-teen-badge">
                      #청소년용
                    </div>
                  )}

                  <img
                    src={getImageSrc(item.name)}
                    alt={item.name}
                    className="main2-card-img-placeholder"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default.jpg";
                    }}
                  />
                </div>

                <div className="main2-card-info">
                  <div className="main2-card-row">
                    <span className="main2-card-title ellipsis-title">
                      {item.name}
                    </span>
                    <span className="main2-card-location">
                      {item.area
                        .split(" ")
                        .find((x) => x.includes("구"))}
                    </span>
                  </div>

                  <div className="main2-card-row">
                    <span className="main2-card-price ellipsis-price">
                      {item.price}
                    </span>
                    <span className="main2-card-tag ellipsis-tags">
                      {Array.isArray(item.tags)
                        ? item.tags.join(" · ")
                        : ""}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default MainPage2;
