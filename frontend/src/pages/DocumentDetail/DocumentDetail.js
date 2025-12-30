import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DocumentDetail.scss";
import ApiService from "../../services/apiService";
import URL_CONSTANTS from "../../urls/Urls";
import Header from "../../components/Header/Header";
import { SAMPLE_DOCUMENT_DETAIL } from "./DucomentDetail.data";
import { toast } from "react-toastify";

const DocumentDetail = () => {
  const { id } = useParams();
  const [ifTranslatedPdfAvailable, setIfTranslatedPdfAvailable] = useState(false); 
  const [documentDetail, setDocumentDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingSummary, setGeneratingSummary] = useState(false);


  const fetchDocumentDetail = async (documentId) => {
    try {
      setLoading(true);
      const apiClient = ApiService().client;
      const response = await apiClient.get(
        URL_CONSTANTS.DOCUMENTS.GET_DETAIL(documentId)
      );
      
      const data = response.data?.data;
      setDocumentDetail(data);
      console.log("Fetched document detail:", data);
    
    } catch (err) {
      console.error("Error fetching document detail:", err);
      toast.error("Failed to load document details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDocumentDetail(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="document-detail-main-page full-width flex-column">
        <Header />
        <div className="document-detail-lower-main-container p-16 border-box flex-1">
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="loading-text">Loading document details...</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="document-detail-main-page full-width flex-column">
      <Header />
      
      <div className="document-detail-lower-main-container p-16 border-box flex-1 flex-column gap-16">
        {/* Document Header */}
        <div className="document-header p-12">
          <div className="flex-column gap-8">
            <div className="flex-row gap-8 align-items-center">
              <i   class="fa-regular fa-file-pdf"></i>
              <span className="xetgo-font-h2">{documentDetail?.fileName || "Document"}</span>
            </div>
            <div className="document-meta flex-row gap-24 align-items-center xetgo-font-button">
              <div className="flex-row gap-8 align-items-center">
              <i class="fa-regular fa-calendar"></i>
                <span className="bold">Uploaded:</span>
                <span >{new Date(documentDetail?.createdAt || '').toLocaleString()}</span>
              </div>
              <div className="flex-row gap-8 align-items-center">
                <span className="bold">Status:</span>
                <span  style={{
                  color: '#f59e0b'
                }}>
                  Uploaded
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Preview Section */}
        <div className="pdf-section flex-row gap-16">
          <div className="pdf-container flex-1">
            <div className="pdf-header"></div>
              {/* original PDF  Content */}
            <div className="pdf-preview flex-row p-16 align-items-center justify-content-center position-relative">
              <div className="flex-row gap-24 full-width">
<div className="flex-1 flex-column gap-16 pdf-placeholder-container-mob">
                  <div className="pdf-placeholder flex-column gap-8">
                   <div className="flex-column gap-24">
                     <i className="fa-regular fa-file-pdf fa-4x"></i>
                    <p className="xetgo-font-caption bolder">Original Document</p>
                   </div>
                    <p className="xetgo-font-button" style={{ color: '#64748b' }}>
                      Click "Preview in New Tab" to view the document
                    </p>
                  </div>
                  
                  <div className="pdf-actions flex-row gap-12 justify-content-space-between align-items-center">
                        <div 
                          className="action-btn primary bold px-16 py-8 cursor-pointer flex-row align-items-center justify-content-center gap-4 xetgo-font-button"
                        >
                         <i class="fa-regular fa-eye"></i>
                          Preview in New Tab
                        </div>
                        <div 
                          className="action-btn bold px-16 py-8 cursor-pointer flex-row align-items-center justify-content-center gap-4 xetgo-font-button"
                        >
                          <i class="fa-solid fa-download"></i>
                          Download PDF
                        </div>
                     
                  </div>
                </div>
              </div>

              
              
             
            </div>
          </div>

          {ifTranslatedPdfAvailable ?
            <div className="pdf-container flex-1">
            <div className="pdf-header"></div>
            
            <div className="pdf-preview flex-row p-16 align-items-center justify-content-center position-relative">
              {/* translated PDF  Content */}
              <div className="flex-row gap-24 full-width">
<div className="flex-1 flex-column gap-16">
                  <div className="pdf-placeholder flex-column gap-8">
                   <div className="flex-column gap-24">
                     <i className="fa-regular fa-file-pdf fa-4x"></i>
                    <p className="xetgo-font-caption bolder">Translated Document</p>
                   </div>
                    <p className="xetgo-font-button" style={{ color: '#64748b' }}>
                      Click "Preview in New Tab" to view the document
                    </p>
                  </div>
                  
                  <div className="pdf-actions flex-row gap-12 justify-content-space-between align-items-center">
                        <div 
                          className="action-btn primary bold px-16 py-8 cursor-pointer flex-row align-items-center justify-content-center gap-4 xetgo-font-button"
                        >
                         <i class="fa-regular fa-eye"></i>
                          Preview in New Tab
                        </div>
                        <div 
                          className="action-btn bold px-16 py-8 cursor-pointer flex-row align-items-center justify-content-center gap-4 xetgo-font-button"
                        >
                          <i class="fa-solid fa-download"></i>
                          Download PDF
                        </div>
                     
                  </div>
                </div>
              </div>

              
              
             
            </div>
          </div>
          : <div className="pdf-container flex-1">
            <div className="pdf-header"></div>
            <div style={{height:'80%'}} className="pdf-preview flex-column p-16 align-items-center justify-content-space-around position-relative">
             <div style={{color:'#1d1f76'}} className="flex-row gap-4 align-items-center">
               <i class="fa-brands fa-autoprefixer fa-4x"></i>
              <i class="fa-solid fa-arrow-down-up-across-line fa-2x"></i>
             </div>
<div className="translate-pdf-btn px-20 py-12 flex-row align-items-center justify-content-space-between gap-8"> <i class="fa-solid fa-language"></i> <p>Translate PDF</p> </div>
            </div>
          </div>
          }
           
        </div>

        {/* Content Grid */}

        <div className="content-grid flex-row gap-16 ">
          {/* Summary Section */}
          <div className="card flex-1">
            <div className="card-header">
              <div className="flex-row align-items-center gap-4">
               <i class="fa-solid fa-wand-magic-sparkles"></i>
                <p className="xetgo-font-h3 bolder"> Summary</p>
              </div>
            </div>
            <div className="card-content">
              {documentDetail?.summary ? (
                <>
                  <div className="data-source-info">
                    <span className=" xetgo-font-caption bolder">Source: </span>
                    <span className="source-badge xetgo-font-caption bolder">
                      {/* {documentDetail?.summarySource === "translated" ? "Translated PDF" : "Original Document"} */}
                      Translated pdf
                    </span>
                  </div>
                  <div className="summary-content">
                    <div className="summary-text">
                      {/* {documentDetail.summary.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))} */}
                      summary text present here
                    </div>
                  </div>
                </>
              ) : (
                <div className="generation-status flex-column gap-8">
                  <i style={{color:'#64748b'}} class="fa-solid fa-file-circle-minus fa-2x"></i>
                  <p className="xetgo-font-button">
                    {documentDetail?.translatedPdfUrl 
                      ? "Summary not generated. Generate from translated PDF?"
                      : "Summary not generated. Generate from original PDF?"}
                  </p>
                  <div 
                    className="generate-btn xetgo-font-button bolder px-24 py-12 bold cursor-pointer flex-row align-items-center justify-content-center gap-8"
                  >
                    {generatingSummary ? (
                      <>
                        <div className="btn-spinner" style={{ marginRight: '8px' }}></div>
                        Generating Summary...
                      </>
                    ) : (
                      <>
                        <i class="fa-solid fa-wand-sparkles"></i>
                       <p> Generate Summary</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Extracted Data Section */}
         <div className="card flex-1">
  <div className="card-header">
    <div className="flex-row align-items-center gap-4">
      <i className="fa-solid fa-hashtag"></i>
      <p className="xetgo-font-h3 bolder">Extracted Data</p>
    </div>
  </div>
  <div className="card-content scrollable">
    {false ? (
      <>
        <div className="data-source-info">
          <span className=" xetgo-font-caption bolder">Extracted from: </span>
          <span className="source-badge xetgo-font-caption bolder">
            {"translated" === "translated" ? " Translated PDF" : " Original Document"}
          </span>
        </div>
        <div className="transactions-content">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_DOCUMENT_DETAIL.extractedJson.transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i class="fa-solid fa-angle-right"></i>
                      {transaction.key}
                    </div>
                  </td>
                  <td>
                    { 
                      transaction.value
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ) : (
      <div className="generation-status flex-column gap-8">
        <i style={{color:'rgb(100, 116, 139)'}} class="fa-regular fa-file-code fa-2x"></i>
        <p className="status-text xetgo-font-button">
          {true 
            ? "Data not extracted yet. Extract from translated PDF?"
            : "Data not extracted yet. Extract from original document?"}
        </p>
        <div 
          className="generate-btn xetgo-font-button bolder px-24 py-12 bold cursor-pointer flex-row align-items-center justify-content-center gap-8"
        >
          <>
            <i class="fa-regular fa-note-sticky"></i>
            Extract Data
          </>
        </div>
      </div>
    )}
  </div>
</div>
        </div>
        
        {/* Generation Instructions */}
        <div
        className="xetgo-font-button p-16"
        style={{
          marginTop: '24px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          color: '#0369a1',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <i style={{marginTop:'2px'}} class="fa-solid fa-circle-info"></i>
            <div>
              <strong>Workflow Instructions:</strong>
              <ol style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                <li>Start by generating the Translated English PDF (if not available)</li>
                <li>Once translated PDF is generated, it will be automatically selected for viewing</li>
                <li>Summary and Data Extraction will use the translated PDF if available, otherwise original document</li>
                <li>You can switch between original and translated PDF views using the toggle</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;