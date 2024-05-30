import List from "./footer/list";
import ListItem from "./footer/list-item";
import Logo from "./footer/logo";
import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import Horizontal from "./form/horizontal";
import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa6";
import Badge from "./footer/badge";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.background};
  border-top: 0.1rem solid ${(props) => props.theme.footer};
  border-bottom: 0.1rem solid ${(props) => props.theme.footer};
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 2rem;
`;

function Footer() {
  const { currentTheme } = useTheme();
  const [imgPath, setImgPath] = useState<string>("/travelohi-blue.png");

  useEffect(() => {
    if (currentTheme == "dark") {
      setImgPath("/travelohi-white.png");
    } else {
      setImgPath("/travelohi-blue.png");
    }
  }, [currentTheme]);

  return (
    <Wrapper>
      <Logo>
        <img src={imgPath} alt="" />
      </Logo>
      <List>
        <h2>About TraveloHI</h2>
        <ListItem>
          <Link to="/about-page">About</Link>
        </ListItem>
        <ListItem>
          <Link to="/contact-us">Contact Us</Link>
        </ListItem>
        <ListItem>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </ListItem>
      </List>
      <List>
        <h2>Product</h2>
        <ListItem>
          <Link to="/hotels">Hotels</Link>
        </ListItem>
        <ListItem>
          <Link to="/flights">Flights</Link>
        </ListItem>
      </List>
      <List>
        <ListItem>
          <Horizontal>
            <Badge href="https://www.instagram.com/traveloka.id/">
              <FaInstagram />
            </Badge>
            <Badge href="https://www.facebook.com/Traveloka.id">
              <FaFacebook />
            </Badge>
            <Badge href="https://twitter.com/Traveloka">
              <FaTwitter />
            </Badge>
          </Horizontal>
        </ListItem>
        <ListItem>
          <Horizontal>
            <Badge href="https://app.adjust.com/ie88tj">
              <img src="/download_google_play.png" alt="" />
            </Badge>
            <Badge href="https://app.adjust.com/hc9if0">
              <img src="/download_app_store.png" alt="" />
            </Badge>
          </Horizontal>
        </ListItem>
      </List>
    </Wrapper>
  );
}

export default Footer;
