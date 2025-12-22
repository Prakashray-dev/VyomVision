import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <h3 style={{ margin: 0, color: "#1F2937" }}>
        Admin Panel
      </h3>

      <button
        onClick={logout}
        style={{
          background: "#1DB954",
          color: "#fff",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Header;
