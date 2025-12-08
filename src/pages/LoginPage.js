import React, { useState } from "react";

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
      <div className="card">
        <div className="logo">YouthFly</div>

        <form onSubmit={handleSubmit} className="form">
          <label className="label">
            Email
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
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
            />
          </label>

          <button type="submit" className="button">
            Login
          </button>
        </form>

        <button
          type="button"
          className="link-button"
          onClick={() => alert("비밀번호 찾기 기능은 아직 없습니다 🥲")}
        >
          Forgot password?
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
