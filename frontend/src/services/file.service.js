import { Subject } from "rxjs";
import ApiService from "./apiService";
import URL_CONSTANTS from "../urls/Urls";

const apiClient = ApiService().client;
export const fileUploadSubject = new Subject();

export const fetchFiles = async (pageNumber, searchQuery) => {
  try {
    const params = { pageNumber };
    if (searchQuery) {
      params.search = searchQuery; 
    }

    const response = await apiClient.get(
      URL_CONSTANTS.DOCUMENTS.GET,
      { params }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    return { data: [], totalPages: 0 };
  }
};

export const handleDeleteFileFromServer = async (
  fileID
)=> {
  try {
    await apiClient.delete(URL_CONSTANTS.DOCUMENTS.DELETE(fileID));
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export const editFileFromDb = async (id, fileName) => {
  const apiClient = ApiService().client;

  return apiClient.patch(URL_CONSTANTS.DOCUMENTS.UPDATE_FILE(id), {
    fileName,
  });
};
