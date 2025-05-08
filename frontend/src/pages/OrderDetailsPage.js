import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchOrderDetails } from "../features/orders/ordersSlice";
import { formatDate } from "../utils/formatters";

const OrderDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentOrder, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/orders/" + id);
      return;
    }
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id, isAuthenticated, navigate]);

  if (loading) return <Loading>Ładowanie szczegółów zamówienia...</Loading>;
  if (error) return <ErrorMessage>Błąd: {error}</ErrorMessage>;
  if (!currentOrder)
    return <ErrorMessage>Nie znaleziono zamówienia.</ErrorMessage>;

  return (
    <PageContainer>
      <h1>Szczegóły zamówienia #{currentOrder.id}</h1>
      <OrderInfo>
        <InfoField>
          <Label>Data:</Label>
          <span>{formatDate(currentOrder.created_at)}</span>
        </InfoField>
        <InfoField>
          <Label>Status:</Label>
          <span>
            {currentOrder.status === "preparing"
              ? "Przetwarzanie"
              : currentOrder.status === "out_for_delivery"
              ? "W dostawie"
              : currentOrder.status === "received"
              ? "Przyjęte"
              : currentOrder.status === "delivered"
              ? "Dostarczone"
              : currentOrder.status === "cancelled"
              ? "Anulowane"
              : currentOrder.status}
          </span>
        </InfoField>
        <InfoField>
          <Label>Adres dostawy:</Label>
          <span>{currentOrder.delivery_address}</span>
        </InfoField>
        <InfoField>
          <Label>Suma:</Label>
          <span>ZŁ{parseFloat(currentOrder.total_amount).toFixed(2)}</span>
        </InfoField>
      </OrderInfo>
      <OrderItems>
        <h2>Pozycje zamówienia</h2>
        {currentOrder.items && currentOrder.items.length > 0 ? (
          currentOrder.items.map((item) => (
            <Item key={item.id}>
              <ItemName>
                {item.pizza_name} ({item.size})
              </ItemName>
              <ItemQuantity>x{item.quantity}</ItemQuantity>
              <ItemPrice>ZŁ{parseFloat(item.total_price).toFixed(2)}</ItemPrice>
            </Item>
          ))
        ) : (
          <p>Brak pozycji w zamówieniu.</p>
        )}
      </OrderItems>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;

  h1 {
    margin-bottom: 2rem;
    color: #333;
  }
`;

const OrderInfo = styled.div`
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const InfoField = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  width: 150px;
  color: #555;
`;

const OrderItems = styled.div`
  h2 {
    margin-bottom: 1rem;
    color: #333;
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
`;

const ItemName = styled.span`
  flex: 1;
`;

const ItemQuantity = styled.span`
  width: 50px;
  text-align: center;
`;

const ItemPrice = styled.span`
  width: 100px;
  text-align: right;
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #555;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #721c24;
  background-color: #f8d7da;
  border-radius: 8px;
`;

export default OrderDetailsPage;
