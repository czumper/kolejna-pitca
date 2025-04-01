import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { trackOrder, clearTrackedOrder } from "../features/orders/ordersSlice";
import { FaPizzaSlice, FaBiking, FaCheckCircle } from "react-icons/fa";

// Validation schema for the tracking form
const TrackingSchema = Yup.object().shape({
  orderId: Yup.string()
    .required("ID zamówienia jest wymagane")
    .matches(/^\d+$/, "ID zamówienia musi być liczbą"),
  email: Yup.string()
    .email("Nieprawidłowy adres email")
    .required("Email jest wymagany"),
});

const OrderTrackingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { trackedOrder, loading, error } = useSelector((state) => state.order);
  const [initialValues, setInitialValues] = useState({
    orderId: "",
    email: "",
  });

  // Parse URL parameters for order ID and email if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const email = params.get("email");

    if (id && email) {
      setInitialValues({ orderId: id, email });
      dispatch(trackOrder({ orderId: id, email }));
    }

    // Clear tracked order when leaving the page
    return () => {
      dispatch(clearTrackedOrder());
    };
  }, [dispatch, location.search]);

  const handleSubmit = (values) => {
    dispatch(trackOrder({ orderId: values.orderId, email: values.email }));

    // Update URL with tracking parameters
    navigate(
      `/track-order?id=${values.orderId}&email=${encodeURIComponent(
        values.email
      )}`
    );
  };

  const getStatusStep = (status) => {
    switch (status) {
      case "preparing":
        return 1;
      case "out_for_delivery":
        return 2;
      case "delivered":
        return 3;
      default:
        return 0;
    }
  };

  return (
    <PageContainer>
      <TrackingHeader>Śledź swoje zamówienie</TrackingHeader>

      <TrackingContainer>
        <TrackingFormContainer>
          <TrackingFormTitle>Wprowadź dane zamówienia</TrackingFormTitle>

          <Formik
            initialValues={initialValues}
            validationSchema={TrackingSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <StyledForm>
                <FormGroup>
                  <Label htmlFor="orderId">ID zamówienia</Label>
                  <StyledField
                    type="text"
                    name="orderId"
                    placeholder="Wprowadź ID zamówienia"
                  />
                  <ErrorContainer>
                    <ErrorMessage name="orderId" component="div" />
                  </ErrorContainer>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <StyledField
                    type="email"
                    name="email"
                    placeholder="Wprowadź email użyty przy zamówieniu"
                  />
                  <ErrorContainer>
                    <ErrorMessage name="email" component="div" />
                  </ErrorContainer>
                </FormGroup>

                {error && <ErrorAlert>{error}</ErrorAlert>}

                <TrackButton type="submit" disabled={isSubmitting || loading}>
                  {loading ? "Śledzenie..." : "Track Order"}
                </TrackButton>
              </StyledForm>
            )}
          </Formik>
        </TrackingFormContainer>

        {trackedOrder && (
          <OrderDetailContainer>
            <OrderDetailHeader>
              <h3>Order #{trackedOrder.id}</h3>
              <OrderStatus status={trackedOrder.status}>
                {trackedOrder.status.replace("_", " ")}
              </OrderStatus>
            </OrderDetailHeader>

            <TrackingProgress status={getStatusStep(trackedOrder.status)}>
              <ProgressStep completed={getStatusStep(trackedOrder.status) >= 0}>
                <StepIcon completed={getStatusStep(trackedOrder.status) >= 0}>
                  <FaPizzaSlice />
                </StepIcon>
                <StepLabel>Zamówienie otrzymane</StepLabel>
              </ProgressStep>

              <ProgressLine
                completed={getStatusStep(trackedOrder.status) >= 1}
              />

              <ProgressStep completed={getStatusStep(trackedOrder.status) >= 1}>
                <StepIcon completed={getStatusStep(trackedOrder.status) >= 1}>
                  <FaPizzaSlice />
                </StepIcon>
                <StepLabel>Przygotowywanie</StepLabel>
              </ProgressStep>

              <ProgressLine
                completed={getStatusStep(trackedOrder.status) >= 2}
              />

              <ProgressStep completed={getStatusStep(trackedOrder.status) >= 2}>
                <StepIcon completed={getStatusStep(trackedOrder.status) >= 2}>
                  <FaBiking />
                </StepIcon>
                <StepLabel>W dostawie</StepLabel>
              </ProgressStep>

              <ProgressLine
                completed={getStatusStep(trackedOrder.status) >= 3}
              />

              <ProgressStep completed={getStatusStep(trackedOrder.status) >= 3}>
                <StepIcon completed={getStatusStep(trackedOrder.status) >= 3}>
                  <FaCheckCircle />
                </StepIcon>
                <StepLabel>Dostarczono</StepLabel>
              </ProgressStep>
            </TrackingProgress>

            <OrderInfoSection>
              <OrderInfoTitle>Szczegóły zamówienia</OrderInfoTitle>

              <OrderInfoGrid>
                <OrderInfoItem>
                  <InfoLabel>Imie klienta</InfoLabel>
                  <InfoValue>{trackedOrder.customer_name}</InfoValue>
                </OrderInfoItem>

                <OrderInfoItem>
                  <InfoLabel>Data zamówienia</InfoLabel>
                  <InfoValue>
                    {new Date(trackedOrder.created_at).toLocaleString()}
                  </InfoValue>
                </OrderInfoItem>

                <OrderInfoItem>
                  <InfoLabel>Adres dostawy</InfoLabel>
                  <InfoValue>{trackedOrder.delivery_address}</InfoValue>
                </OrderInfoItem>

                <OrderInfoItem>
                  <InfoLabel>Szacowana dostawa</InfoLabel>
                  <InfoValue>
                    {trackedOrder.estimated_delivery_time
                      ? new Date(
                          trackedOrder.estimated_delivery_time
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Soon"}
                  </InfoValue>
                </OrderInfoItem>

                <OrderInfoItem>
                  <InfoLabel>Suma</InfoLabel>
                  <InfoValue>
                    ${parseFloat(trackedOrder.total_amount).toFixed(2)}
                  </InfoValue>
                </OrderInfoItem>

                <OrderInfoItem>
                  <InfoLabel>Metoda płatności</InfoLabel>
                  <InfoValue>
                    {trackedOrder.payment_method === "cash"
                      ? "Gotówka przy odbiorze"
                      : "Karta (Zapłać przy odbiorze)"}
                  </InfoValue>
                </OrderInfoItem>
              </OrderInfoGrid>
            </OrderInfoSection>

            <OrderItems>
              <OrderInfoTitle>Itemki</OrderInfoTitle>

              {trackedOrder.items.map((item) => (
                <OrderItemCard key={item.id}>
                  {item.pizza_image && (
                    <ItemImage src={item.pizza_image} alt={item.pizza_name} />
                  )}

                  <ItemDetails>
                    <ItemName>{item.pizza_name}</ItemName>
                    <ItemSize>Rozmiar: {item.size}</ItemSize>
                    <ItemQuantity>Quantity: {item.quantity}</ItemQuantity>

                    {item.toppings && item.toppings.length > 0 && (
                      <ItemToppings>
                        Extra dodatki:{" "}
                        {item.toppings.map((t) => t.topping_name).join(", ")}
                      </ItemToppings>
                    )}

                    {item.special_instructions && (
                      <ItemInstructions>
                        Specjalne życzenia: {item.special_instructions}
                      </ItemInstructions>
                    )}
                  </ItemDetails>

                  <ItemPrice>
                    ${parseFloat(item.total_price).toFixed(2)}
                  </ItemPrice>
                </OrderItemCard>
              ))}
            </OrderItems>
          </OrderDetailContainer>
        )}
      </TrackingContainer>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const TrackingHeader = styled.h1`
  margin-bottom: 2rem;
  text-align: center;
`;

const TrackingContainer = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const TrackingFormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  height: fit-content;
`;

const TrackingFormTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  color: #333;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #555;
`;

const StyledField = styled(Field)`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #d32f2f;
  }
`;

const ErrorContainer = styled.div`
  color: #c62828;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  min-height: 1.25rem;
`;

const ErrorAlert = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: -0.5rem;
`;

const TrackButton = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 0.5rem;

  &:hover {
    background-color: #b71c1c;
  }

  &:disabled {
    background-color: #e57373;
    cursor: not-allowed;
  }
`;

const OrderDetailContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const OrderDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
`;

const OrderStatus = styled.div`
  background-color: ${(props) =>
    props.status === "delivered"
      ? "#4caf50"
      : props.status === "out_for_delivery"
      ? "#ff9800"
      : props.status === "preparing"
      ? "#2196f3"
      : "#757575"};
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  text-transform: capitalize;
`;

const TrackingProgress = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    width: 100%;
  }
`;

const StepIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => (props.completed ? "#4caf50" : "#e0e0e0")};
  color: ${(props) => (props.completed ? "white" : "#757575")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    margin-bottom: 0;
    margin-right: 0.75rem;
  }
`;

const StepLabel = styled.div`
  font-size: 0.85rem;
  color: #555;
  text-align: center;

  @media (max-width: 768px) {
    text-align: left;
  }
`;

const ProgressLine = styled.div`
  flex: 1;
  height: 3px;
  background-color: ${(props) => (props.completed ? "#4caf50" : "#e0e0e0")};
  margin: 0 0.5rem;
  z-index: 1;

  @media (max-width: 768px) {
    width: 3px;
    height: 20px;
    margin: 0 0 0 20px;
  }
`;

const OrderInfoSection = styled.div`
  margin-bottom: 2rem;
`;

const OrderInfoTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #333;
`;

const OrderInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OrderInfoItem = styled.div`
  padding: 0.5rem 0;
`;

const InfoLabel = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
`;

const OrderItems = styled.div`
  margin-top: 2rem;
`;

const OrderItemCard = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 60px 1fr;
    grid-template-areas:
      "image details"
      "image price";
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;

  @media (max-width: 768px) {
    grid-area: image;
  }
`;

const ItemDetails = styled.div`
  @media (max-width: 768px) {
    grid-area: details;
  }
`;

const ItemName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ItemSize = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ItemQuantity = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ItemToppings = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
`;

const ItemInstructions = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
  font-style: italic;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: #d32f2f;

  @media (max-width: 768px) {
    grid-area: price;
    justify-self: end;
  }
`;

export default OrderTrackingPage;
