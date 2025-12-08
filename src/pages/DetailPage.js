// src/pages/DetailPage.js
import React, { useState } from "react";
import "./DetailPage.css";
import wingImg from "./wing.png";


// 장소 이름으로 이미지 경로 만들기
// public/images/장소명(공백제거).jpg 를 바라보도록 함
const getImageSrc = (place) => {
  if (!place || !place.name) return "/images/default.jpg";

  // 파일명용: 공백 제거
  const safeName = place.name

  // 예: /images/서울시립과학관.jpg
  return `/images/${safeName}.jpg`;
};

function DetailPage({ place, onBackToList, onBackToMap }) {
  const [expanded, setExpanded] = useState(false); // 설명 펼치기/접기 상태

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
      {/* 상단 바: 기존 메인 페이지랑 동일 구조 */}
      <header className="main2-topbar">
        <div className="main2-topbar-left">
          <div className="main2-logo">
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
            {/* 이미지 (장소명 기반) */}
            <img
              src={imageSrc}
              alt={place.name}
              className="detail-card-img"
              onError={(e) => {
                // 해당 이름의 이미지가 없으면 기본 이미지로 교체
                e.target.onerror = null;
                e.target.src = "/images/default.jpg";
              }}
            />

            <div className="detail-card-info">
              <div className="detail-card-title-row">
                <span className="detail-card-name">{place.name}</span>
                <span className="detail-card-gu">{gu}</span>
              </div>
              {/* 필요하면 왼쪽 카드에도 가격 표시 가능 */}
              {/* <div className="detail-card-price">{place.price}</div> */}
            </div>
          </article>
        </section>

        {/* 오른쪽 텍스트 영역 */}
        <section className="detail-right">
          {/* 제목 = 장소 이름 */}
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

          {/* 설명 박스 (3줄까지만, 펼치기/접기) */}
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

          {/* 위치 / 가격 / 시간 정보 */}
          <div className="detail-meta">
            <span className="detail-meta-item">위치 : {place.address}</span>
          </div>
          <div className="detail-meta">
            <span className="detail-meta-item">가격 : {place.price}</span>
          </div>
          <div className="detail-meta">
            <span className="detail-meta-item">시간 : {place.hours}</span>
          </div>

          {/* 카테고리 태그 */}
          <div className="detail-category-label">카테고리</div>
          <div className="detail-tag-list">
            {place.category &&
              place.category.map((tag) => (
                <span key={tag} className="tag-pill">
                  #{tag}
                </span>
              ))}
          </div>

          {/* 캘린더 / 링크 버튼 */}
          <button
            className="detail-calendar-btn"
            onClick={() => {
              if (place.link) window.open(place.link, "_blank");
            }}
          >
            캘린더에 추가하기
          </button>
        </section>
      </main>
    </div>
  );
}

export default DetailPage;
