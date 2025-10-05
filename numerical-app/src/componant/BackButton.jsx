import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackButton () {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")} // ย้อนกลับหน้า
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer'
      }}
    >
      <img
        src="/src/assets/back.svg"  // ใส่ path รูปภาพของคุณ
        style={{ width: 50, height: 50 }}
      />
    </button>
  );
};