import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { FaTrash, FaPlus, FaMinus, FaArrowLeft } from "react-icons/fa";
import {
  updateQuantity,
  removeItem,
  clearCart,
} from "../features/cart/cartSlice";

const CartPage = () => {
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (id, change) => {
    const item = items.find((item) => item.id === id);

    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItem({ id }));
  };

  const handleClearCart = () => {
    if (window.confirm("Na pewno chcesz wyczyścić koszyk?")) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  if (items.length === 0) {
    return (
      <PageContainer>
        <h1>Twój koszyk</h1>
        <EmptyCartMessage>
          <p>Twój koszyk jest pusty.</p>
          <Link to="/menu">
            <ContinueShoppingButton>
              <FaArrowLeft /> kontynuuj kupowanie
            </ContinueShoppingButton>
          </Link>
        </EmptyCartMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1>Your Cart</h1>

      <CartGrid>
        <CartItems>
          {items.map((item) => (
            <CartItem key={item.id}>
              <ItemImage>
                {item.pizza.image ? (
                  <img src={item.pizza.image} alt={item.pizza.name} />
                ) : (
                  <div className="placeholder">No Image</div>
                )}
              </ItemImage>

              <ItemInfo>
                <ItemName>
                  {item.pizza.name} ({item.size})
                </ItemName>
                <ItemPrice>ZŁ{formatPrice(item.price)}</ItemPrice>

                {item.toppings && item.toppings.length > 0 && (
                  <ToppingsList>
                    <strong>Dodatki extra:</strong>
                    {item.toppings.map((topping, index) => (
                      <span key={topping.id}>
                        {topping.name} (+ZŁ{formatPrice(topping.price)})
                        {index < item.toppings.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </ToppingsList>
                )}

                {item.specialInstructions && (
                  <SpecialInstructions>
                    <strong>Specjalne instrukcje:</strong>{" "}
                    {item.specialInstructions}
                  </SpecialInstructions>
                )}
              </ItemInfo>

              <ItemQuantity>
                <QuantityButton
                  onClick={() => handleQuantityChange(item.id, -1)}
                >
                  <FaMinus />
                </QuantityButton>
                <QuantityValue>{item.quantity}</QuantityValue>
                <QuantityButton
                  onClick={() => handleQuantityChange(item.id, 1)}
                >
                  <FaPlus />
                </QuantityButton>
              </ItemQuantity>

              <ItemTotal>
                ZŁ
                {formatPrice(
                  item.price * item.quantity +
                    item.toppings.reduce(
                      (sum, t) => sum + t.price * item.quantity,
                      0
                    )
                )}
              </ItemTotal>

              <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                <FaTrash />
              </RemoveButton>
            </CartItem>
          ))}

          <CartActions>
            <ClearButton onClick={handleClearCart}>Wyczyść koszyk</ClearButton>
            <ContinueShopping to="/menu">
              <FaArrowLeft /> Kontynuuj kupowanie
            </ContinueShopping>
          </CartActions>
        </CartItems>

        <OrderSummary>
          <SummaryTitle>Podsumowanie</SummaryTitle>

          <SummaryRow>
            <span>Subtotal</span>
            <span>ZŁ{formatPrice(total)}</span>
          </SummaryRow>

          <SummaryRow>
            <span>Opłata za dostawe</span>
            <span>10zł</span>
          </SummaryRow>

          <SummaryRow>
            <span>Podatek (23%)</span>
            <span>ZŁ{formatPrice(total * 0.23)}</span>
          </SummaryRow>

          <TotalRow>
            <span>Suma</span>
            <span>ZŁ{formatPrice(total + 10 + total * 0.23)}</span>
          </TotalRow>

          <CheckoutButton onClick={handleCheckout}>
            Kontynuuj do zamówienia
          </CheckoutButton>
        </OrderSummary>
      </CartGrid>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;

  h1 {
    margin-bottom: 2rem;
  }
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 8px;

  p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 1.5rem;
  }
`;

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    grid-template-areas:
      "image info"
      "image quantity"
      "total total"
      "remove remove";
    gap: 0.5rem;
  }
`;

const ItemImage = styled.div`
  width: 100%;
  height: 80px;
  overflow: hidden;
  border-radius: 4px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    color: #999;
  }

  @media (max-width: 768px) {
    grid-area: image;
  }
`;

const ItemInfo = styled.div`
  @media (max-width: 768px) {
    grid-area: info;
  }
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ItemPrice = styled.div`
  color: #d32f2f;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const ToppingsList = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const SpecialInstructions = styled.div`
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
`;

const ItemQuantity = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    grid-area: quantity;
  }
`;

const QuantityButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  font-size: 0.7rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ddd;
  }
`;

const QuantityValue = styled.span`
  padding: 0 0.5rem;
  font-weight: 500;
`;

const ItemTotal = styled.div`
  font-weight: 600;

  @media (max-width: 768px) {
    grid-area: total;
    justify-self: end;
    margin-top: 0.5rem;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #d32f2f;
  }

  @media (max-width: 768px) {
    grid-area: remove;
    justify-self: end;
    margin-top: 0.5rem;
  }
`;

const CartActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #d32f2f;
    color: #d32f2f;
  }
`;

const ContinueShopping = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #666;
  transition: color 0.3s;

  &:hover {
    color: #d32f2f;
  }
`;

const ContinueShoppingButton = styled.button`
  background: #d32f2f;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b71c1c;
  }
`;

const OrderSummary = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0;
  font-weight: 600;
  font-size: 1.2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const CheckoutButton = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 0.75rem 0;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b71c1c;
  }
`;

export default CartPage;
