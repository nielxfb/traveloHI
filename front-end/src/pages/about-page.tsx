import NavbarLayout from "../layouts/navbar-layout";
import CenterizedContent from "../layouts/centerized-content";
import styled from "styled-components";
import Center from "../components/center";

const Wrapper = styled.div`
    background-color: ${props => props.theme.background};
    border-radius: 0.5rem;
    height: 70vh;
    width: auto;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 6rem;
`;

function AboutPage() {
  return (
    <NavbarLayout>
      <Center>
        <Wrapper>
          <img src="/nl232.jpg" />
          &emsp; This website is created by Daniel Adamlu, NL23-2, in order to
          fulfill the self development assignment on his first year job being a
          laboratory assistant.
        </Wrapper>
      </Center>
    </NavbarLayout>
  );
}

export default AboutPage;
