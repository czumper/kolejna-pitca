import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPizzaSlice,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterTop>
        <FooterColumn>
          <FooterLogo to="/">
            <FaPizzaSlice />
            <span>Pitcernia</span>
          </FooterLogo>
          <FooterText>
            Doświadcz zajebistej pizzy zrobionej na totalnym wyjebaniu.
            Smacznego!
          </FooterText>
          <SocialIcons>
            <SocialIcon
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </SocialIcon>
            <SocialIcon
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </SocialIcon>
            <SocialIcon
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </SocialIcon>
            <SocialIcon
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </SocialIcon>
          </SocialIcons>
        </FooterColumn>

        <FooterColumn>
          <FooterHeading>Szybkie linki</FooterHeading>
          <FooterLinks>
            <FooterLink to="/">Dom</FooterLink>
            <FooterLink to="/menu">Menu</FooterLink>
            <FooterLink to="/about">O nas</FooterLink>
            <FooterLink to="/contact">Kontakt</FooterLink>
          </FooterLinks>
        </FooterColumn>

        <FooterColumn>
          <FooterHeading>Obsługa klienta</FooterHeading>
          <FooterLinks>
            <FooterLink to="/faq">FAQs</FooterLink>
            <FooterLink to="https://youtu.be/a1nztJ6Nco0?si=CFhmq_A5TztCKh0r">
              Jak powstaje dźwig osobowy?
            </FooterLink>
            <FooterLink to="https://10minutemail.net/?lang=pl">
              Tymczasowy mail
            </FooterLink>
            <FooterLink to="https://chatgpt.com/">Czat GPT</FooterLink>
          </FooterLinks>
        </FooterColumn>

        <FooterColumn>
          <FooterHeading>Skontaktuj się z nami</FooterHeading>
          <ContactInfo>
            <ContactItem>
              <FaMapMarkerAlt />
              <span>69 Chujna, 69-420 Opole</span>
            </ContactItem>
            <ContactItem>
              <FaPhone />
              <span>+48 420 692 137</span>
            </ContactItem>
            <ContactItem>
              <FaEnvelope />
              <span>pitcerniakontakt@gmail.com</span>
            </ContactItem>
          </ContactInfo>
          <OpeningHours>
            <FooterHeading small>Godziny otwarcia</FooterHeading>
            <HoursText>
              Poniedziałek - Piątek: 10:00 - 21:00
              <br />
              Sobota - Niedziela: 10:00 - 23:00
            </HoursText>
          </OpeningHours>
        </FooterColumn>
      </FooterTop>

      <FooterBottom>
        <Copyright>
          &copy; {currentYear} Pitcernia. W prawa mam wyjebane.
        </Copyright>
        <PaymentMethods>
          <span>Metody płatności:</span> Bling bling, Bliczek, Sztynks,
          PowerBank
        </PaymentMethods>
      </FooterBottom>
    </FooterContainer>
  );
};

// Styled Components
const FooterContainer = styled.footer`
  background-color: #222;
  color: #fff;
  padding-top: 3rem;
  margin-top: 3rem;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLogo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  margin-bottom: 1.5rem;

  svg {
    color: #d32f2f;
  }
`;

const FooterText = styled.p`
  color: #bbb;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #333;
  color: #fff;
  border-radius: 50%;
  transition: all 0.3s;

  &:hover {
    background-color: #d32f2f;
    transform: translateY(-3px);
  }
`;

const FooterHeading = styled.h4`
  font-size: ${(props) => (props.small ? "1rem" : "1.2rem")};
  margin: 0 0 1.5rem;
  color: #fff;
  position: relative;

  &::after {
    content: "";
    display: block;
    height: 2px;
    width: 50px;
    background-color: #d32f2f;
    margin-top: 0.5rem;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterLink = styled(Link)`
  color: #bbb;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #d32f2f;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  gap: 0.75rem;
  color: #bbb;

  svg {
    color: #d32f2f;
    flex-shrink: 0;
    margin-top: 3px;
  }
`;

const OpeningHours = styled.div`
  margin-top: 1.5rem;
`;

const HoursText = styled.p`
  color: #bbb;
  line-height: 1.6;
`;

const FooterBottom = styled.div`
  background-color: #1a1a1a;
  padding: 1.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Copyright = styled.div`
  color: #bbb;
  font-size: 0.9rem;
`;

const PaymentMethods = styled.div`
  color: #bbb;
  font-size: 0.9rem;

  span {
    color: #fff;
  }
`;

export default Footer;
