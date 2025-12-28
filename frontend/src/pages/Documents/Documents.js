import "./Documents.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import { removeCookie, JWT_TOKEN } from "../../services/cookieService";
import ApiService from "../../services/apiService";

const Documents = () => {
  const navigate = useNavigate();
  const logoutUser = useUserStore((state) => state.logout);

  // pagination state
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // 🔁 Fetch documents (10 per page)
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const api = ApiService();
        const response = await api.client.get(
          `/documents?page=${page}&limit=10`
        );

        setDocuments(response.data.data.documents);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch documents", error);
      }
    };

    fetchDocuments();
  }, [page]);

  const handleLogout = () => {
    removeCookie(JWT_TOKEN);
    logoutUser();
    navigate("/signin");
  };

  return (
    <div className="documents-main-page-container full-width">

      {/* ================= HEADER ================= */}
      <div className="documents-header flex-row justify-content-space-between align-items-center">
        <img
          height={48}
          src="https://i.ibb.co/pBSVCDVJ/pffgg-reader-logo-removebg-preview.png"
          alt="logo"
        />

        <div
          className="logout-btn flex-row align-items-center gap-8 cursor-pointer"
          onClick={handleLogout}
        >
          <span>Logout</span>
        </div>
      </div>

      {/* ================= SEARCH + UPLOAD ================= */}
      <div className="documents-toolbar flex-row justify-content-space-between align-items-center">
        <p>🔍 Search (filter coming later)</p>

        <button className="upload-btn">
          Upload Document
        </button>
      </div>

      {/* ================= DOCUMENT LIST ================= */}
      <div className="documents-table">
        {documents.length === 0 ? (
          <p>No documents found</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="document-row flex-row justify-content-space-between align-items-center"
              onClick={() => navigate(`/document/${doc.id}`)}
            >
              <span className="document-name">
                {doc.name}
              </span>

              <div
                className="document-actions flex-row gap-12"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => window.open(doc.file_url, "_blank")}
                >
                  Preview
                </button>

                <button
                  onClick={() => {
                    // later: inline edit
                    console.log("Edit document", doc.id);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="pagination flex-row gap-12 align-items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Documents;
