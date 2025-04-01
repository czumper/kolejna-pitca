import React from "react"; // Remove useState from the import
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import { clearCart } from "../features/cart/cartSlice";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // This is a best practice to redirect non-authenticated users
  // or users with empty carts away from the checkout page
  if (!isAuthenticated) {
    navigate("/login?redirect=checkout");
    return null;
  }

  if (!cartItems.length) {
    toast.error("Your cart is empty");
    navigate("/menu");
    return null;
  }

  const handleOrderPlaced = (order) => {
    // Clear the cart after successful order
    dispatch(clearCart());
  };

  return (
    <PageContainer>
      <CheckoutTitle>Zamówienie</CheckoutTitle>
      <CheckoutLayout>
        <FormSection>
          <CheckoutForm onOrderPlaced={handleOrderPlaced} />
        </FormSection>
        <SummarySection>
          <OrderSummary items={cartItems} />
        </SummarySection>
      </CheckoutLayout>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const CheckoutTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
`;

const CheckoutLayout = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 3rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  order: 1;
`;

const SummarySection = styled.div`
  order: 2;

  @media (max-width: 992px) {
    order: 0;
    margin-bottom: 2rem;
  }
`;

export default CheckoutPage;
