import React from "react"

export default function BigButton({ color, label }) {
  return (
    <div
      style={{
        width: "220px",
        height: "220px",
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "40px auto 0 auto",
        transition: "0.4s ease",
        color: "#fff",
        fontSize: "2rem",
        fontWeight: "bold",
        boxShadow: "0 0 40px rgba(0,0,0,0.4)"
      }}
    >
      {label}
    </div>
  )
}
