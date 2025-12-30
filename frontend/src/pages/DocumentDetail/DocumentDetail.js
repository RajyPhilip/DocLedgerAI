import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DocumentDetail.scss";
import ApiService from "../../services/apiService";
import URL_CONSTANTS from "../../urls/Urls";

const DocumentDetail = () => {
  const { id } = useParams(); // ✅ get id from URL

  const [documentDetail, setDocumentDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDocumentDetail = async (documentId) => {
    try {
      const apiClient = ApiService().client;

      const response = await apiClient.get(
        URL_CONSTANTS.DOCUMENTS.GET_DETAIL(id)
      );

      setDocumentDetail(response.data.data);
    } catch (err) {
      console.error("Error fetching document detail:", err);
      setError("Failed to load document details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDocumentDetail(id);
    }
  }, [id]);



  return (
    <div className="document-detail">
      <h2>Welcome to detail page of document id {id}</h2>

   

      {/* Future sections */}
      {/* Translated PDF */}
      {/* Summary */}
      {/* Extracted JSON */}
    </div>
  );
};

export default DocumentDetail;
