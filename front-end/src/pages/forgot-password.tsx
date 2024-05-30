import { FormEvent, useState } from "react";
import Button from "../components/button";
import Form from "../components/form/form";
import Input from "../components/form/input";
import StyledLink from "../components/form/styled-link";
import Title from "../components/form/title";
import Vertical from "../components/form/vertical";
import CenterizedContent from "../layouts/centerized-content";
import { patch, post } from "../tools/api";
import Error from "../components/form/errors";
import { questions } from "../settings/user-items";
import Select from "../components/form/select";
import Modal from "../components/modal";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [userQuestions, setUserQuestions] = useState<number[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const navigate = useNavigate();

  const useShowModal = () => {
    setShowModal((prev) => !prev);
  };

  const handleChangePassword = async () => {
    if (password == "") {
      setError("Password tidak boleh kosong");
      useShowModal();
      return;
    }

    try {
        const url = import.meta.env.VITE_API_URL + "/api/update-password";
        await patch(url, { Email: email, Password: password });
    } catch (error: any) {
        setError(error.message);
        useShowModal();
        return;
    }

    setError("");
    alert("Password successfully changed!")
    navigate("/auth/login");
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email == "") {
      setError("Email tidak boleh kosong");
      return;
    } else if (answer == "") {
      setError("Jawaban tidak boleh kosong");
      return;
    }

    let questionID = 1;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i] === selectedQuestion) {
        questionID = i + 1;
      }
    }

    try {
      const url =
        import.meta.env.VITE_API_URL + "/api/validate-question-answer";
      await post(url, {
        Email: email,
        QuestionID: questionID,
        Answer: answer,
      });
    } catch (error: any) {
      setError(error.message);
      return;
    }

    setError("");
    useShowModal();
  };

  const fetchQuestions = async () => {
    if (email == "") {
      setError("Email tidak boleh kosong");
      return;
    }

    let response;

    try {
      const url = import.meta.env.VITE_API_URL + "/api/fetch-questions";
      response = await post(url, { Email: email });
    } catch (error: any) {
      setError(error.message);
      return;
    }

    if (response) {
      setUserQuestions(response);
      setError("");
    }
  };

  return (
    <>
      <CenterizedContent>
        <Title>Forgot Password</Title>
        <Form onSubmit={handleSubmit}>
          <Vertical>
            <label>Email</label>
            <Input
              id="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Vertical>
          {userQuestions.length === 0 ? (
            <>
              <Error error={error} />
              <Button type="button" onClick={fetchQuestions}>
                Next
              </Button>
            </>
          ) : (
            <>
              <Vertical>
                <label>Personal Security Question</label>
                <Select onChange={(e) => setSelectedQuestion(e.target.value)}>
                  {userQuestions.map((questionID, index) => (
                    <option key={index} value={questions[questionID - 1]}>
                      {questions[questionID - 1]}
                    </option>
                  ))}
                </Select>
              </Vertical>
              <Vertical>
                <label>Answer</label>
                <Input
                  type="text"
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </Vertical>
              <Error error={error} />
              <Button type="submit">Next</Button>
            </>
          )}
          <StyledLink to="/auth/login">Back to Login</StyledLink>
        </Form>
      </CenterizedContent>
      <Modal show={showModal} onClose={useShowModal}>
        <Vertical>
          <label>New password</label>
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="button" onClick={handleChangePassword}>
            Change password
          </Button>
        </Vertical>
      </Modal>
    </>
  );
}

export default ForgotPassword;
