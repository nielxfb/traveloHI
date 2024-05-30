import { ChangeEvent, FormEvent, useState } from "react";
import Form from "../components/form/form";
import Input from "../components/form/input";
import Title from "../components/form/title";
import { post } from "../tools/api";
import Button from "../components/button";
import styled from "styled-components";

interface IMessage {
  Subject: string;
  Message: string;
}

const Wrapper = styled.div`
  width: 100%;
  padding: 2rem;
  background-color: ${(props) => props.theme.background};
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.fontDimmed};
`;

function SendEmail() {
  const [message, setMessage] = useState<IMessage>({} as IMessage);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage({
      ...message,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = import.meta.env.VITE_API_URL + "/api/send-email";
    post(url, message).then(() => {
      alert("Successfully sent email!");
    });
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Title>Send Email to Subscribed Users</Title>
        <label>Subject</label>
        <Input id="Subject" type="text" onChange={handleChange} required />
        <label>Message</label>
        <Input id="Message" type="text" onChange={handleChange} required />
        <Button type="submit">Send Email</Button>
      </Form>
    </Wrapper>
  );
}

export default SendEmail;
