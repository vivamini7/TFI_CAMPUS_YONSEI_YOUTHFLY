// src/pages/LoginPage.js
import React, { useState } from "react";
import "./LoginPage.css";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 실제 로그인 검증 로직 넣기
    onLogin(); // 지금은 그냥 바로 다음 페이지로 이동
  };

  return (
    <div className="page">
      <div className="page-overlay" />

      <div className="card">
        <div className="logo-wrap">
          <div className="logo">YouthFly</div>
          <p className="logo-subtitle">청소년을 위한 활동 탐색 서비스</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <label className="label">
            Email
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
            />
          </label>

          <label className="label">
            Password
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </label>

          <div className="form-footer">
            <label className="remember">
              <input type="checkbox" />
              <span>로그인 상태 유지</span>
            </label>

            <button
              type="button"
              className="link-button"
              onClick={() =>
                alert("비밀번호 찾기 기능은 아직 준비 중이에요 🥲")
              }
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="button">
            Login
          </button>
        </form>

        <p className="bottom-text">
          <span className="bottom-link">아직 회원가입 기능이 없어서 임의의 메일, 비밀번호 수를 입력하고 다음으로 넘어가주세요.</span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
