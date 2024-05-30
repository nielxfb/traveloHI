import styled from "styled-components";
import { IChildren } from "../interfaces/children-interface";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Content = styled.div`
  background-color: ${(props) => props.theme.secondary};
  padding: 2rem;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

function NavbarLayout({ children }: IChildren) {
  return (
    <Wrapper>
      <Navbar />
      <Content>{children}</Content>
      <Footer />
    </Wrapper>
  );
}

export default NavbarLayout;
