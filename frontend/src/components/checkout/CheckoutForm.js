import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { createOrder } from "../../features/orders/ordersSlice";
import {
  fetchUserAddresses,
  createAddress,
} from "../../features/addresses/addressSlice";
import OrderSummary from "./OrderSummary";

// Validation schema for checkout
const CheckoutSchema = Yup.object().shape({
  customer_name: Yup.string()
    .required("Pełne imię i nazwisko jest wymagane")
    .max(100, "Imię i nazwisko musi mieć mniej niż 100 znaków"),
  customer_email: Yup.string()
    .email("Nieprawidłowy adres email")
    .required("Email jest wymagany"),
  customer_phone: Yup.string()
    .required("Numer telefonu jest wymagany")
    .matches(/^\+?\d{9,15}$/, "Numer telefonu musi mieć od 9 do 15 cyfr"),
  address_line1: Yup.string(),
  address_line2: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  postal_code: Yup.string(),
  delivery_instructions: Yup.string().max(
    500,
    "Instrukcje dostawy są za długie"
  ),
  payment_method: Yup.string()
    .required("Metoda płatności jest wymagana")
    .oneOf(["cash", "card"], "Nieprawidłowa metoda płatności"),
  order_notes: Yup.string().max(500, "Zbyt długie notatki"),
  terms_accepted: Yup.boolean().oneOf(
    [true],
    "Musisz zaakceptować warunki i politykę prywatności"
  ),
});

