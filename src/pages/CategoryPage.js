// src/pages/CategoryPage.js
import React, { useState } from "react";
import places from "../data/data.json";

function CategoryPage({ onNext }) {
  // 🔹 data.json 기반 카테고리 목록
  const categories = Array.from(
    new Set(
      places
        .flatMap((item) =>
          Array.isArray(item.category) ? item.category : []
        )
        .filter(Boolean)
    )
  );

  // 🔹 data.json 기반 위치(구) 목록
  const locations = Array.from(
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

  // ⬇⬇⬇ 변경됨: 단일 카테고리 → 배열
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  // 🔥 카테고리 토글 함수
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category) // 있으면 삭제
        : [...prev, category]               // 없으면 추가
    );
  };

  const handleNext = () => {
    const data = {
      categories: selectedCategories, // ex: ["문화", "체육"]
      location: selectedLocation,     // ex: "마포구"
    };

    if (onNext) onNext(data);
    else
      alert(
        `선택한 카테고리: ${selectedCategories.join(", ")}\n선택한 위치: ${selectedLocation}`
      );
  };

  return (
    <div className="page">
      <div className="card">
        <div className="logo">YouthFly</div>

        {/* 카테고리 선택 (다중 선택 가능) */}
        <div className="section-title">관심사 선택</div>
        <div className="chip-container">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={
                "chip" + (selectedCategories.includes(c) ? " chip--active" : "")
              }
              onClick={() => toggleCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* 위치 선택 (구 단위) */}
        <div className="section-title">위치</div>
        <select
          className="select"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="" disabled>
            위치를 선택하세요
          </option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="button"
          disabled={selectedCategories.length === 0 || !selectedLocation}
          onClick={handleNext}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default CategoryPage;
