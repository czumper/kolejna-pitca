import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { FaLeaf, FaFire, FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";
import { fetchPizzaBySlug, fetchToppings } from "../features/menu/menuSlice";
import { addItem } from "../features/cart/cartSlice";

const PizzaDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentPizza, toppings, loading, error } = useSelector(
    (state) => state.menu
  );

  const [size, setSize] = useState("medium");
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    dispatch(fetchPizzaBySlug(slug));
    dispatch(fetchToppings());
  }, [dispatch, slug]);

  if (loading) {
    return <LoadingContainer>Ładowanie szczegółów pizzy...</LoadingContainer>;
  }

  if (error || !currentPizza) {
    return (
      <ErrorContainer>
        <h2>Błąd podczas ładowania szczegółów pizzy</h2>
        <p>{error || "Pizza nie znaleziona"}</p>
        <BackButton onClick={() => navigate("/menu")}>
          <FaArrowLeft /> Powrót do menu
        </BackButton>
      </ErrorContainer>
    );
  }

  const handleSizeChange = (newSize) => {
    setSize(newSize);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleToppingToggle = (topping) => {
    const isSelected = selectedToppings.some((t) => t.id === topping.id);

    if (isSelected) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const getPrice = () => {
    let basePrice = 0;

    switch (size) {
      case "small":
        basePrice = currentPizza.price_small;
        break;
      case "medium":
        basePrice = currentPizza.price_medium;
        break;
      case "large":
        basePrice = currentPizza.price_large;
        break;
      default:
        basePrice = currentPizza.price_medium;
    }

    // Add toppings price
    const toppingsPrice = selectedToppings.reduce((sum, topping) => {
      switch (size) {
        case "small":
          return sum + topping.price_small;
        case "medium":
          return sum + topping.price_medium;
        case "large":
          return sum + topping.price_large;
        default:
          return sum + topping.price_medium;
      }
    }, 0);

    return (basePrice + toppingsPrice) * quantity;
  };

  const handleAddToCart = () => {
    const toppingsWithPrice = selectedToppings.map((topping) => ({
      id: topping.id,
      name: topping.name,
      price:
        size === "small"
          ? topping.price_small
          : size === "medium"
          ? topping.price_medium
          : topping.price_large,
    }));

    dispatch(
      addItem({
        pizza: currentPizza,
        size,
        price:
          size === "small"
            ? currentPizza.price_small
            : size === "medium"
            ? currentPizza.price_medium
            : currentPizza.price_large,
        quantity,
        toppings: toppingsWithPrice,
        specialInstructions,
      })
    );

    navigate("/cart");
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  return (
    <PageContainer>
      <BackButton onClick={() => navigate("/menu")}>
        <FaArrowLeft /> Powrót do Menu
      </BackButton>

      <PizzaContainer>
        <PizzaImageContainer>
          {currentPizza.image ? (
            <img src={currentPizza.image} alt={currentPizza.name} />
          ) : (
            <PlaceholderImage>Brak obrazka</PlaceholderImage>
          )}
        </PizzaImageContainer>

        <PizzaInfoContainer>
          <PizzaName>
            {currentPizza.name}
            <PizzaBadges>
              {currentPizza.is_vegetarian && (
                <VegBadge title="Vegetarian">
                  <FaLeaf />
                </VegBadge>
              )}
              {currentPizza.is_spicy && (
                <SpicyBadge title="Spicy">
                  <FaFire />
                </SpicyBadge>
              )}
            </PizzaBadges>
          </PizzaName>

          <Category>{currentPizza.category?.name}</Category>

          <Description>{currentPizza.description}</Description>

          <IngredientsTitle>Składniki:</IngredientsTitle>
          <IngredientsList>
            {currentPizza.ingredients?.map((ingredient) => (
              <Ingredient key={ingredient.id}>
                {ingredient.name}
                {ingredient.is_vegetarian && (
                  <VegBadge small title="Vegetarian">
                    <FaLeaf />
                  </VegBadge>
                )}
              </Ingredient>
            ))}
          </IngredientsList>

          <OptionsSection>
            <OptionTitle>Wybierz rozmiar:</OptionTitle>
            <SizeOptions>
              <SizeButton
                selected={size === "small"}
                onClick={() => handleSizeChange("small")}
              >
                Small ${formatPrice(currentPizza.price_small)}
              </SizeButton>
              <SizeButton
                selected={size === "medium"}
                onClick={() => handleSizeChange("medium")}
              >
                Medium ${formatPrice(currentPizza.price_medium)}
              </SizeButton>
              <SizeButton
                selected={size === "large"}
                onClick={() => handleSizeChange("large")}
              >
                Large ${formatPrice(currentPizza.price_large)}
              </SizeButton>
            </SizeOptions>

            <QuantityTitle>Quantity:</QuantityTitle>
            <QuantityControl>
              <QuantityButton onClick={() => handleQuantityChange(-1)}>
                <FaMinus />
              </QuantityButton>
              <QuantityValue>{quantity}</QuantityValue>
              <QuantityButton onClick={() => handleQuantityChange(1)}>
                <FaPlus />
              </QuantityButton>
            </QuantityControl>

            <OptionTitle>Dodaj extra dodatki:</OptionTitle>
            <ToppingsList>
              {toppings?.results?.map((topping) => {
                const isSelected = selectedToppings.some(
                  (t) => t.id === topping.id
                );
                const toppingPrice =
                  size === "small"
                    ? topping.price_small
                    : size === "medium"
                    ? topping.price_medium
                    : topping.price_large;

                return (
                  <ToppingItem
                    key={topping.id}
                    selected={isSelected}
                    onClick={() => handleToppingToggle(topping)}
                  >
                    <ToppingName>
                      {topping.name}
                      {topping.is_vegetarian && (
                        <VegBadge small title="Wege">
                          <FaLeaf />
                        </VegBadge>
                      )}
                    </ToppingName>
                    <ToppingPrice>+${formatPrice(toppingPrice)}</ToppingPrice>
                  </ToppingItem>
                );
              })}
            </ToppingsList>

            <OptionTitle>Specjalne życzenia:</OptionTitle>
            <SpecialInstructions
              placeholder="Specjalne życzenia co do twojej pizzy..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </OptionsSection>

          <OrderSection>
            <TotalPrice>Suma: ZŁ{formatPrice(getPrice())}</TotalPrice>
            <AddToCartButton onClick={handleAddToCart}>
              Dodaj do koszyka
            </AddToCartButton>
          </OrderSection>
        </PizzaInfoContainer>
      </PizzaContainer>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem;
  color: #d32f2f;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  transition: color 0.3s;

  &:hover {
    color: #d32f2f;
  }
`;

const PizzaContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PizzaImageContainer = styled.div`
  img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 400px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-weight: 500;
  border-radius: 8px;
`;

const PizzaInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PizzaName = styled.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PizzaBadges = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const VegBadge = styled.span`
  background-color: #4caf50;
  color: white;
  width: ${(props) => (props.small ? "16px" : "24px")};
  height: ${(props) => (props.small ? "16px" : "24px")};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.small ? "0.7rem" : "0.9rem")};
`;

const SpicyBadge = styled.span`
  background-color: #f44336;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
`;

const Category = styled.div`
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1.5rem;
`;

const IngredientsTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
`;

const IngredientsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Ingredient = styled.span`
  background-color: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const OptionsSection = styled.div`
  margin-top: 1rem;
`;

const OptionTitle = styled.h3`
  font-size: 1.1rem;
  margin: 1rem 0 0.5rem 0;
`;

const SizeOptions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const SizeButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background-color: ${(props) => (props.selected ? "#d32f2f" : "white")};
  color: ${(props) => (props.selected ? "white" : "#333")};
  border: 1px solid ${(props) => (props.selected ? "#d32f2f" : "#ddd")};
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #d32f2f;
  }
`;

const QuantityTitle = styled.h3`
  font-size: 1.1rem;
  margin: 1rem 0 0.5rem 0;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
`;

const QuantityButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ddd;
  }
`;

const QuantityValue = styled.span`
  padding: 0 1rem;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ToppingsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.5rem;
`;

const ToppingItem = styled.div`
  background-color: ${(props) => (props.selected ? "#f8e5e5" : "#f9f9f9")};
  border: 1px solid ${(props) => (props.selected ? "#d32f2f" : "#eee")};
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #d32f2f;
  }
`;

const ToppingName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
`;

const ToppingPrice = styled.div`
  font-size: 0.8rem;
  color: #d32f2f;
  margin-top: 0.2rem;
`;

const SpecialInstructions = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #d32f2f;
  }
`;

const OrderSection = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const TotalPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const AddToCartButton = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b71c1c;
  }
`;

export default PizzaDetailPage;
