import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchFeaturedPizzas } from "../features/menu/menuSlice";
import PizzaCard from "../components/menu/PizzaCard";

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredPizzas, loading } = useSelector((state) => state.menu);

  useEffect(() => {
    dispatch(fetchFeaturedPizzas());
  }, [dispatch]);

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <h1>Świeża, zajebista piccerka kolo</h1>
          <p>Robiona na szybko byle była</p>
          <HeroButton to="/menu">Zamów Teraz</HeroButton>
        </HeroContent>
      </HeroSection>

      <SectionContainer>
        <SectionTitle>Nasze Pitce</SectionTitle>

        {loading ? (
          <LoadingText>Ładowanie naszych piccek...</LoadingText>
        ) : (
          <PizzasGrid>
            {featuredPizzas.results?.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </PizzasGrid>
        )}

        <ViewAllButton to="/menu">Wszystkie Pitce</ViewAllButton>
      </SectionContainer>

      <FeatureSection>
        <FeatureCard>
          <h3>Świeże składniki</h3>
          <p>Używamy tylko wysokiej jakości i świeże składniki do naszej pizzy</p>
        </FeatureCard>

        <FeatureCard>
          <h3>Szybka dostawa</h3>
          <p>Dostawa zanim pizza wystygdnie, nasi kierwocy mają szybkie wozy</p>
        </FeatureCard>

        <FeatureCard>
          <h3>Oferty specjalne</h3>
          <p>Mamy specjalne oferty dla stałych klientów np. sos szefowski ;)</p>
        </FeatureCard>
      </FeatureSection>
    </HomeContainer>
  );
};

// Styled Components
const HomeContainer = styled.div`
  width: 100%;
`;

const HeroSection = styled.section`
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("/images/ppp.jpg");
  background-size: cover;
  background-position: center;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 0 2rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;

const HeroButton = styled(Link)`
  display: inline-block;
  background-color: #d32f2f;
  color: white;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b71c1c;
  }
`;

const SectionContainer = styled.section`
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin: 2rem 0;
`;

const PizzasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ViewAllButton = styled(Link)`
  display: block;
  width: fit-content;
  margin: 0 auto;
  background-color: transparent;
  color: #d32f2f;
  border: 2px solid #d32f2f;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    background-color: #d32f2f;
    color: white;
  }
`;

const FeatureSection = styled.section`
  background-color: #f8f9fa;
  padding: 3rem 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto 3rem;
`;


const FeatureCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #d32f2f;
  }

  p {
    color: #666;
    line-height: 1.5;
  }
`;

export default HomePage;
