import React, { useState } from "react";
import styled from "styled-components";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import axios from "axios";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/contact/", formData);

      setSubmitStatus({
        submitted: true,
        success: true,
        message:
          "Dzięki! Twoja wiadomość została wysłana, nie oczekuj odpowiedzi.",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        submitted: true,
        success: false,
        message: "Wystąpił problem podczas wysyłania wiadomości.",
      });
      console.error("Error wysyłania:", error);
    }
  };

  return (
    <ContactContainer>
      <ContactHeader>
        <h1>Spontaktuj się z nami</h1>
        <p>
          Nie odpiszemy ani nie oddzwonimy, najprawdopodobniej nikt tego nie
          przeczyta.
        </p>
      </ContactHeader>

      <ContactContentWrapper>
        <ContactInfoSection>
          <InfoCard>
            <InfoIcon>
              <FaPhone />
            </InfoIcon>
            <h3>Telefon</h3>
            <p>+48 694 202 137</p>
            <p>+48 420 420 420</p>
          </InfoCard>

          <InfoCard>
            <InfoIcon>
              <FaEnvelope />
            </InfoIcon>
            <h3>Email</h3>
            <p>pitcerniakontakt@gmail.com</p>
            <p>pitcerniakontakt@gmail.com</p>
          </InfoCard>

          <InfoCard>
            <InfoIcon>
              <FaMapMarkerAlt />
            </InfoIcon>
            <h3>Lokalizacja</h3>
            <p>69 Chujna</p>
            <p>Opole, 69-420</p>
          </InfoCard>

          <InfoCard>
            <InfoIcon>
              <FaClock />
            </InfoIcon>
            <h3>Godziny</h3>
            <p>Pon-Czw: 11 - 20</p>
            <p>Pt-Nd: 11 - 23</p>
          </InfoCard>
        </ContactInfoSection>

        <ContactFormSection>
          <h2>Wyślij nam wiadomość</h2>

          {submitStatus.submitted && (
            <SubmitMessage success={submitStatus.success}>
              {submitStatus.message}
            </SubmitMessage>
          )}

          <ContactForm onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="name">Imie i nazwisko</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="subject">Tytuł</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="message">Wiadomość</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </FormGroup>

            <SubmitButton type="submit">Wyślij wiadomość</SubmitButton>
          </ContactForm>
        </ContactFormSection>
      </ContactContentWrapper>

      <MapSection>
        <h2>Znajdź nas</h2>
        <iframe
          title="Pitcernia Location"
          width="100%"
          height="450"
          frameBorder="0"
          style={{ border: 0 }}
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d647207.888742081!2d17.173011!3d50.6799327!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471027437efe63d7%3A0x80d2780e377c4cd8!2sBurdel!5e0!3m2!1spl!2spl!4v1743062314716!5m2!1spl!2spl"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </MapSection>
    </ContactContainer>
  );
};

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: #ff5a5f;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: #555;
  }
`;

const ContactContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    font-size: 1.2rem;
    margin: 1rem 0 0.5rem;
    color: #333;
  }

  p {
    color: #666;
    margin: 0.25rem 0;
  }
`;

const InfoIcon = styled.div`
  font-size: 1.8rem;
  color: #ff5a5f;
`;

const ContactFormSection = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 1.5rem;
  }
`;

const SubmitMessage = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: ${(props) => (props.success ? "#d4edda" : "#f8d7da")};
  color: ${(props) => (props.success ? "#155724" : "#721c24")};
  border: 1px solid ${(props) => (props.success ? "#c3e6cb" : "#f5c6cb")};
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }

  input,
  textarea {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #ff5a5f;
      box-shadow: 0 0 0 2px rgba(255, 90, 95, 0.2);
    }
  }
`;

const SubmitButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #ff5a5f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #ff3a3f;
  }
`;

const MapSection = styled.div`
  h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  iframe {
    border-radius: 8px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  }
`;

export default ContactPage;
