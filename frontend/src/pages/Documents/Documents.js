import "./Documents.scss";
import Header from "../../components/Header/Header";
import FileUpload from "./FileUpload/FileUpload";
import UploadedFileList from "./UploadedFileList/UploadedFileList";

const LIMIT = 10;

const Documents = () => {



  return (

    <div className="documents-main-page-container full-width">
      <div className="documents-content-body flex-column">
        <Header ></Header>
        <div className="documents-files-container ">
          <img
        
            src="https://d2k6zobmg5lufr.cloudfront.net/assets%2F20240109190634-box+1.svg"
            alt="box-background"
            className="documents-box-background"
          />
          <FileUpload></FileUpload>
          <UploadedFileList></UploadedFileList>
        </div>
      </div>
    </div>
  );
};

export default Documents;
