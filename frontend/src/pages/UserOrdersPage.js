import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { fetchUserOrders } from "../features/orders/ordersSlice";
import { formatDate } from "../utils/formatters"; // Poprawny import

const UserOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  const ordersState = useSelector(
    (state) =>
      state.orders || {
        userOrders: { results: [] },
        loading: false,
        error: null,
      }
  );
  const { userOrders, loading, error } = ordersState;
  const ordersList = userOrders?.results || [];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=orders");
      return;
    }
    dispatch(fetchUserOrders());
  }, [dispatch, isAuthenticated, navigate]);

  console.log(
    "UserOrdersPage - ordersState:",
    ordersState,
    "ordersList:",
    ordersList,
    "loading:",
    loading,
    "error:",
    error
  );

  if (loading) return <Loading>Ładowanie twoich zamówień...</Loading>;
  if (error) return <ErrorMessage>Wystąpił błąd: {error}</ErrorMessage>;

  return (
    <PageContainer>
      <h1>Moje zamówienia</h1>

      {ordersList.length === 0 ? (
        <EmptyState>
          <p>Nie dokonałeś jeszcze żadnego zamówienia.</p>
          <Link to="/menu">
            <BrowseButton>Przeglądaj menu</BrowseButton>
          </Link>
        </EmptyState>
      ) : (
        <OrdersList>
          {ordersList.map((order) => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <h3>Zamówienie #{order.id}</h3>
                <OrderStatus status={order.status}>
                  {order.status === "preparing"
                    ? "Przetwarzanie"
                    : order.status === "out_for_delivery"
                    ? "W dostawie"
                    : order.status === "received"
                    ? "Przyjęte"
                    : order.status === "delivered"
                    ? "Dostarczone"
                    : order.status === "cancelled"
                    ? "Anulowane"
                    : order.status}
                </OrderStatus>
              </OrderHeader>
              <OrderDetails>
                <OrderField>
                  <label>Data:</label>
                  <span>
                    {typeof formatDate === "function"
                      ? formatDate(order.created_at)
                      : new Date(order.created_at).toLocaleString("pl-PL")}{" "}
                    {/* Zabezpieczenie */}
                  </span>
                </OrderField>
                <OrderField>
                  <label>Suma:</label>
                  <span>ZŁ{parseFloat(order.total_amount).toFixed(2)}</span>
                </OrderField>
                <OrderField>
                  <label>Adres dostawy:</label>
                  <span>{order.delivery_address}</span>
                </OrderField>
              </OrderDetails>
              <OrderActions>
                <Link to={`/orders/${order.id}`}>
                  <ViewOrderButton>Zobacz szczegóły</ViewOrderButton>
                </Link>
              </OrderActions>
            </OrderCard>
          ))}
        </OrdersList>
      )}
    </PageContainer>
  );
};

// Styling (bez zmian)
const PageContainer = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;

  h1 {
    margin-bottom: 2rem;
    color: #333;
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OrderCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  h3 {
    font-size: 1.2rem;
    margin: 0;
  }
`;

const OrderStatus = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 500;
  text-transform: capitalize;

  ${(props) => {
    switch (props.status) {
      case "delivered":
        return "background-color: #d4edda; color: #155724;";
      case "preparing":
        return "background-color: #fff3cd; color: #856404;";
      case "out_for_delivery":
        return "background-color: #cce5ff; color: #004085;";
      case "cancelled":
        return "background-color: #f8d7da; color: #721c24;";
      case "received":
      default:
        return "background-color: #e2e3e5; color: #383d41;";
    }
  }}
`;

const OrderDetails = styled.div`
  margin-bottom: 1.5rem;
`;

const OrderField = styled.div`
  display: flex;
  margin-bottom: 0.5rem;

  label {
    font-weight: bold;
    width: 150px;
    color: #555;
  }

  span {
    flex: 1;
  }
`;

const OrderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ViewOrderButton = styled.button`
  padding: 0.5rem 1rem;
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

const TrackOrderButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #43a047;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 1.5rem;
  }
`;

const BrowseButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #ff5a5f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;

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

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #721c24;
  background-color: #f8d7da;
  border-radius: 8px;
`;

export default UserOrdersPage;
