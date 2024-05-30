import styled from "styled-components";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar/sidebar";
import { PROFILE_ITEMS } from "../components/sidebar/sidebar-items";
import { IChildren } from "../interfaces/children-interface";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  background-color: ${(props) => props.theme.secondary};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  width: 100%;
  height: 100%;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

function ProfileSidebarLayout({ children }: IChildren) {
  return (
    <Wrapper>
      <Navbar />
      <ContentWrapper>
        <Sidebar items={PROFILE_ITEMS} />
        <Content>{children}</Content>
      </ContentWrapper>
      <Footer />
    </Wrapper>
  );
}

export default ProfileSidebarLayout;
