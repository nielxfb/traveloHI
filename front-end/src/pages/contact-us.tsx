import NavbarLayout from "../layouts/navbar-layout";
import Center from "../components/center";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.background};
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
`;

function ContactUs() {
  return (
    <NavbarLayout>
      <Center>
        <Wrapper>
            <h1>Email: admin@travelohi.com</h1>
            <h1>Phone number: +62-896-1787-5013</h1>
        </Wrapper>
      </Center>
    </NavbarLayout>
  );
}

export default ContactUs;
