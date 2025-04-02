import React from "react";
import styled from "styled-components";
import { FaPizzaSlice, FaClock, FaUsers, FaTruck } from "react-icons/fa";

const AboutPage = () => {
  return (
    <AboutContainer>
      <AboutHeader>
        <h1>Na temat Pitcerni</h1>
        <p>Pyszna pizzunia</p>
      </AboutHeader>

      <AboutSection>
        <h2>Nasza historia</h2>
        <p>
          Założona w 2025 roku, Pitcernia to rodzinna pizzeria z długą tradycją
          i pasją do włoskiej kuchni. Nasze receptury są przekazywane z
          pokolenia na pokolenie, a każda pizza jest pieczona z miłością i
          starannością.
        </p>
        <p>
          Klienci lubia i polecaja, zwlaszcza pizze szefowską, z dodatkiem sosu
          czosnkowego, pomidorków, sera spod napleta i grzyba ze stopy, Warto
          spróbować!
        </p>
      </AboutSection>

      <FeaturesSection>
        <FeatureCard>
          <FeatureIcon>
            <FaPizzaSlice />
          </FeatureIcon>
          <h3>Świeże składniki</h3>
          <p>
            Wszystkie składniki pochodzą z biedry a jak jest taniej to z aro
          </p>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaClock />
          </FeatureIcon>
          <h3>Szybka dostawa</h3>
          <p>Nasi dostawcy się nie pierdolą, zwłaszcza z policjantami</p>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaUsers />
          </FeatureIcon>
          <h3>Miła obsługa</h3>
          <p>
            Pan Tobiasz wkurwia się na wszystkich klientów, ale to tylko pozory
          </p>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaTruck />
          </FeatureIcon>
          <h3>Długie dystanse</h3>
          <p>
            Dostarczamy na większość zadupi, ale nie do ozimka bo to jebana
            dziura
          </p>
        </FeatureCard>
      </FeaturesSection>

      <AboutSection>
        <h2>Nasza filozofia</h2>
        <p>
          Wierzymy, że dobra pizza i piwko to klucz do szczęścia. Dlatego
          staramy się zawsze dostarczać najwyższej jakości jedzenie i obsługę.
        </p>
        <p>
          Jesteśmy oddani naszym klientom i zawsze staramy się spełnić ich
          oczekiwania. Dlatego też, jeśli masz jakieś uwagi lub sugestie,
          spierdalaj.
        </p>
      </AboutSection>

      <TeamSection>
        <h2>Poznaj naszą drużyne</h2>
        <TeamGrid>
          <TeamMember>
            <TeamMemberImage
              src="https://media.discordapp.net/attachments/1357018093091684452/1357018541076910151/8df70a8000149448d014de4be6f4e817.JPEG?ex=67eead80&is=67ed5c00&hm=c89fb82237ac9a23c34a065655bea7f78d9f1d2561d2a81fef9831a84b33b140&=&format=webp&width=408&height=544"
              alt="Franek"
            />
            <h3>Franek</h3>
            <p>założyciel</p>
          </TeamMember>

          <TeamMember>
            <TeamMemberImage
              src="https://media.discordapp.net/attachments/1357018093091684452/1357018541978812558/c11a8f8ec96e5f38ff631741cb7558a9.JPEG?ex=67eead80&is=67ed5c00&hm=d518fd7e158ce4938c6c020b66e8e0a445297d57e3bc6ae98ec8e80b3ea8d6dd&=&format=webp&width=408&height=544"
              alt="Tobiasz"
            />
            <h3>Tobiasz</h3>
            <p>~Bla bla bla, ble ble ble</p>
          </TeamMember>

          <TeamMember>
            <TeamMemberImage
              src="https://media.discordapp.net/attachments/1357018093091684452/1357018540636373142/5e7dc9e2ce895847db270c5b72273e7f.JPEG?ex=67eead80&is=67ed5c00&hm=ae22b8c0b825809ebe7eb5263567a44c91ab9ef631a06bfe80a85620e8bae19d&=&format=webp&width=306&height=544"
              alt="Lukasz"
            />
            <h3>Łukasz</h3>
            <p>~Nie mam prawa jazdy</p>
          </TeamMember>

          <TeamMember>
            <TeamMemberImage
              src="https://media.discordapp.net/attachments/1357018093091684452/1357018541454262322/a6ea7cf8a2011e1dc984bc5607817164.JPEG?ex=67eead80&is=67ed5c00&hm=e69694a4f9712406a44fbc537251345f4c669ddcca011306f89e3c08bd43e242&=&format=webp&width=408&height=544"
              alt="Kevin"
            />
            <h3>Kevin</h3>
            <p>~Z głodu sie jeszcze nikt nie zesroł</p>
          </TeamMember>
        </TeamGrid>
      </TeamSection>
    </AboutContainer>
  );
};

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const AboutHeader = styled.div`
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

const AboutSection = styled.div`
  margin-bottom: 3rem;

  h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 1.5rem;
    position: relative;
    padding-bottom: 0.5rem;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background-color: #ff5a5f;
    }
  }

  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #555;
    margin-bottom: 1.5rem;
  }
`;

const FeaturesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    font-size: 1.3rem;
    margin: 1rem 0;
    color: #333;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: #ff5a5f;
`;

const TeamSection = styled.div`
  margin-bottom: 3rem;

  h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
    position: relative;
    padding-bottom: 0.5rem;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background-color: #ff5a5f;
    }
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const TeamMember = styled.div`
  text-align: center;

  h3 {
    font-size: 1.2rem;
    margin: 1rem 0 0.25rem;
    color: #333;
  }

  p {
    color: #666;
    font-size: 0.9rem;
  }
`;

const TeamMemberImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
`;

export default AboutPage;
