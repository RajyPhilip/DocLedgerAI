import React, { useEffect, useState } from "react";
import "./FormInput.scss";

const FormInput = ({
  id,
  placeholder,
  inputChangeHandler,
  type,
  isRequired = true,
  multiple = false,
  options,
  value,
  disabled,
  onBlur, // ✅ NEW PROP
}) => {
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [inputType, setInputType] = useState(type);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    setInputType(type === "password" ? "password" : type);
  }, [type]);

  const togglePassword = () => {
    setInputType(passwordHidden ? "text" : type);
    setPasswordHidden((val) => !val);
  };

  return (
    <div className="input-container">
      {value !== "" && value !== undefined && (
        <label className="input-label">{placeholder}</label>
      )}

      <input
        className={`form-input xetgo-font-button p-12 ${
          value !== "" && value !== undefined ? "input-active" : ""
        }`}
        id={id}
        placeholder={placeholder}
        type={inputType}
        value={value || ""}
        disabled={disabled || type === "file" || type === "select"}
        required={isRequired}
        onChange={(e) => inputChangeHandler(e)}
        onBlur={onBlur} // ✅ PASSED TO INPUT
      />

      {type === "password" && (
        <img
          src={
            passwordHidden
              ? passwordIconUrl.hidden
              : passwordIconUrl.visible
          }
          className="icon"
          onClick={togglePassword}
          alt="toggle-password"
        />
      )}
    </div>
  );
};

export default FormInput;

// ---------------- ICONS ----------------

const passwordIconUrl = {
  visible:
    "https://xetoolbucket.s3.ap-south-1.amazonaws.com/1690536373442-eye.svg",
  hidden:
    "https://xetoolbucket.s3.ap-south-1.amazonaws.com/1690536030822-eye-off.svg",
};
