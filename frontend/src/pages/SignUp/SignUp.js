import { useEffect, useState } from "react";
import "./SignUp.scss";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import ApiService from "../../services/apiService";
import useUserStore from "../../store/useUserStore";
import { setCookie, JWT_TOKEN } from "../../services/cookieService";
import { toast } from "react-toastify";
import URL_CONSTANTS from "../../urls/Urls";

const Signup = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [validForm, setValidForm] = useState(false);
  const [mobileTouched, setMobileTouched] = useState(false);
  const [mobileError, setMobileError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    mobileNumber: "",
  });

useEffect(() => {
  setValidForm(
    Object.values(formData).every((value) => value !== "") &&
    mobileError === ""
  );
}, [formData, mobileError]);

 const inputChangeHandler = (event) => {
  const { id, value } = event.target;

  setFormData((prev) => ({ ...prev, [id]: value }));

  if (id === "mobileNumber") {
    validateMobileNumber(value);
  }
};


  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validForm) return;

    try {
      const api = ApiService();

      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        mobile_number: Number(formData.mobileNumber),
      };

      const response = await api.client.post(URL_CONSTANTS.USERS.SIGNUP, payload);

      const { token, user } = response.data.data;

      // persist auth
      setCookie(JWT_TOKEN, token);
      setUser(user);

      toast.success("Account created successfully!");
      navigate("/documents");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Signup failed"
      );
    }
  };

  const validateMobileNumber = (value) => {
  if (value.length === 0) {
    setMobileError("");
    return;
  }

  if (value.length !== 10) {
    setMobileError("Please enter a valid 10-digit phone number");
  } else {
    setMobileError("");
  }
};


  return (
    <div className="signup">
      <div className="signup-left flex-column align-items-center">
        <div className="center-signup-content">
          <form
            onSubmit={onSubmitHandler}
            className="signup-form flex-column gap-8 justify-content-center full-height"
          >
            <FormInput
              id="email"
              placeholder="Email Address"
              value={formData.email}
              inputChangeHandler={inputChangeHandler}
            />
            <FormInput
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              inputChangeHandler={inputChangeHandler}
            />
            <FormInput
              id="name"
              placeholder="Full Name"
              value={formData.name}
              inputChangeHandler={inputChangeHandler}
            />
           <FormInput
  type="number"
  id="mobileNumber"
  placeholder="Mobile Number"
  value={formData.mobileNumber}
  inputChangeHandler={inputChangeHandler}
  onBlur={() => {
    setMobileTouched(true);
    validateMobileNumber(formData.mobileNumber);
  }}
/>

{mobileTouched && mobileError ? (
  <p style={{height:'12px'}} className="xetgo-font-mini error-text flex-row align-items-center justify-content-center">{mobileError}</p>
) : <p style={{height:'12px'}}></p>}

            <button
              type="submit"
              disabled={!validForm}
              className={`sign-up-btn p-8 ${
                validForm ? "valid-form" : ""
              }`}
            >
              SignUp
            </button>

            <p className="xetgo-font-tag flex-row align-items-center justify-content-center gap-2">
              <span>Already have an account ?{"  "}</span>
              <span
                className="active-sign-in-link cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                {"  "} Sign In
              </span>
            </p>
          </form>
        </div>
      </div>
      <div className="signup-right"></div>
    </div>
  );
};

export default Signup;
