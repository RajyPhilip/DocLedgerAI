import { useState } from "react";
import { Button, CircularProgress, Modal, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FileUpload.scss";
import { fileUploadSubject } from "../../../services/file.service";
import { toastOptions } from "../../../utils/toast";
import ApiService from "../../../services/apiService";
import URL_CONSTANTS from "../../../urls/Urls";

function FileUpload() {
  
  const api = ApiService();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [displayNames, setDisplayNames] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFileIndex, setEditingFileIndex] = useState(-1);
  const [editingFileName, setEditingFileName] = useState("");
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  const handleFileChange = (event) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const files = Array.from(event.target.files);

    // Allow only PDFs
    const nonPdfFiles = files.filter(
      (file) => file.type !== "application/pdf"
    );

    if (nonPdfFiles.length > 0) {
      toast.error("Please select PDF files only", toastOptions);
      event.target.value = ""; // reset file input
      return;
    }

    setSelectedFiles(files);
    setDisplayNames(files.map((file) => file.name));
  };

  const handleOpenEditDialog = (fileIndex) => {
    setEditingFileIndex(fileIndex);
    setEditingFileName(displayNames[fileIndex]);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingFileIndex(-1);
  };

  const handlePreviewDialog = () => {
    setIsPreviewDialogOpen(true); // Open the preview dialog
  };

  const handleEditFileName = (e) => {
    setEditingFileName(e.target.value);
  };

  const handleSaveChanges = () => {
    setDisplayNames((prevDisplayNames) => {
      const updatedNames = [...prevDisplayNames];
      updatedNames[editingFileIndex] = editingFileName;
      return updatedNames;
    });
    handleCloseEditDialog();
    toast.success("File name updated successfully!", toastOptions);
  };

  const handleFileRemove = async (fileIndex) => {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.filter((_, index) => index !== fileIndex),
    );
    setDisplayNames((prevDisplayNames) =>
      prevDisplayNames.filter((_, index) => index !== fileIndex),
    );

    if (selectedFiles.length <= 1) {
      setIsPreviewDialogOpen(false);
    }
  };

  const handleClosePreviewDialog = () => {
    setIsPreviewDialogOpen(false);
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      const formData = new FormData();
        formData.append("file", selectedFiles[0]);
        if(editingFileName.length>0){
        formData.append("displayName", editingFileName.trim());
        }else{
        formData.append("displayName", displayNames[0]?.trim());
        }
      

      try {
        setLoading(true);
        setIsPreviewDialogOpen(false);
        await api.client.post(URL_CONSTANTS.DOCUMENTS.UPLOAD_FILE, formData);
        fileUploadSubject.next(true);

        toast.success("Upload successful!", toastOptions);
        setSelectedFiles([]);
        setDisplayNames([]);
        setEditingFileName('')
      } catch (error) {
        console.error(error);
        toast.error("Upload failed. Please try again.", toastOptions);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="upload-section flex-column gap-12 align-items-center p-16">
      <h3>Upload a New File</h3>
      <div className="upload-container">
        <input
          type="file"
          id="select-file"
          accept="application/pdf"
          onChange={handleFileChange}
          multiple={false}
        />
        <label htmlFor="select-file" className="select-file-label">
          <Button color="error" variant="contained" component="span">
            Select Files
          </Button>
        </label>

        <Button
          color="primary"
          variant="contained"
          onClick={handlePreviewDialog}
          className="upload-button"
          disabled={selectedFiles.length === 0 || isEditDialogOpen}
        >
          {loading ? <CircularProgress size={24} /> : "Preview"}
        </Button>
      </div>

      <Modal open={isPreviewDialogOpen} onClose={handleClosePreviewDialog}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
            width: "50%",
          }}
        >
          <h3 className="preview-dialog-title">Preview Files</h3>
          {selectedFiles.map((file, index) => (
            <div className="file-displayName" key={index}>
              <div>
                <span>{displayNames[index]}</span>
              </div>
              <div>
                <i
                  onClick={() => handleOpenEditDialog(index)}
                  className="fa-regular fa-pen-to-square"
                ></i>
              </div>

              <div>
                <i>
                  {" "}
                  <Close onClick={() => handleFileRemove(index)} />
                </i>
              </div>
            </div>
          ))}
          <div className="preview-dialog-btn-container">
            <Button variant="contained" onClick={handleClosePreviewDialog}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleUpload}>
              Upload
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Popup Dialog Box */}
      <Modal
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        aria-labelledby="edit-dialog-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
            width: "30%",
          }}
        >
          <input
            className="dialog-edit-field"
            value={editingFileName}
            onChange={handleEditFileName}
            placeholder="Enter new file name"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <Button variant="contained" onClick={handleSaveChanges}>
              Save
            </Button>
            <Button variant="contained" onClick={handleCloseEditDialog}>
              Close
            </Button>
          </div>
        </Box>
      </Modal>

      <ToastContainer position="top-right" />
    </div>
  );
}

export default FileUpload;
