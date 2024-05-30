import styled from "styled-components";
import Navbar from "../components/navbar/navbar";
import Sidebar from "../components/sidebar/sidebar";
import { IChildren } from "../interfaces/children-interface";
import Footer from "../components/footer";
import { ADMIN_ITEMS } from "../components/sidebar/sidebar-items";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Content = styled.div`
  background-color: ${(props) => props.theme.secondary};
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

function AdminSidebarLayout({ children }: IChildren) {
  return (
    <Wrapper>
      <Navbar />
      <ContentWrapper>
        <Sidebar items={ADMIN_ITEMS} />
        <Content>{children}</Content>
      </ContentWrapper>
      <Footer />
    </Wrapper>
  );
}

export default AdminSidebarLayout;
