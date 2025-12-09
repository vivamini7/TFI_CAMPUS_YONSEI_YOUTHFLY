// src/pages/DetailPage.js
import React, { useState } from "react";
import "./DetailPage.css";
import wingImg from "./wing.png";

// 장소 이름으로 이미지 경로 만들기
const getImageSrc = (place) => {
  if (!place || !place.name) return "/images/default.jpg";

  const safeName = place.name;
  return `/images/${safeName}.jpg`;
};

function DetailPage({ place, onBackToList, onBackToMap }) {
  const [expanded, setExpanded] = useState(false);

  if (!place) {
    return (
      <div style={{ padding: 24 }}>
        <p>선택된 장소가 없습니다.</p>
        <button onClick={onBackToList}>목록으로 돌아가기</button>
      </div>
    );
  }

  const gu = place.area
    ? place.area.split(" ").find((x) => x.includes("구"))
    : "";

  const imageSrc = getImageSrc(place);

  return (
    <div className="detail-layout">
      {/* 상단 바 */}
      <header className="main2-topbar">
        <div className="main2-topbar-left">
          <div
            className="main2-logo"
            onClick={onBackToMap}     // 🔥 로고 클릭 → 지도 화면
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
            <div className="toggle-pill toggle-left" />
            <button
              type="button"
              className="toggle-btn active"
              onClick={onBackToList}
            >
              목록
            </button>
            <button
              type="button"
              className="toggle-btn"
              onClick={onBackToMap}
            >
              지도
            </button>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="detail-body">
        {/* 왼쪽 카드 */}
        <section className="detail-left">
          <article className="detail-card">
            <img
              src={imageSrc}
              alt={place.name}
              className="detail-card-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/default.jpg";
              }}
            />

            <div className="detail-card-info">
              <div className="detail-card-title-row">
                <span className="detail-card-name">{place.name}</span>
                <span className="detail-card-gu">{gu}</span>
              </div>
            </div>
          </article>
        </section>

        {/* 오른쪽 텍스트 영역 */}
        <section className="detail-right">
          <div className="detail-heading-row">
            <h2 className="detail-heading">{place.name}</h2>
            {place.link && (
              <button
                className="detail-link-btn"
                onClick={() => window.open(place.link, "_blank")}
              >
                Link
              </button>
            )}
          </div>

          {/* 설명 박스 */}
          <div className="detail-box">
            <div className="detail-box-header">
              <div className="detail-box-title">Title</div>
              <button
                type="button"
                className={
                  "detail-box-arrow-btn" + (expanded ? " expanded" : "")
                }
                onClick={() => setExpanded((prev) => !prev)}
              >
                !
              </button>
            </div>

            <div
              className={
                "detail-box-body" + (expanded ? " expanded" : "")
              }
            >
              {place.description ||
                "설명이 준비 중입니다. 추후 이 장소에 대한 상세 설명이 들어갑니다."}
            </div>
          </div>

          {/* 위치 / 가격 / 시간 */}
          <div className="detail-meta">
            <span className="detail-meta-item">위치 : {place.address}</span>
          </div>
          <div className="detail-meta">
            <span className="detail-meta-item">가격 : {place.price}</span>
          </div>
          <div className="detail-meta">
            <span className="detail-meta-item">시간 : {place.hours}</span>
          </div>

          {/* 카테고리 */}
          <div className="detail-category-label">카테고리</div>
          <div className="detail-tag-list">
            {place.category &&
              place.category.map((tag) => (
                <span key={tag} className="tag-pill">
                  #{tag}
                </span>
              ))}
          </div>

          <button
            className="detail-calendar-btn"
            onClick={() => {
              if (place.link) window.open(place.link, "_blank");
            }}
          >
            자세히보기(추후에 기능을 추가할 예정입니다.)
          </button>
        </section>
      </main>
    </div>
  );
}

export default DetailPage;
