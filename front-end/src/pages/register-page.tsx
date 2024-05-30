import { ChangeEvent, FormEvent, useRef, useState } from "react";
import Form from "../components/form/form";
import Input from "../components/form/input";
import Title from "../components/form/title";
import { IUser } from "../interfaces/user-interface";
import Horizontal from "../components/form/horizontal";
import Vertical from "../components/form/vertical";
import Select from "../components/form/select";
import Button from "../components/button";
import DefaultLayout from "../layouts/default-layout";
import Error from "../components/form/errors";
import UploadProfilePhoto from "../firebase/upload-profile-photo";
import { post } from "../tools/api";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Center from "../components/center";
import { genders, questions } from "../settings/user-items";

function RegisterPage() {
  const [userData, setUserData] = useState<IUser>({
    ...({} as IUser),
    Gender: genders[0],
    PersonalSecurityQuestions: [{ QuestionID: 1, Answer: "" }],
  });
  const [password, setPassword] = useState("");
  const [confPass, setConfPass] = useState("");
  const [error, setError] = useState("");
  const [questionCount, setQuestionCount] = useState(1);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const navigate = useNavigate();

  const imageRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, checked, type } = event.target;
    setUserData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuestionChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const updatedQuestions = [...userData.PersonalSecurityQuestions];
    updatedQuestions[index].Answer = e.target.value;
    setUserData({
      ...userData,
      PersonalSecurityQuestions: updatedQuestions,
    });
  };

  const handleQuestionSelect = (index: number) => {
    const updatedQuestions = [...userData.PersonalSecurityQuestions];
    updatedQuestions[index].QuestionID = index + 1;
    setUserData({
      ...userData,
      PersonalSecurityQuestions: updatedQuestions,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaVerified) {
      setError("Please verify that you are not a robot!");
      return;
    }

    const image = imageRef.current?.files?.[0];
    if (image == undefined) {
      setError("Please upload a profile picture!");
      return;
    }

    if (password != confPass) {
      setError("Passwords do not match!");
      return;
    }

    const link = await UploadProfilePhoto(
      image,
      `${userData.FirstName}_${userData.LastName}`
    );

    if (link == undefined) {
      setError("Failed to upload profile picture!");
      return;
    }

    const url = import.meta.env.VITE_API_URL + "/api/sign-up";

    try {
      await post(url, {
        ...userData,
        Password: password,
        ProfilePictureLink: link,
      });
    } catch (error: any) {
      setError(error.message);
      return;
    }

    setError("");
    alert("Successfully created new user!");
    navigate("/auth/login");
  };

  const addQuestion = () => {
    if (questionCount < 5) {
      setUserData({
        ...userData,
        PersonalSecurityQuestions: [
          ...userData.PersonalSecurityQuestions,
          { QuestionID: questionCount + 1, Answer: "" },
        ],
      });
      setQuestionCount((prev) => prev + 1);
    }
  };

  const removeQuestion = () => {
    if (questionCount > 1) {
      const updatedQuestions = [...userData.PersonalSecurityQuestions];
      updatedQuestions.pop();
      setUserData({
        ...userData,
        PersonalSecurityQuestions: updatedQuestions,
      });
      setQuestionCount((prev) => prev - 1);
    }
  };

  const handleGenderChange = (gender: string) => {
    setUserData({
      ...userData,
      Gender: gender,
    });
  };

  const handleRecatpchaChange = (value: string | null) => {
    if (value) {
      setCaptchaVerified(true);
    } else {
      setCaptchaVerified(false);
    }
  };

  return (
    <DefaultLayout>
      <Title>Register</Title>
      <Form onSubmit={handleSubmit}>
        <Vertical>
          <label>Email</label>
          <Input id="Email" type="email" onChange={handleChange} required />
        </Vertical>
        <Horizontal>
          <Vertical>
            <label>First Name</label>
            <Input
              id="FirstName"
              type="text"
              onChange={handleChange}
              required
            />
          </Vertical>
          <Vertical>
            <label>Last Name</label>
            <Input id="LastName" type="text" onChange={handleChange} required />
          </Vertical>
        </Horizontal>
        <Vertical>
          <label>Phone Number</label>
          <Input
            id="PhoneNumber"
            type="tel"
            onChange={handleChange}
            required
          />
        </Vertical>
        <Vertical>
          <label>Date of Birth</label>
          <Input id="DOB" type="date" onChange={handleChange} required />
        </Vertical>
        <Vertical>
          <label>Address</label>
          <Input id="Address" type="text" onChange={handleChange} required />
        </Vertical>
        <Vertical>
          <label>Password</label>
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Vertical>
        <Vertical>
          <label>Confirm Password</label>
          <Input
            type="password"
            onChange={(e) => setConfPass(e.target.value)}
            required
          />
        </Vertical>
        <Vertical>
          <label>Gender</label>
          <Select onChange={(e) => handleGenderChange(e.target.value)} required>
            {genders.map((gender, index) => (
              <option key={index} value={gender}>
                {gender}
              </option>
            ))}
          </Select>
        </Vertical>
        <Vertical>
          <label>Upload Profile Picture</label>
          <Input type="file" ref={imageRef} accept="image/*" required />
        </Vertical>
        {userData.PersonalSecurityQuestions.map((question, index) => (
          <Vertical key={index}>
            <label>{`Security Question ${index + 1}`}</label>
            <Select
              value={questions[question.QuestionID - 1]}
              onChange={(e) => handleQuestionSelect(index)}
              required
            >
              {questions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </Select>
            <label>{`Security Answer ${index + 1}`}</label>
            <Input
              type="text"
              value={question.Answer}
              onChange={(e) => handleQuestionChange(index, e)}
              required
            />
          </Vertical>
        ))}
        <Horizontal>
          {questionCount > 1 && (
            <Button type="button" onClick={removeQuestion}>Remove question</Button>
          )}
          {questionCount < 5 && (
            <Button type="button" onClick={addQuestion}>Add question (max 5)</Button>
          )}
        </Horizontal>
        <Horizontal>
          <label>Subscribe to Newsletter</label>
          <Input id="Subscribe" type="checkbox" onChange={handleChange} />
        </Horizontal>
        <ReCAPTCHA
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          onChange={handleRecatpchaChange}
        />
        <Error error={error} />
        <Button type="submit">Register</Button>
        <Center>
          <p>
            Already registered? Click
            <a style={{ color: 'blue' }}>
              <Link to="/auth/login"> here </Link>
            </a>
            to login.
          </p>
        </Center>
      </Form>
    </DefaultLayout>
  );
}

export default RegisterPage;