const CheckoutForm = ({ onOrderPlaced }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const {
    addresses,
    loading: addressesLoading,
    error: addressesError,
  } = useSelector((state) => state.addresses);
  const { loading: orderLoading, error: orderError } = useSelector(
    (state) => state.orders
  );

  const [selectedAddressId, setSelectedAddressId] = useState("new");

  useEffect(() => {
    if (user) {
      dispatch(fetchUserAddresses());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id.toString());
      } else {
        setSelectedAddressId(addresses[0].id.toString());
      }
    }
  }, [addresses]);

  const formatAddressString = (address) => {
    return `${address.address_line1}${
      address.address_line2 ? `, ${address.address_line2}` : ""
    }, ${address.city}, ${address.state} ${address.postal_code}`;
  };

  const normalizeSize = (size) => {
    const sizeMap = {
      mała: "small",
      small: "small",
      średnia: "medium",
      medium: "medium",
      duża: "large",
      large: "large",
    };
    return sizeMap[size.toLowerCase()] || "medium";
  };

  const summaryItems = cartItems.map((item) => {
    const normalizedSize = normalizeSize(item.size);
    let price;
    if (normalizedSize === "small") {
      price = item.pizza.price_small;
    } else if (normalizedSize === "medium") {
      price = item.pizza.price_medium;
    } else {
      price = item.pizza.price_large;
    }
    const toppingsPrice = item.toppings.reduce((total, topping) => {
      let toppingPrice;
      if (normalizedSize === "small") {
        toppingPrice = topping.price_small || 0;
      } else if (normalizedSize === "medium") {
        toppingPrice = topping.price_medium || 0;
      } else {
        toppingPrice = topping.price_large || 0;
      }
      return total + toppingPrice;
    }, 0);

    return {
      id: item.pizza.id,
      name: `${item.pizza.name} (${normalizedSize})`,
      price: price + toppingsPrice,
      quantity: item.quantity,
    };
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!cartItems.length) {
      toast.error("Twój koszyk jest pusty");
      setSubmitting(false);
      return;
    }

    if (selectedAddressId === "new") {
      if (!values.address_line1) {
        toast.error("Adres (linia 1) jest wymagany");
        setSubmitting(false);
        return;
      }
      if (!values.city) {
        toast.error("Miasto jest wymagane");
        setSubmitting(false);
        return;
      }
      if (!values.state) {
        toast.error("Województwo jest wymagane");
        setSubmitting(false);
        return;
      }
      if (!values.postal_code || !/^\d{2}-\d{3}$/.test(values.postal_code)) {
        toast.error("Kod pocztowy musi być w formacie XX-XXX");
        setSubmitting(false);
        return;
      }
    }

    try {
      const orderItems = cartItems.map((item) => ({
        pizza: item.pizza.id,
        size: normalizeSize(item.size),
        quantity: item.quantity,
        special_instructions: item.specialInstructions || "",
        toppings: item.toppings.map((topping) => topping.id),
      }));

      let deliveryAddressString;

      if (selectedAddressId !== "new") {
        const selectedAddress = addresses.find(
          (addr) => addr.id === parseInt(selectedAddressId)
        );
        if (!selectedAddress) {
          throw new Error("Wybrany adres nie istnieje");
        }
        deliveryAddressString = formatAddressString(selectedAddress);
      } else {
        const newAddressData = {
          address_line1: values.address_line1,
          address_line2: values.address_line2 || "",
          city: values.city,
          state: values.state,
          postal_code: values.postal_code,
          is_default: addresses.length === 0,
        };
        console.log(
          "Tworzenie nowego adresu:",
          JSON.stringify(newAddressData, null, 2)
        );
        const response = await dispatch(createAddress(newAddressData)).unwrap();
        console.log("Adres utworzony:", JSON.stringify(response, null, 2));
        deliveryAddressString = formatAddressString(response);
      }

      const orderData = {
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_phone: values.customer_phone,
        delivery_address: deliveryAddressString,
        delivery_instructions: values.delivery_instructions || "",
        payment_method: values.payment_method,
        order_notes: values.order_notes || "",
        items: orderItems,
      };

      console.log(
        "Dane zamówienia przed wysłaniem:",
        JSON.stringify(orderData, null, 2)
      );
      const response = await dispatch(createOrder(orderData)).unwrap();
      console.log("Zamówienie utworzone:", JSON.stringify(response, null, 2));

      if (onOrderPlaced) {
        onOrderPlaced(response);
      }

      navigate(`/order-success/${response.id}`);
    } catch (error) {
      console.error("Błąd przy składaniu zamówienia:", error);
      toast.error(
        "Błąd przy składaniu zamówienia: " +
          (error.message || "Spróbuj ponownie")
      );
      setSubmitting(false);
    }
  };

  return (
    <>
      <OrderSummary items={summaryItems} />
      <Formik
        initialValues={{
          customer_name: user
            ? `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
              "Gość"
            : "Gość",
          customer_email: user?.email || "",
          customer_phone: user?.phone_number || "",
          address_line1: "",
          address_line2: "",
          city: "",
          state: "",
          postal_code: "",
          delivery_instructions: "",
          payment_method: "cash",
          order_notes: "",
          terms_accepted: false,
        }}
        validationSchema={CheckoutSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <StyledForm>
            <FormSection>
              <SectionTitle>Informacje kontaktowe</SectionTitle>
              <FormGroup>
                <Label htmlFor="customer_name">Imię i nazwisko*</Label>
                <StyledField
                  type="text"
                  name="customer_name"
                  placeholder="Wprowadź imię i nazwisko"
                />
                <ErrorContainer>
                  <ErrorMessage name="customer_name" component="div" />
                </ErrorContainer>
              </FormGroup>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="customer_email">Email*</Label>
                  <StyledField
                    type="email"
                    name="customer_email"
                    placeholder="Wprowadź swój email"
                  />
                  <ErrorContainer>
                    <ErrorMessage name="customer_email" component="div" />
                  </ErrorContainer>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="customer_phone">Telefon*</Label>
                  <StyledField
                    type="tel"
                    name="customer_phone"
                    placeholder="Np. +48123456789"
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9+]/g, "");
                      if (!value.startsWith("+")) value = "+" + value;
                      setFieldValue("customer_phone", value);
                    }}
                  />
                  <ErrorContainer>
                    <ErrorMessage name="customer_phone" component="div" />
                  </ErrorContainer>
                </FormGroup>
              </FormRow>
            </FormSection>
            <FormSection>
              <SectionTitle>Informacje dostawy</SectionTitle>
              {addresses.length > 0 && (
                <AddressSelect>
                  <Label>Wybierz adres</Label>
                  <SelectContainer>
                    <Select
                      value={selectedAddressId}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                    >
                      <option value="new">Dodaj nowy adres</option>
                      {addresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {`${addr.address_line1}, ${addr.city}, ${
                            addr.postal_code
                          } ${addr.is_default ? "(Domyślny)" : ""}`}
                        </option>
                      ))}
                    </Select>
                  </SelectContainer>
                </AddressSelect>
              )}
              {selectedAddressId === "new" && (
                <>
                  <FormGroup>
                    <Label htmlFor="address_line1">Adres (linia 1)*</Label>
                    <StyledField
                      type="text"
                      name="address_line1"
                      placeholder="Ulica i numer"
                    />
                    <ErrorContainer>
                      <ErrorMessage name="address_line1" component="div" />
                    </ErrorContainer>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="address_line2">Adres (linia 2)</Label>
                    <StyledField
                      type="text"
                      name="address_line2"
                      placeholder="Mieszkanie, budynek (opcjonalne)"
                    />
                    <ErrorContainer>
                      <ErrorMessage name="address_line2" component="div" />
                    </ErrorContainer>
                  </FormGroup>
                  <FormRow>
                    <FormGroup>
                      <Label htmlFor="city">Miasto*</Label>
                      <StyledField
                        type="text"
                        name="city"
                        placeholder="Miasto"
                      />
                      <ErrorContainer>
                        <ErrorMessage name="city" component="div" />
                      </ErrorContainer>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="state">Województwo*</Label>
                      <StyledField
                        type="text"
                        name="state"
                        placeholder="Województwo"
                      />
                      <ErrorContainer>
                        <ErrorMessage name="state" component="div" />
                      </ErrorContainer>
                    </FormGroup>
                  </FormRow>
                  <FormGroup>
                    <Label htmlFor="postal_code">Kod pocztowy*</Label>
                    <StyledField
                      type="text"
                      name="postal_code"
                      placeholder="XX-XXX"
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9]/g, "");
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + "-" + value.slice(2, 5);
                        }
                        setFieldValue("postal_code", value);
                      }}
                    />
                    <ErrorContainer>
                      <ErrorMessage name="postal_code" component="div" />
                    </ErrorContainer>
                  </FormGroup>
                </>
              )}
              <FormGroup>
                <Label htmlFor="delivery_instructions">
                  Instrukcje dojazdu (Opcjonalne)
                </Label>
                <StyledField
                  as="textarea"
                  name="delivery_instructions"
                  placeholder="Dodaj specjalne instrukcje dojazdu"
                  rows="2"
                />
                <ErrorContainer>
                  <ErrorMessage name="delivery_instructions" component="div" />
                </ErrorContainer>
              </FormGroup>
            </FormSection>
            <FormSection>
              <SectionTitle>Szczegóły płatności</SectionTitle>
              <PaymentOptions role="group">
                <PaymentOption>
                  <PaymentRadio
                    type="radio"
                    name="payment_method"
                    id="payment-cash"
                    value="cash"
                  />
                  <PaymentLabel htmlFor="payment-cash">
                    <PaymentTitle>Gotówka przy odbiorze</PaymentTitle>
                    <PaymentDescription>
                      Zapłać gotówką przy odbiorze
                    </PaymentDescription>
                  </PaymentLabel>
                </PaymentOption>
                <PaymentOption>
                  <PaymentRadio
                    type="radio"
                    name="payment_method"
                    id="payment-card"
                    value="card"
                  />
                  <PaymentLabel htmlFor="payment-card">
                    <PaymentTitle>Karta (Zapłać przy odbiorze)</PaymentTitle>
                    <PaymentDescription>
                      Zapłać kartą przy odbiorze
                    </PaymentDescription>
                  </PaymentLabel>
                </PaymentOption>
              </PaymentOptions>
              <ErrorContainer>
                <ErrorMessage name="payment_method" component="div" />
              </ErrorContainer>
              <FormGroup>
                <Label htmlFor="order_notes">Notatki (Opcjonalne)</Label>
                <StyledField
                  as="textarea"
                  name="order_notes"
                  placeholder="Dodaj notatki do zamówienia"
                  rows="2"
                />
                <ErrorContainer>
                  <ErrorMessage name="order_notes" component="div" />
                </ErrorContainer>
              </FormGroup>
            </FormSection>
            <TermsContainer>
              <CheckboxField
                type="checkbox"
                name="terms_accepted"
                id="terms_accepted"
              />
              <TermsLabel htmlFor="terms_accepted">
                Akceptuję <TermsLink to="/terms">Warunki</TermsLink> i{" "}
                <TermsLink to="/privacy">Politykę prywatności</TermsLink>
              </TermsLabel>
            </TermsContainer>
            <ErrorContainer>
              <ErrorMessage name="terms_accepted" component="div" />
            </ErrorContainer>
            {orderError && <ErrorContainer>{orderError}</ErrorContainer>}
            <PlaceOrderButton
              type="submit"
              disabled={isSubmitting || orderLoading}
            >
              {orderLoading ? "Przetwarzanie..." : "Złóż zamówienie"}
            </PlaceOrderButton>
          </StyledForm>
        )}
      </Formik>
    </>
  );
};

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  color: #333;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #555;
`;

const StyledField = styled(Field)`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
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

const AddressSelect = styled.div`
  margin-bottom: 1rem;
`;

const SelectContainer = styled.div`
  position: relative;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  appearance: none;
  &:focus {
    outline: none;
    border-color: #d32f2f;
  }
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const PaymentOption = styled.div`
  display: flex;
`;

const PaymentRadio = styled(Field)`
  margin-right: 0.75rem;
  margin-top: 0.25rem;
`;

const PaymentLabel = styled.label`
  cursor: pointer;
`;

const PaymentTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const PaymentDescription = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const TermsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 1rem;
`;

const CheckboxField = styled(Field)`
  margin-right: 0.75rem;
  margin-top: 0.25rem;
`;

const TermsLabel = styled.label`
  font-size: 0.95rem;
  color: #555;
  cursor: pointer;
`;

const TermsLink = styled(Link)`
  color: #d32f2f;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const PlaceOrderButton = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
  &:hover {
    background-color: #b71c1c;
  }
  &:disabled {
    background-color: #e57373;
    cursor: not-allowed;
  }
`;

export default CheckoutForm;
