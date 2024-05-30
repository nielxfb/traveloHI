import Form from "../components/form/form";
import Title from "../components/form/title";
import Input from "../components/form/input";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import CenterizedContent from "../layouts/centerized-content";
import Error from "../components/form/errors";
import { useAuth } from "../providers/auth-context-provider";
import { post } from "../tools/api";
import Button from "../components/button";
import Horizontal from "../components/form/horizontal";
import StyledLink from "../components/form/styled-link";
import ReCAPTCHA from "react-google-recaptcha";
import Modal from "../components/modal";
import Vertical from "../components/form/vertical";
import ResendOTPButton from "../components/form/resend-otp-button";
import { sendOTP } from "../tools/send-otp";
import { Link } from "react-router-dom";
import Center from "../components/center";

interface LoginData {
  email: string;
  password: string;
}

function LoginPage() {
  const auth = useAuth();
  const [loginData, setLoginData] = useState<LoginData>({} as LoginData);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string>("");
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const otpRef = useRef<HTMLInputElement>(null);

  const isEmailFormat = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const useShowModal = async () => {
    if (loginData.email == undefined || loginData.email == "") {
      setError("Email tidak boleh kosong");
      return;
    } else if (!isEmailFormat(loginData.email)) {
      setError("Email tidak valid");
      return;
    }
    setError("");

    if (showModal) {
      setShowModal(false);
      return;
    }

    try {
      await sendOTP(loginData.email);
    } catch (error: any) {
      setError(error.message);
      setShowModal(false);
      return;
    }

    setShowModal(true);
  };

  const toggleVisibility = () => {
    if (loginData.email == undefined || loginData.email == "") {
      setError("Email tidak boleh kosong");
      return;
    } else if (!isEmailFormat(loginData.email)) {
      setError("Email tidak valid");
      return;
    } else {
      setError("");
      setVisible(true);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRecatpchaChange = (value: string | null) => {
    if (value) {
      setCaptchaVerified(true);
    } else {
      setCaptchaVerified(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaVerified) {
      setError("Please verify that you are not a robot!");
      return;
    }

    const email = loginData.email;
    const password = loginData.password;
    const url = import.meta.env.VITE_API_URL + "/api/login";
    let response;
    try {
      response = await post(
        url,
        { Email: email, Password: password },
        { withCredentials: true }
      );
    } catch (error: any) {
      setError(error.message);
      return;
    }
    setError("");
    if (response) {
      auth.login(response.token);
    }
  };

  const handleSubmitOTP = async () => {
    const otp = otpRef.current?.value;

    if (otp == undefined || otp.length != 6) {
      setError("Please enter exactly 6 digits");
      return;
    }

    setError("");
    setShowModal(false);

    let response;
    try {
      const url = import.meta.env.VITE_API_URL + "/api/validate-otp";
      response = await post(url, { Email: loginData.email, OTP: otp })
    } catch (error: any) {
      setError(error.message);
      return;
    }

    setError("");
    if (response) {
      auth.login(response.token);
    }
  }

  return (
    <>
      <CenterizedContent>
        <Title>Login/Daftar</Title>
        <Form onSubmit={handleSubmit}>
          <label>Email</label>
          <Input id="email" type="email" onChange={handleChange} required />
          {visible && (
            <>
              <label>Password</label>
              <Input
                id="password"
                type="password"
                onChange={handleChange}
                required
              />
            </>
          )}
          <Error error={error} />
          {!visible ? (
            <>
              <Button type="button" onClick={toggleVisibility}>
                Lanjutkan
              </Button>
              <Button type="button" onClick={useShowModal}>
                Login With OTP
              </Button>
            </>
          ) : (
            <>
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={handleRecatpchaChange}
              />
              <Button type="submit">Login</Button>
            </>
          )}
          <Horizontal>
            <div style={{ borderBottom: "1px solid black", width: 55 }} />
            <span style={{ margin: "0 10px" }}>atau login/daftar dengan</span>
            <div style={{ borderBottom: "1px solid black", width: 55 }} />
          </Horizontal>
          <StyledLink to="/auth/register">Register</StyledLink>
          <Center>
            <Link to="/auth/forgot-password">Forgot password?</Link>
          </Center>
        </Form>
      </CenterizedContent>
      <Modal show={showModal} onClose={useShowModal}>
        <Vertical>
          <label>OTP</label>
          <Input
            ref={otpRef}
            type="number"
            onChange={handleChange}
            required
            title="Please enter exactly 6 digits"
          />
          <ResendOTPButton email={loginData.email} setError={setError} />
          <Button onClick={handleSubmitOTP}>Login</Button>
        </Vertical>
      </Modal>
    </>
  );
}

export default LoginPage;
