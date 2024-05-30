import styled from "styled-components";
import Center from "../components/center";
import NavbarLayout from "../layouts/navbar-layout";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.background};
  border-radius: 0.5rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function PrivacyPolicy() {
  return (
    <NavbarLayout>
      <Center>
        <Wrapper>
          Privacy Policy for TraveloHI
          <br />
          Effective date: March 4, 2024
          <br />
          At TraveloHI, we value the privacy of our users and are committed to
          protecting it. This Privacy Policy outlines the types of personal
          information we collect, how we use it, and the measures we take to
          safeguard your information.
          <br />
          1. Information We Collect:
          <br />
          - Personal Information: When you use our services or interact with our
          website, we may collect personal information such as your name, email
          address, phone number, and payment information. - Usage Information:
          We automatically collect certain information about your device and how
          you use our services, including your IP address, browser type,
          operating system, and the pages you visit. - Cookies and Tracking
          Technologies: We use cookies and similar tracking technologies to
          enhance your experience and analyze how our services are used.
          <br />
          2. How We Use Your Information:
          <br />
          - To Provide Services: We use your personal information to provide the
          services you request, such as booking flights, hotels, and other
          travel-related services. - To Improve Our Services: We analyze usage
          data to improve our services, develop new features, and personalize
          your experience. - To Communicate with You: We may send you
          promotional emails, newsletters, and other communications about our
          services, special offers, and updates.
          <br />
          3. Data Security:
          <br />
          We employ industry-standard security measures to protect your personal
          information from unauthorized access, disclosure, alteration, or
          destruction.
          <br />
          4. Data Sharing:
          <br />
          We may share your personal information with third-party service
          providers, business partners, or affiliates who assist us in providing
          our services. We may also disclose your information in response to
          legal requirements, enforce our policies, or protect our rights and
          property.
          <br />
          5. Your Choices:
          <br />
          You can choose not to provide certain personal information, although
          it may limit your ability to use certain features of our services. You
          can also opt-out of receiving promotional communications from us.
          <br />
          6. Children's Privacy:
          <br />
          Our services are not intended for children under the age of 13, and we
          do not knowingly collect personal information from children.
          <br />
          7. Changes to This Privacy Policy:
          <br />
          We may update this Privacy Policy from time to time, and any changes
          will be posted on this page. Your continued use of our services
          constitutes acceptance of the revised Privacy Policy.
          <br />
          8. Contact Us:
          <br />
          If you have any questions or concerns about our Privacy Policy or
          practices, please contact us at admin@travelohi.com
          <br />
          By using our services, you consent to the collection and use of your
          information as described in this Privacy Policy.
        </Wrapper>
      </Center>
    </NavbarLayout>
  );
}

export default PrivacyPolicy;
