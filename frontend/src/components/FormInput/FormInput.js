import React, { useEffect, useState } from "react";
import "./FormInput.scss";

const FormInput= ({
  id,
  placeholder,
  inputChangeHandler,
  type = "text",
  isRequired = true,
  multiple = false,
  options,
  value,
  disabled,
}) => {
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [inputType, setInputType] = useState(type);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    setInputType(type === "password" ? "password" : "text");
  }, [type]);

  const togglePassword = () => {
    setInputType(passwordHidden ? "text" : type);
    setPasswordHidden((val) => !val);
  };

  const uploadFile = () => {
    // if (inputFileRef.current) {
    //   // inputFileRef.current.click();
    // }
  };

  const toggleDropdown = () => {
    setDropdownVisible((val) => !val);
  };

  const handleDropDownChange = (opt) => {
    // inputChangeHandler( opt );
    setDropdownVisible(false);
  };

  return (
    <div className="input-container">
      {value !== "" && value !== undefined && (
        <label className="input-label">{placeholder}</label>
      )}

      <input
        className={`form-input xetgo-font-button p-12  ${
          value !== "" && value !== undefined ? "input-active" : ""
        }`}
        id={id}
        placeholder={placeholder}
        type={inputType}
        value={value || ""}
        disabled={disabled || type === "file" || type === "select"}
        required={isRequired}
        onChange={(e) => inputChangeHandler(e)}
      />
      {type === "password" && (
        <img
          src={
            passwordHidden
              ? passwordIconUrl["hidden"]
              : passwordIconUrl["visible"]
          }
          className="icon"
          onClick={togglePassword}
        />
      )}

      {type === "file" && (
        <>
          <img
            src="https://xetoolbucket.s3.ap-south-1.amazonaws.com/1690540943906-upload-file.svg"
            className="icon"
            onClick={uploadFile}
          />
          <input
            className="form-upload"
            id={id}
            placeholder={placeholder}
            type="file"
            // ref={inputFileRef}
            multiple={multiple}
            hidden={true}
            onChangeCapture={inputChangeHandler}
          />
        </>
      )}
      {type === "select" && (
        <>
          <img
            src="https://xetoolbucket.s3.ap-south-1.amazonaws.com/1690542605089-dropdown.svg"
            className="icon"
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div className="dropdown">
              {options &&
                options.map((opt, i) => {
                  return (
                    <div
                      key={i}
                      className="option"
                      // onClick={() => handleDropDownChange(opt.id,opt.value)}
                    >
                      <h1>find the element </h1>
                    </div>
                  );
                })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default FormInput;

const passwordIconUrl = {
  visible:
    "https://xetoolbucket.s3.ap-south-1.amazonaws.com/1690536373442-eye.svg",
  hidden:
    "https://xetoolbucket.s3.ap-south-1.amazonaws.com/1690536030822-eye-off.svg",
};

const CustomStyle = {
  width: "364px",
  height: "44px",
  padding: "13px",
  borderRadius: "4px",
  border: "1px solid #eeeeee",
  backgroundColor: "#f7f7f7",
  outline: "none",
  appearance: "none",
};