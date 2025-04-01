import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get("/api/faqs/");
        setFaqs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        // Fallback to static data if API call fails
        setFaqs([
          {
            id: 1,
            question: "Jak długo zajmuje dostawa?",
            answer:
              "Zależy jak daleko mieszkasz, ale nawet do szczedrzyka dowozimy w maks 20 minut, nasi kierowcy zapierdalają.",
          },
          {
            id: 2,
            question: "Czy macie wegańskie potrawy?",
            answer: "Ta mamy, ale raczej nie chcesz tego jeść.",
          },
          {
            id: 3,
            question: "Jakie metody płatności obsługujecie?",
            answer: "Bling bling, hajs, sztynks, bliczek i karta.",
          },
          {
            id: 4,
            question: "Czy jest minimalna wartość zamówienia?",
            answer: "Tak, minimum 30zł. Jak cie nie stać to spierdalaj.",
          },
          {
            id: 5,
            question: "Czy mogę wyznaczyć zamówienie na późniejszą godzinę?",
            answer:
              "Tak, nawet do 7 dni do przodu, nie gwarantujemy, że nie zapomnimy.",
          },
          {
            id: 6,
            question: "Czy dowozicie do wszystkich dzielnic w mieście?",
            answer: "Ogólnie tak, ale na zwm czasem nam sie nie chce.",
          },
          {
            id: 7,
            question: "Jak mogę dołączyć do waszego programu lojalnościowego?",
            answer: "Jak będzie to bedziesz tam automatycznie.",
          },
          {
            id: 8,
            question: "Co jeżeli wystąpi problem z moim zamówieniem?",
            answer: "Nic, na szczęście wszyscy mają to w piździe.",
          },
        ]);
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) {
    return <Loading>Loading FAQs...</Loading>;
  }

  return (
    <FaqContainer>
      <FaqHeader>
        <h1>Często zadawane pytania</h1>
        <p>Znajdź odpowiedzi na często zadawane pytania na temat Pitcerni.</p>
      </FaqHeader>

      <FaqList>
        {faqs.map((faq, index) => (
          <FaqItem key={faq.id} isActive={activeIndex === index}>
            <FaqQuestion onClick={() => toggleFaq(index)}>
              {faq.question}
              {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </FaqQuestion>
            {activeIndex === index && <FaqAnswer>{faq.answer}</FaqAnswer>}
          </FaqItem>
        ))}
      </FaqList>

      <ContactSection>
        <h2>Nadal masz pytania?</h2>
        <p>Jeżeli nie znalazłeś odpowiedzi na swoje pytanie, spierdalaj!</p>
        <ContactButton to="/contact">Skontaktuj się z nami</ContactButton>
      </ContactSection>
    </FaqContainer>
  );
};

const FaqContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const FaqHeader = styled.div`
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

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const FaqItem = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid
    ${(props) => (props.isActive ? "#ff5a5f" : "transparent")};
`;

const FaqQuestion = styled.div`
  padding: 1rem 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: ${(props) => (props.isActive ? "#ff5a5f" : "#333")};

  &:hover {
    background-color: #f9f9f9;
  }
`;

const FaqAnswer = styled.div`
  padding: 1rem 1.5rem;
  background-color: #f9f9f9;
  color: #555;
  line-height: 1.6;
`;

const ContactSection = styled.div`
  text-align: center;
  margin-top: 3rem;

  h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    color: #555;
    margin-bottom: 1.5rem;
  }
`;

const ContactButton = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #ff5a5f;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    background-color: #ff3a3f;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #555;
`;

export default FaqPage;
