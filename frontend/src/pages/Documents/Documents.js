import "./Documents.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useUserStore from "../../store/useUserStore";
import { removeCookie, JWT_TOKEN, getCookie } from "../../services/cookieService";
import ApiService from "../../services/apiService";
import URL_CONSTANTS from "../../urls/Urls";  

const LIMIT = 10;

const Documents = () => {
  const navigate = useNavigate();
  const logoutUser = useUserStore((state) => state.logout);

  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ Create API instance ONCE
  const api = ApiService();

  // ================= FETCH DOCUMENTS =================
  useEffect(() => {
    let isMounted = true; // prevents StrictMode double-effect issues

    const fetchDocuments = async () => {
      try {
        const res = await api.client.get(
          `${URL_CONSTANTS.DOCUMENTS.GET}?page=${page}&limit=${LIMIT}`
        );

        if (!isMounted) return;

        setDocuments(res.data.data.documents || []);
        setTotalPages(res.data.data.totalPages || 1);
      } catch (err) {
        console.error("Fetch documents failed", err);
      }
    };

    fetchDocuments();

    return () => {
      isMounted = false;
    };
  }, [page]); // ✅ runs once + when page changes

  // ================= UPLOAD DOCUMENT =================
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      await api.client.post(URL_CONSTANTS.DOCUMENTS.UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // refresh after upload
      const res = await api.client.get(
        `${URL_CONSTANTS.DOCUMENTS.GET}?page=${page}&limit=${LIMIT}`
      );

      setDocuments(res.data.data.documents || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    removeCookie(JWT_TOKEN);
    logoutUser();
    navigate("/signin");
  };

  return (
    <div className="documents-main-page-container full-width">
      {/* HEADER */}
      <div className="upper-bar flex-row align-items-center justify-content-space-between px-24">
        <div
          className="logo-footer-mobile cursor-pointer"
          onClick={() => navigate("/documents")}
        >
          <img
            height={48}
            width={120}
            src="https://i.ibb.co/pBSVCDVJ/pffgg-reader-logo-removebg-preview.png"
            alt="logo"
          />
        </div>

        <p
          onClick={handleLogout}
          className="xetgo-font-tag bold px-16 py-12 cursor-pointer"
        >
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </p>
      </div>

      {/* TOOLBAR */}
      <div className="documents-toolbar flex-row justify-content-space-between align-items-center px-24">
        <p>🔍 Search (coming soon)</p>

        <button
          className="upload-btn"
          onClick={() => fileInputRef.current.click()}
          disabled={loading}
        >
          <i className="fa-solid fa-upload"></i>
          {loading ? " Uploading..." : " Upload Document"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileSelect}
        />
      </div>

      {/* DOCUMENT LIST */}
      <div className="documents-table px-24">
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
                <i className="fa-solid fa-file"></i> {doc.fileName}
              </span>

              <div
                className="document-actions flex-row gap-12"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => window.open(doc.fileUrl, "_blank")}>
                  Preview
                </button>
                <button>Edit</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination flex-row gap-12 align-items-center justify-content-center py-16">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Documents;
