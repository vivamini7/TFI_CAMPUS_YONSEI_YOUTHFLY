// src/pages/MainPage1.js
import React, { useEffect, useRef } from "react";
import places from "../data/data.json";
import wingImg from "./wing.png";

// 카드 썸네일용 이미지 경로 생성
const getImageSrc = (name) => {
  if (!name) return "/images/default.jpg";
  const safeName = name; // 필요하면 파일명 가공 (공백 제거 등)
  return `/images/${safeName}.jpg`;
};

function MainPage1({
  filters,
  onShowList,
  onShowMap,
  currentPage,
  onSelectPlace,
}) {
  // ✅ 다중 카테고리 고려 (CategoryPage에서 넘어온 filters.categories)
  const selectedCategories = Array.isArray(filters?.categories)
    ? filters.categories
    : [];

  // 👉 추천 리스트용 데이터 (filters 기준)
  const filteredPlaces = (places || [])
    .filter((item) => {
      const category = Array.isArray(item.category) ? item.category : [];

      // ✅ 카테고리 매칭: 하나라도 겹치면 통과
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((c) => category.includes(c));

      return matchCategory; // ⬅ 위치 조건 제거!
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  // 🔹 카카오 지도 ref들
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // 🔹 지도 + 마커 로직
  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !kakao.maps || !kakao.maps.services) {
      console.warn("Kakao maps or services not ready");
      return;
    }
    if (!mapContainerRef.current) return;

    // 1) 지도 초기화 (최초 1회)
    if (!mapRef.current) {
      const center = new kakao.maps.LatLng(37.5665, 126.978); // 서울 중심
      const options = {
        center,
        level: 7,
      };
      mapRef.current = new kakao.maps.Map(mapContainerRef.current, options);

      // ✅ 현위치: 날개 아이콘으로만 표시 (텍스트 X)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = new kakao.maps.LatLng(
              pos.coords.latitude,
              pos.coords.longitude
            );
            mapRef.current.setCenter(loc);

            // 현위치 마커 이미지 (public/images/self-loc.png)
            const wingMarkerImage = new kakao.maps.MarkerImage(
              "/images/self-loc.png",
              new kakao.maps.Size(31, 31),
              { offset: new kakao.maps.Point(35, 35) }
            );

            new kakao.maps.Marker({
              map: mapRef.current,
              position: loc,
              image: wingMarkerImage,
            });
          },
          (err) => {
            console.log("geolocation error", err);
          }
        );
      }
    }

    const map = mapRef.current;
    const geocoder = new kakao.maps.services.Geocoder();

    // 2) 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // 3) 추천 장소 이름 Set (색깔 구분용)
    const recommendedNames = new Set(filteredPlaces.map((p) => p.name));

    // 4) 마커 이미지 세팅 (🔴 추천 / 🔵 일반)
    const recoMarkerImage = new kakao.maps.MarkerImage(
      "/images/marker-reco.png", // 빨간 핀
      new kakao.maps.Size(30, 32),
      { offset: new kakao.maps.Point(15, 30) }
    );
    const normalMarkerImage = new kakao.maps.MarkerImage(
      "/images/marker-normal.png", // 파란 핀
      new kakao.maps.Size(30, 30),
      { offset: new kakao.maps.Point(15, 30) }
    );

    // 5) 전체 장소(places)를 지도에 마커로 표시
    places.forEach((item) => {
      const addr = item.location || item.area;
      if (!addr) return;

      geocoder.addressSearch(addr, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

          const isRecommended = recommendedNames.has(item.name);

          const marker = new kakao.maps.Marker({
            map,
            position: coords,
            image: isRecommended ? recoMarkerImage : normalMarkerImage,
          });

          // InfoWindow (마우스 올렸을 때 장소명 표시)
          const info = new kakao.maps.InfoWindow({
            content: `<div style="padding:6px 8px;font-size:12px;white-space:nowrap;">
                        ${item.name}
                      </div>`,
          });

          kakao.maps.event.addListener(marker, "mouseover", () => {
            info.open(map, marker);
          });

          kakao.maps.event.addListener(marker, "mouseout", () => {
            info.close();
          });

          // 마커 클릭하면 상세보기 이동
          kakao.maps.event.addListener(marker, "click", () => {
            onSelectPlace && onSelectPlace(item);
          });

          markersRef.current.push(marker);
        }
      });
    });
  }, [filteredPlaces, onSelectPlace]);

  return (
    <div className="main1-layout">
      {/* 상단 바 */}
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
            <div
              className={
                "toggle-pill " +
                (currentPage === "map" ? "toggle-right" : "toggle-left")
              }
            />
            <button
              className={
                "toggle-btn " + (currentPage === "list" ? "active" : "")
              }
              onClick={onShowList}
            >
              목록
            </button>
            <button
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

      <div className="main1-body">
        {/* 지도 영역 */}
        <div className="main1-map">
          <div ref={mapContainerRef} className="main1-map-container" />
        </div>

        {/* 오른쪽 추천 리스트 패널 */}
        <aside className="main1-panel">
          <div className="main1-panel-header">
            <div className="main1-panel-title">추천 활동 리스트</div>
            {filters?.location && (
              <div className="main1-panel-sub">
                {filters.location} 기준
                {filters.category && ` · ${filters.category} 관련`}
              </div>
            )}
          </div>

          {/* 👉 카드형 리스트 (MainPage2 스타일 재사용) */}
          <div className="main1-panel-list">
            {filteredPlaces.map((item, index) => {
              const gu = item.area
                ? item.area.split(" ").find((x) => x.includes("구"))
                : "";

              const isTeen = item.teen === "T"; // 청소년 시설 여부
              const imageSrc = getImageSrc(item.name);

              return (
                <article
                  key={index}
                  className="main2-card main1-card"
                  onClick={() => onSelectPlace && onSelectPlace(item)}
                  style={{ cursor: "pointer" }}
                >
                  {/* 이미지 영역 */}
                  <div className="main2-card-img-wrap">
                    {/* 청소년 시설일 때 노란 뱃지 */}
                    {isTeen && (
                      <div className="main2-card-teen-badge">
                        #청소년용
                      </div>
                    )}

                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="main2-card-img-placeholder"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/default.jpg";
                      }}
                    />
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="main2-card-info">
                    <div className="main2-card-row">
                      <span className="main2-card-title ellipsis-title">
                        {item.name}
                      </span>
                      <span className="main2-card-location">{gu}</span>
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
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default MainPage1;
