import { useEffect, useState } from "react";
import "./SignUp.scss";
import { useNavigate } from "react-router-dom";
import { breakPointObserver} from "../../utils/BreakpointObserver";
import FormInput from "../../components/FormInput/FormInput";
import ApiService from "../../services/apiService";
import useUserStore from "../../store/useUserStore";
import { setCookie, JWT_TOKEN } from "../../services/cookieService";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [breakpoint, setBreakpoint] = useState("");
  const [validForm, setValidForm] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    mobileNumber: "",
    position: "",
  });

  useEffect(() => {
    breakPointObserver(setBreakpoint);
  }, []);

  useEffect(() => {
    setValidForm(
      Object.values(formData).every((value) => value !== "")
    );
  }, [formData]);

  const inputChangeHandler = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validForm) return;

    try {
      const api = ApiService();

      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        mobile_number: Number(formData.mobileNumber),
        position: formData.position,
      };

      const response = await api.client.post("/auth/signup", payload);

      const { token, user } = response.data.data;

      // 🔐 persist auth
      setCookie(JWT_TOKEN, token);
      setUser(user);

      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <div className="signup">
      <div className="signup-left flex-column align-items-center">
        <div className="center-signup-content">
          <form
            onSubmit={onSubmitHandler}
            className="signup-form flex-column gap-8"
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
              id="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              inputChangeHandler={inputChangeHandler}
            />
            <FormInput
              id="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              inputChangeHandler={inputChangeHandler}
            />
            <FormInput
              id="position"
              placeholder="Position You Play"
              value={formData.position}
              inputChangeHandler={inputChangeHandler}
            />

            <button
              type="submit"
              disabled={!validForm}
              className={`sign-up-btn ${
                validForm ? "valid-form" : ""
              }`}
            >
              Continue
            </button>

            <p className="xetgo-font-tag">
              Already have an account?{" "}
              <span
                className="active-sign-in-link cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
