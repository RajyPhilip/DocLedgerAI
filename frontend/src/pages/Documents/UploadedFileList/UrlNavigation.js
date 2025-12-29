export function generateFileListURL(pageNumber, searchText) {
  let url = "/files";

  // Add page number to the URL if it's greater than 1
  if (pageNumber > 1) {
    url += `?pageNumber=${pageNumber}`;
  }

  // Add search text to the URL if it's not empty
  if (searchText) {
    url += `${pageNumber > 1 ? "&" : "?"}search=${searchText}`;
  }

  return url;
}
