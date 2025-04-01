import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaLeaf, FaFire } from "react-icons/fa";

const PizzaCard = ({ pizza, selectedSize = "medium" }) => {
  const {
    name,
    slug,
    description,
    price_small,
    price_medium,
    price_large,
    image,
    is_vegetarian,
    is_spicy,
  } = pizza;

  const getPrice = () => {
    switch (selectedSize) {
      case "small":
        return price_small;
      case "large":
        return price_large;
      default:
        return price_medium;
    }
  }

  return (
    <Card to={`/pizza/${slug}`}>
      {image ? (
        <PizzaImage src={image} alt={name} />
      ) : (
        <PlaceholderImage>Brak obrazka</PlaceholderImage>
      )}

      <PizzaInfo>
        <TitleRow>
          <PizzaName>{name}</PizzaName>
          <PizzaIcons>
            {is_vegetarian && (
              <FaLeaf title="Wege" style={{ color: "#4caf50" }} />
            )}
            {is_spicy && <FaFire title="Ostra" style={{ color: "#f44336" }} />}
          </PizzaIcons>
        </TitleRow>

        <PizzaDescription>
          {description.length > 80
            ? `${description.substring(0, 80)}...`
            : description}
        </PizzaDescription>

        <PriceRow>
          <PizzaPrice>ZŁ{getPrice()}</PizzaPrice>
          <OrderButton>Zamów teraz</OrderButton>
        </PriceRow>
      </PizzaInfo>
    </Card>
  );
};

// Styled Components
const Card = styled(Link)`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PizzaImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-weight: 500;
`;

const PizzaInfo = styled.div`
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const PizzaName = styled.h3`
  font-size: 1.25rem;
  margin: 0;
  color: #333;
`;

const PizzaIcons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PizzaDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PizzaPrice = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #d32f2f;
`;

const OrderButton = styled.span`
  background-color: #d32f2f;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b71c1c;
  }
`;

export default PizzaCard;
