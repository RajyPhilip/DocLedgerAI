import "./UploadedFileList.scss";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchFiles,
  fileUploadSubject,
  handleDeleteFileFromServer,
  editFileFromDb,
} from "../../../services/file.service";
import { toastOptions } from "../../../utils/toast";
import { debounce } from "lodash";

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

  const fetchAndSetFiles = async (page, search) => {
    try {
      const response = await fetchFiles(page, search);
      setFiles(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Fetch files failed:", err);
    }
  };

  useEffect(() => {
    fetchAndSetFiles(currentPage, searchedText);
  }, []);

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

  useEffect(() => {
    const sub = fileUploadSubject.subscribe((refresh) => {
      if (refresh) {
        fetchAndSetFiles(currentPage, searchedText);
      }
    });
    return () => sub.unsubscribe();
  }, [currentPage, searchedText]);

  const handleDeleteFile = async (fileID) => {
    try {
      await handleDeleteFileFromServer(fileID);
      toast.success("File deleted successfully!", toastOptions);
      fetchAndSetFiles(currentPage, searchedText);
    } catch (err) {
      toast.error('File Deletion Failed!',toastOptions)
      console.error(err);
    }
  };

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

  const handleRowClick = (id) => {
    navigate(`/documents/${id}`);
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
            <th>Uploaded At</th>

          </tr>
        </thead>
        <tbody>
          {filteredFiles.map((file, index) => (
            <tr 
            className="cursor-pointer"
             onClick={() => handleRowClick(file.id)}
             key={index}>
              {editMode && currentEditedFileID === file.id ? (
                <input
                onClick={(e)=>e.stopPropagation()}
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

              <td    className="preview">
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="download-button"
                >
                  Preview / Download{" "}
                  <i className="fa-solid fa-cloud-arrow-down"></i>
                </a>
              </td>
              <td  className="actions flex-row gap-16 align-items-center justify-content-center">
                <i
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file.id);
                  }}
                  className="fa-solid fa-trash"
                  style={{ color: "lightgrey" }}
                ></i>

                <i
                  onClick={(e) =>{ e.stopPropagation()
                     handleEditFile(file.id)
                    }}
                  className="fa-regular fa-pen-to-square"
                ></i>
              </td>
               <td className="uploaded-at xetgo-font-tag bold">
                  {new Date(file.createdAt).toLocaleString()}
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
