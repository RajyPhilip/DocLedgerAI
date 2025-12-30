import "./UploadedFileList.scss";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchFiles,
  fileUploadSubject,
  FetchFilesResponse,
  handleDeleteFileFromServer,
  editFileFromDb,
} from "../../../services/file.service";
import { toastOptions } from "../../../utils/toast";
import { debounce } from "lodash";
import { generateFileListURL } from "./UrlNavigation";

const UploadedFileList = () => {
 
   const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchedText, setSearchedText] = useState("");
  const [isSearchFocused, setSearchFocused] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [currentEditedFileID, setCurrentEditedFileID] = useState(null);
  const [fileExtension, setFileExtension] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  /* ================= PAGE FROM URL ================= */

  const getPageFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return Number(params.get("pageNumber")) || 1;
  };

  /* ================= FETCH ================= */

  const fetchAndSetFiles = async (page, search) => {
    try {
      const response = await fetchFiles(page, search);
      setFiles(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Fetch files failed:", err);
    }
  };

  /* ================= INITIAL LOAD & PAGE CHANGE ================= */

  useEffect(() => {
    fetchAndSetFiles(currentPage, searchedText);
  }, []);

  /* ================= DEBOUNCED SEARCH (NO URL) ================= */

  const debouncedSearch = useMemo(
    () =>
      debounce((text) => {
        fetchAndSetFiles(1, text);
        setCurrentPage(1);
      }, 500),
    []
  );

  const handleSearchFile = (e) => {
    const text = e.target.value;
    setSearchedText(text);
    debouncedSearch(text);
  };

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  /* ================= CLIENT FILTER ================= */

  useEffect(() => {
    if (!searchedText) {
      setFilteredFiles(files);
    } else {
      setFilteredFiles(
        files.filter((f) =>
          f.name?.toLowerCase().includes(searchedText.toLowerCase())
        )
      );
    }
  }, [files, searchedText]);

  /* ================= FILE UPLOAD REFRESH ================= */

  useEffect(() => {
    const sub = fileUploadSubject.subscribe((refresh) => {
      if (refresh) {
        fetchAndSetFiles(currentPage, searchedText);
      }
    });
    return () => sub.unsubscribe();
  }, [currentPage, searchedText]);

  /* ================= DELETE ================= */

  const handleDeleteFile = async (fileID) => {
    try {
      await handleDeleteFileFromServer(fileID);
      toast.success("File deleted successfully!", toastOptions);
      fetchAndSetFiles(currentPage, searchedText);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= EDIT ================= */

  const handleEditFile = (fileId) => {
    setEditMode(true);
    setCurrentEditedFileID(fileId);

    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    const parts = file.name.split(".");
    setEditedName(parts.slice(0, -1).join("."));
    setFileExtension(parts.at(-1));
  };

  const saveEditedName = async (fileID) => {
    if (!editedName) return;

    const newName = `${editedName}.${fileExtension}`;
    await editFileFromDb(fileID, newName);

    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileID ? { ...f, name: newName } : f
      )
    );

    setEditMode(false);
    setEditedName("");
    toast.success("File renamed successfully!", toastOptions);
  };

  /* ================= PAGINATION ================= */

const handlePreviousPage = () => {
  if (currentPage === 1) return;

  const newPage = currentPage - 1;
  setCurrentPage(newPage);
  fetchAndSetFiles(newPage, searchedText);
};

const handleNextPage = () => {
  if (currentPage === totalPages) return;

  const newPage = currentPage + 1;
  setCurrentPage(newPage);
  fetchAndSetFiles(newPage, searchedText);
};

  return (
    <div className="list-container">
      <div className="search-container">
        <input
          placeholder="Search your file..."
          className={isSearchFocused ? "input-focused" : "input"}
          id="search-file-input"
          onChange={handleSearchFile}
          value={searchedText}
          onFocus={() => {
            setSearchFocused(true);
          }}
          onBlur={() => {
            setSearchFocused(false);
          }}
        />
        <i className="fa-solid fa-magnifying-glass"></i>
        <h4 className="result-showing-heading">
          {" "}
          ( {filteredFiles.length} ) results showing{" "}
        </h4>
      </div>

      {filteredFiles.length === 0 ? <h4> NO FILES FOUND </h4> : null}

      <table className="home-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Download</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles.map((file, index) => (
            <tr key={index}>
              {editMode && currentEditedFileID === file.id ? (
                <input
                  className="edit-box"
                  type="text"
                  value={editedName}
                  placeholder={`${file.name}`}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveEditedName(file.id);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <td>{file.name}</td>
              )}

              <td className="preview">
                <a
                  
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="download-button"
                >
                  Preview / Download{" "}
                  <i className="fa-solid fa-cloud-arrow-down"></i>
                </a>
              </td>
              <td className="actions">
                <i
                  onClick={() => handleDeleteFile(file.url, file.id)}
                  className="fa-solid fa-trash"
                  style={{ color: "lightgrey" }}
                ></i>
                <i
                  className="fa-regular fa-envelope"
                  style={{ color: "lightgrey" }}
                ></i>

                <i
                  onClick={() => handleEditFile(file.id)}
                  className="fa-regular fa-pen-to-square"
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="pagination-container">
          {currentPage === 1 ? (
            <i className="fa-solid fa-circle-arrow-left disable"></i>
          ) : (
            <i
              className="fa-solid fa-circle-arrow-left cursor-pointer"
              onClick={handlePreviousPage}
            ></i>
          )}
          <p>
            {" "}
            <span> {currentPage} </span> of {totalPages}
          </p>
          {currentPage === totalPages ? (
            <i className="fa-solid fa-circle-arrow-right disable"></i>
          ) : (
            <i
              className="fa-solid fa-circle-arrow-right cursor-pointer"
              onClick={handleNextPage}
            ></i>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadedFileList;
