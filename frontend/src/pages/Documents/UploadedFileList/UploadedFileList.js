import "./UploadedFileList.scss";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchedText, setSearchedText] = useState("");
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [currentEditedFileID, setCurrentEditedFileID] = useState();
  const [fileExtension, setFileExtension] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Function to get the pageNumber from the URL
  const getPageNumberFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    const pageNumber = searchParams.get("pageNumber");
    return pageNumber ? parseInt(pageNumber, 10) : 1;
  };

  const debouncedSearch = useMemo(() => {
    return debounce((searchText) => {
      navigate(generateFileListURL(1, searchText));
    }, 500);
  }, [navigate]);

  const handleSearchFile = (
    event,
  ) => {
    const searchText = event.target.value;
    setSearchedText(searchText);
    debouncedSearch(searchText);
  };
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  useEffect(() => {
    const filteredFiles = files.filter((file,ind) => {
      return file.name?.toLowerCase().includes(searchedText.toLowerCase());
    });
    searchedText === ""
      ? setFilteredFiles(files)
      : setFilteredFiles(filteredFiles);
  }, [files, searchedText]);

  const handleDataAfterDeletion = (deletedID) => {
    const updatedFiles = files.filter((file) => file.id !== deletedID);
    if (updatedFiles.length <= 0 && currentPage > 1) {
      navigate(generateFileListURL(currentPage - 1, searchedText));
    } else {
      navigate(generateFileListURL(currentPage, searchedText));
    }
  };

  const handlePreviousPage = () => {
    navigate(generateFileListURL(currentPage - 1, searchedText));
  };

  const handleNextPage = () => {
    navigate(generateFileListURL(currentPage + 1, searchedText));
  };

  const handleDeleteFile = async (fileUrl, fileID) => {
    try {
      await handleDeleteFileFromServer(fileID);
      handleDataAfterDeletion(fileID);
      toast.success("File Deleted successfully!", toastOptions);
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleEditFile = (fileId) => {
    setEditMode(true);
    setCurrentEditedFileID(fileId);
    const editedFile = files.find((file) => file.id === fileId);
    if (editedFile) {
      const fileNameParts = editedFile.name.split(".");
      const fileName = fileNameParts.slice(0, -1).join(".");
      const fileExtension = fileNameParts.slice(-1)[0];
      setEditedName(fileName);
      setFileExtension(fileExtension);
    }
  };

  const saveEditedName = async (fileID) => {
    if (!editedName) {
      return;
    }
    let updatedFileName = editedName;
    const updatedFiles = files.map((file) => {
      if (file.id === fileID) {
        updatedFileName = editedName + "." + fileExtension;
        return {
          ...file,
          name: updatedFileName,
        };
      }
      return file;
    });
    await editFileFromDb(fileID, updatedFileName);
    setFiles(updatedFiles);
    setEditMode(false);
    setEditedName("");
    toast.success("Edited File successfully!", toastOptions);
  };

  const fetchAndSetFiles = async (pageNumber, searchQuery) => {
    try {
      const response = await fetchFiles(
        pageNumber,
        searchQuery,
      );
      setFiles(response.data||[]);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("error fetching and setting files", error);
    }
  };

  useEffect(() => {
    const subscription = fileUploadSubject.subscribe(
      async (shouldFetch) => {
        if (shouldFetch) {
          await fetchAndSetFiles(currentPage, searchedText);
        }
      },
    );
    return () => subscription.unsubscribe();
  }, [currentPage, searchedText]);

  useEffect(() => {
    const currentPageNumber = getPageNumberFromUrl();
    setCurrentPage(currentPageNumber);
    const _searchQuery =
      new URLSearchParams(location.search).get("search") || "";
    setSearchedText(_searchQuery);
    fetchAndSetFiles(currentPageNumber, _searchQuery).then((r) => {
      return r;
    });
  }, [location]);

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
              className="fa-solid fa-circle-arrow-left"
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
              className="fa-solid fa-circle-arrow-right"
              onClick={handleNextPage}
            ></i>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadedFileList;
