import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DocumentDetail.scss";
import ApiService from "../../services/apiService";
import URL_CONSTANTS from "../../urls/Urls";
import Header from "../../components/Header/Header";
import { toast } from "react-toastify";
import { DOCUMENT_STATUSES, SAMPLE_EXTRACTION, SAMPLE_SUMMARY } from "../../constants/DocumentStatuses.data";

const DocumentDetail = () => {
 
    const { id } = useParams();

  const apiClient = ApiService().client;

  const [documentDetail, setDocumentDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  let summaryText =
    documentDetail?.summary ||
    SAMPLE_SUMMARY

    let extractedData = documentDetail?.extractedJson || SAMPLE_EXTRACTION
  /* ================= FETCH DOCUMENT ================= */

  const fetchDocumentDetail = async (documentId) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        URL_CONSTANTS.DOCUMENTS.GET_DETAIL(documentId)
      );
      setDocumentDetail(response.data?.data || null);
       summaryText =documentDetail?.summary ||SAMPLE_SUMMARY
       extractedData=documentDetail?.extractedJson || SAMPLE_EXTRACTION
    } catch (err) {
      console.error(err);
      toast.error("Failed to load document details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDocumentDetail(id);
  }, [id]);

  /* ================= HELPERS ================= */

 const openInNewTab = (url) => {
  if (!url) return toast.error("File not available");
  window.open(url, "_blank", "noopener,noreferrer");
};

 const downloadFile = (url, filename) => {
  if (!url) return toast.error("File not available");

  const a = document.createElement("a");
  a.href = url;
  a.download = filename; // ✅ filename respected
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

  /* ================= ACTIONS ================= */

  const handleTranslatePdf = async () => {
    try {
      console.log('TRanslated pdf ')
       setDocumentDetail((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        translationStatus: DOCUMENT_STATUSES.TRANSLATING,
      };
    });
      const result = await apiClient.post(URL_CONSTANTS.DOCUMENTS.TRANSLATE(id));
      // recive the url from backend and update document details addd translatedurl of the url that we will get from backend 
      toast.success("Translation started");
     
    } catch(err) {
      console.error('Error Translating PDF',err)
      toast.error("Failed to translate PDF");
    }
  };

  const handleGenerateSummary = async () => {
    try {
       setDocumentDetail((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        summaryStatus: DOCUMENT_STATUSES.SUMMARIZING,
      };
    });
      await apiClient.post(URL_CONSTANTS.DOCUMENTS.GENERATE_SUMMARY(id));
      toast.success("Summary generation started");
      setTimeout(() => fetchDocumentDetail(id), 3000);
    } catch {
      toast.error("Failed to generate summary");
    }
  };

  const handleExtractData = async () => {
    try {
       setDocumentDetail((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        extractionStatus: DOCUMENT_STATUSES.EXTRACTING,
      };
    });
      await apiClient.post(URL_CONSTANTS.DOCUMENTS.EXTRACT_DATA(id));
      toast.success("Extraction started");
      setTimeout(() => fetchDocumentDetail(id), 3000);
    } catch {
      toast.error("Failed to extract data");
    }
  };


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
              <span className="xetgo-font-h2"> {documentDetail?.originalFilename || 'Document'}</span>
            </div>
            <div className="document-meta flex-row gap-24 align-items-center xetgo-font-button">
              <div className="flex-row gap-8 align-items-center">
              <i class="fa-regular fa-calendar"></i>
                <span className="bold">Uploaded:</span>
                <span >{new Date(documentDetail?.createdAt || '').toLocaleString()}</span>
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
                          onClick={() => openInNewTab(documentDetail?.fileUrl)}
                        >
                         <i class="fa-regular fa-eye"></i>
                          Preview in New Tab
                        </div>
                        <div 
                          className="action-btn bold px-16 py-8 cursor-pointer flex-row align-items-center justify-content-center gap-4 xetgo-font-button"
                          onClick={() =>
                            downloadFile(
                              documentDetail?.fileUrl,
                              documentDetail?.originalFilename
                            )
                          }
                       >
                          <i class="fa-solid fa-download"></i>
                          Download PDF
                        </div>
                     
                  </div>
                </div>
              </div>

              
              
             
            </div>
          </div>
          {/* <h1>{documentDetail?.translationStatus===DOCUMENT_STATUSES.IDLE} {documentDetail?.translationStatus}</h1> */}

          {documentDetail?.translationStatus===DOCUMENT_STATUSES.TRANSLATED ?
           (
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
                          onClick={() =>
                            openInNewTab(documentDetail?.translatedFileUrl)
                          }
                        >
                         <i class="fa-regular fa-eye"></i>
                          Preview in New Tab
                        </div>
                        <div 
                          className="action-btn bold px-16 py-8 cursor-pointer flex-row align-items-center justify-content-center gap-4 xetgo-font-button"
                          onClick={() =>
                            downloadFile(
                              documentDetail?.translatedFileUrl,
                              `translated_${documentDetail?.originalFilename}`
                            )
                          }
                        >
                          <i class="fa-solid fa-download"></i>
                          Download PDF
                        </div>
                     
                  </div>
                </div>
              </div>

              
              
             
            </div>
          </div>
           )
          : documentDetail?.translationStatus===DOCUMENT_STATUSES.IDLE ?
           (
            <div className="pdf-container flex-1">
            <div className="pdf-header"></div>
            <div style={{height:'80%'}} className="pdf-preview flex-column p-16 align-items-center justify-content-space-around position-relative">
             <div style={{color:'#1d1f76'}} className="flex-row gap-4 align-items-center">
               <i class="fa-brands fa-autoprefixer fa-4x"></i>
              <i class="fa-solid fa-arrow-down-up-across-line fa-2x"></i>
             </div>
          <div
           onClick={handleTranslatePdf}
           disabled={documentDetail.translationStatus== DOCUMENT_STATUSES.TRANSLATING}
           className="translate-pdf-btn px-20 py-12 flex-row align-items-center justify-content-space-between gap-8"> 
            <i class="fa-solid fa-language"></i> 
            <p>{documentDetail.translationStatus== DOCUMENT_STATUSES.TRANSLATING ? "Translating..." : "Translate PDF"}</p>
          </div>
            </div>
          </div>
          ): documentDetail?.translationStatus=== DOCUMENT_STATUSES.TRANSLATION_FAILED ?
           (
             <div className="pdf-container flex-1">
            <div className="pdf-header"></div>
              {/* original PDF  Content */}
            <div style={{height:'100%'}} className="pdf-preview flex-row p-16 align-items-center justify-content-center position-relative">
              <div style={{height:'90%'}} className="flex-row gap-24 full-width">
<div className="flex-1 flex-column gap-16 pdf-placeholder-container-mob">
                  <div  className="pdf-placeholder flex-column gap-8">
                   <div className="flex-column gap-24">
                     <i style={{color:'rgb(220 28 28)'}} class="fa-solid fa-circle-exclamation fa-4x"></i>
                    <p className="xetgo-font-caption bolder">Error Translating Document</p>
                   </div>
                    <p className="xetgo-font-button" style={{ color: '#64748b' }}>
                      Due to Exccessive use of token
                    </p>
                  </div>
                </div>
              </div>

              
              
             
            </div>
          </div> 
         ):
          (
            <div className="pdf-container flex-1">
            <div className="pdf-header"></div>
              {/* original PDF  Content */}
            <div style={{height:'100%'}} className="pdf-preview flex-row p-16 align-items-center justify-content-center position-relative">
              <div style={{height:'90%'}} className="flex-row gap-24 full-width">
<div className="flex-1 flex-column gap-16 pdf-placeholder-container-mob">
                  <div  className="pdf-placeholder flex-column gap-8">
                   <div className="flex-column gap-24 align-items-center justify-content-center">
                     {/* <i class="fa-solid fa-spinner fa-4x small-loader"></i> */}
                     <div className="rotating-loader"></div>
                    <p className="xetgo-font-caption bolder"> Translating Document</p>
                   </div>
                   
                  </div>
                </div>
              </div>
             
            </div>
          </div> 
          )
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
              {documentDetail?.summary || documentDetail.summaryStatus===DOCUMENT_STATUSES.SUMMARY_FAILED ? (
                <>
                  <div className="data-source-info">
                    <span className=" xetgo-font-caption bolder">Source: </span>
                    <span className="source-badge xetgo-font-caption bolder">
                      {documentDetail?.summarySource === "translated" ? "Translated PDF" : documentDetail.summaryStatus===DOCUMENT_STATUSES.SUMMARY_FAILED?'Sample Data' : "Original Document"}
                    </span>
                  </div>
                  <div className="summary-content">
                    <div className="summary-text">
                      {summaryText.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </>
              ) : documentDetail.summaryStatus=== DOCUMENT_STATUSES.IDLE || documentDetail.summaryStatus===DOCUMENT_STATUSES.SUMMARIZING ?(
                <div className="generation-status flex-column gap-8">
                  <i style={{color:'#64748b'}} class="fa-solid fa-file-circle-minus fa-2x"></i>
                  <p className="xetgo-font-button">
                    {documentDetail?.translatedPdfUrl 
                      ? "Summary not generated. Generate from translated PDF?"
                      : "Summary not generated. Generate from original PDF?"}
                  </p>
                  <button 
                    className="generate-btn xetgo-font-button bolder px-24 py-12 bold cursor-pointer flex-row align-items-center justify-content-center gap-8"
                    onClick={handleGenerateSummary}
                    disabled={documentDetail.summaryStatus===DOCUMENT_STATUSES.SUMMARIZING}
                  >
                   
                    {documentDetail.summaryStatus===DOCUMENT_STATUSES.SUMMARIZING ? (
                      <>
                        <div  className="btn-spinner" style={{ marginRight: '8px' }}></div>
                        Generating Summary...
                      </>
                    ) : (
                      <>
                        <i class="fa-solid fa-wand-sparkles"></i>
                       <p> Generate Summary</p>
                      </>
                    )}
                  </button>
                </div>
              ):<p className="flex-">Summarise failed</p>}
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
    {documentDetail.extractedJson || documentDetail.extractionStatus === DOCUMENT_STATUSES.EXTRACTION_FAILED ? (
      <>
        <div className="data-source-info">
          <span className=" xetgo-font-caption bolder">Extracted from: </span>
          <span className="source-badge xetgo-font-caption bolder">
            {documentDetail?.extractedJson ?'Document':  'Sample Data'}
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
              { extractedData && Object.entries(extractedData).map(([key,value]) => (
                <tr key={key}>
                  <td>
                    <div  className="flex-row align-items-center gap-8">
                      <i class="fa-solid fa-angle-right"></i>
                      {key}
                    </div>
                  </td>
                  <td>
                    { 
                      value
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
        <button 
          className="generate-btn xetgo-font-button bolder px-24 py-12 bold cursor-pointer flex-row align-items-center justify-content-center gap-8"
         onClick={handleExtractData}
         disabled={documentDetail.extractionStatus === DOCUMENT_STATUSES.EXTRACTING}
        >
        {documentDetail.extractionStatus === DOCUMENT_STATUSES.EXTRACTING  ?<>
        <div  className="btn-spinner" style={{ marginRight: '8px' }}></div>
                        <p>Extracting Data...</p>
        </>:<>  <i class="fa-regular fa-note-sticky"></i>
             Extract Data</>}
        </button>
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