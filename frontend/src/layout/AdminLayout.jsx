import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import "../styles/admin.css";


function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-content">
        <Header />
        <div style={{ marginTop: "20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
