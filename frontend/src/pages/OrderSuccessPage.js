import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { FaCheck, FaPizzaSlice, FaArrowRight } from "react-icons/fa";
import { clearCurrentOrder } from "../features/orders/ordersSlice";

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentOrder } = useSelector((state) => state.order);

  // If someone refreshes the page or navigates directly here
  // without an order, redirect to home
  useEffect(() => {
    if (!currentOrder) {
      navigate("/");
    }

    // Clear the current order when leaving this page
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [currentOrder, dispatch, navigate]);

  if (!currentOrder) {
    return null; // Component will redirect from the useEffect
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Soon";

    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <PageContainer>
      <SuccessCard>
        <SuccessIcon>
          <FaCheck />
        </SuccessIcon>

        <h1>Zamówienie złożone!</h1>

        <p>
          Dziękujemy za zamówienie, twoja pizza jest przygotowywana i niedługo
          do ciebie wyruszy.
        </p>

        <OrderInfo>
          <InfoRow>
            <InfoLabel>Numer zamówienia:</InfoLabel>
            <InfoValue>#{orderId}</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Szacowany czas dostawy:</InfoLabel>
            <InfoValue>
              {formatDate(currentOrder.estimated_delivery_time)}
            </InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Adres dostawy:</InfoLabel>
            <InfoValue>{currentOrder.delivery_address}</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Suma:</InfoLabel>
            <InfoValue>
              ${parseFloat(currentOrder.total_amount).toFixed(2)}
            </InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Payment Method:</InfoLabel>
            <InfoValue>
              {currentOrder.payment_method === "cash"
                ? "Gotówka przy odbiorze"
                : "Karta (Zapłać przy odbiorze)"}
            </InfoValue>
          </InfoRow>
        </OrderInfo>

        <OrderStatus>
          <StatusText>
            Obecny status: <StatusValue>{currentOrder.status}</StatusValue>
          </StatusText>
        </OrderStatus>

        <TrackingInfo>
          <TrackingIcon>
            <FaPizzaSlice />
          </TrackingIcon>
          <TrackingText>
            Możesz śledzić swoje zamówienie używając numeru zamówienia i adresu
            email który podałeś.
          </TrackingText>
        </TrackingInfo>

        <ButtonGroup>
          <TrackButton
            to={`/track-order?id=${orderId}&email=${encodeURIComponent(
              currentOrder.customer_email
            )}`}
          >
            Śledź swoje zamówienie <FaArrowRight />
          </TrackButton>

          <HomeButton to="/">Kontynuuj zakupy</HomeButton>
        </ButtonGroup>
      </SuccessCard>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 1rem;
`;

const SuccessCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;

  h1 {
    margin: 1.5rem 0 1rem;
    color: #333;
  }

  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const SuccessIcon = styled.div`
  background-color: #4caf50;
  color: white;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 2.5rem;
`;

const OrderInfo = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: left;
  margin: 2rem 0;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    margin-bottom: 1rem;
  }
`;

const InfoLabel = styled.div`
  font-weight: 600;
  width: 35%;
  padding-right: 1rem;

  @media (max-width: 480px) {
    width: 100%;
    margin-bottom: 0.25rem;
  }
`;

const InfoValue = styled.div`
  flex: 1;
  color: #444;
`;

const OrderStatus = styled.div`
  margin: 2rem 0;
`;

const StatusText = styled.div`
  font-size: 1.1rem;
`;

const StatusValue = styled.span`
  font-weight: 600;
  color: #d32f2f;
  text-transform: capitalize;
`;

const TrackingInfo = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff8e1;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TrackingIcon = styled.div`
  color: #ffa000;
  font-size: 1.5rem;
  margin-right: 1rem;

  @media (max-width: 480px) {
    margin: 0 0 0.75rem 0;
  }
`;

const TrackingText = styled.div`
  color: #5d4037;
  font-size: 0.95rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const TrackButton = styled(Link)`
  background-color: #d32f2f;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b71c1c;
  }
`;

const HomeButton = styled(Link)`
  background-color: white;
  color: #333;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  border: 1px solid #ddd;
  transition: all 0.3s;

  &:hover {
    border-color: #999;
  }
`;

export default OrderSuccessPage;
