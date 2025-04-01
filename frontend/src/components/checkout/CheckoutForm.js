import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import apiService from "../../services/api";

// Validation schema for checkout
const CheckoutSchema = Yup.object().shape({
  customer_name: Yup.string()
    .required("Pełne imie i nazwikso jest wymagane")
    .max(100, "Imie i nazwisko musi mieć mniej niż 100 znaków"),
  customer_email: Yup.string()
    .email("Nieprawidłowy adres email")
    .required("Email jest wymagany"),
  customer_phone: Yup.string()
    .required("Numer telefonu jest wymagany")
    .matches(/^\+?[0-9]{10,15}$/, "Nieprawidłowy numer telefonu"),
  delivery_address: Yup.string()
    .required("Adres dostawy jest wymagany")
    .max(500, "Adres jest za długi"),
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
  const navigate = useNavigate();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [loading, setLoading] = useState(false);
  const [formikBag, setFormikBag] = useState(null);

  // Get address string from address object
  const formatAddressString = (address) => {
    return `${address.address_line1}${
      address.address_line2 ? `, ${address.address_line2}` : ""
    }, ${address.city}, ${address.state} ${address.postal_code}`;
  };

  // Fetch user addresses effect
  useEffect(() => {
    if (user) {
      const fetchAddresses = async () => {
        try {
          const response = await apiService.getUserAddresses();
          setAddresses(response.data);

          // Set default address if available
          const defaultAddress = response.data.find((addr) => addr.is_default);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          }
        } catch (error) {
          console.error("Failed to fetch addresses:", error);
        }
      };
      fetchAddresses();
    }
  }, [user]);

  // Update delivery address when selected address changes
  useEffect(() => {
    if (formikBag && formikBag.setFieldValue) {
      if (selectedAddressId !== "new" && addresses.length > 0) {
        const selectedAddress = addresses.find(
          (addr) => addr.id === parseInt(selectedAddressId)
        );
        if (selectedAddress) {
          formikBag.setFieldValue(
            "delivery_address",
            formatAddressString(selectedAddress)
          );
        }
      } else if (selectedAddressId === "new") {
        formikBag.setFieldValue("delivery_address", "");
      }
    }
  }, [selectedAddressId, addresses, formikBag]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);

    // If no items in cart, show error
    if (!cartItems.length) {
      toast.error("Twój koszyk jest pusty");
      setSubmitting(false);
      setLoading(false);
      return;
    }

    try {
      // Format order items from cart
      const orderItems = cartItems.map((item) => ({
        pizza: item.pizza.id,
        size: item.size,
        quantity: item.quantity,
        special_instructions: item.specialInstructions,
        toppings: item.toppings.map((topping) => topping.id),
      }));

      // Prepare order data
      const orderData = {
        ...values,
        items: orderItems,
      };

      // Place order
      const response = await apiService.createOrder(orderData);

      // Clear form
      setSubmitting(false);
      setLoading(false);

      // Notify success and handle order completion
      if (onOrderPlaced) {
        onOrderPlaced(response.data);
      }

      // Navigate to success page
      navigate(`/order-success/${response.data.id}`);
    } catch (error) {
      setSubmitting(false);
      setLoading(false);

      if (error.response && error.response.data) {
        // Show specific error message from API if available
        const errorMsg =
          error.response.data.detail ||
          "Bład składania zamówienia. Spróbuj ponownie.";
        toast.error(errorMsg);
      } else {
        toast.error("Błąd sieci. Sprawdź połączenie i spróbuj ponownie");
      }
    }
  };

  return (
    <Formik
      initialValues={{
        customer_name: user
          ? `${user.first_name} ${user.last_name}`.trim()
          : "",
        customer_email: user?.email || "",
        customer_phone: user?.phone_number || "",
        delivery_address: "",
        delivery_instructions: "",
        payment_method: "cash",
        order_notes: "",
        terms_accepted: false,
      }}
      validationSchema={CheckoutSchema}
      onSubmit={handleSubmit}
    >
      {(formikProps) => {
        // Store formik bag for use in effects
        if (!formikBag) {
          setFormikBag(formikProps);
        }

        return (
          <StyledForm>
            <FormSection>
              <SectionTitle>Informacje kontaktowe</SectionTitle>

              <FormGroup>
                <Label htmlFor="customer_name">Imie i nazwisko*</Label>
                <StyledField
                  type="text"
                  name="customer_name"
                  placeholder="Wprowadź imie i nazwisko"
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
                    placeholder="Wprowadź numer telefonu"
                  />
                  <ErrorContainer>
                    <ErrorMessage name="customer_phone" component="div" />
                  </ErrorContainer>
                </FormGroup>
              </FormRow>
            </FormSection>

            <FormSection>
              <SectionTitle>Informacje dostawy</SectionTitle>

              {user && addresses.length > 0 && (
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
                          {`${addr.address_line1} (${
                            addr.is_default ? "Default" : addr.city
                          })`}
                        </option>
                      ))}
                    </Select>
                  </SelectContainer>
                </AddressSelect>
              )}

              {selectedAddressId === "new" && (
                <FormGroup>
                  <Label htmlFor="delivery_address">Adres dostawy*</Label>
                  <StyledField
                    as="textarea"
                    name="delivery_address"
                    placeholder="Wprowadź pełny adres dostawy"
                    rows="3"
                  />
                  <ErrorContainer>
                    <ErrorMessage name="delivery_address" component="div" />
                  </ErrorContainer>
                </FormGroup>
              )}

              <FormGroup>
                <Label htmlFor="delivery_instructions">
                  Instrukcje dojazdu (Opcjonalne)
                </Label>
                <StyledField
                  as="textarea"
                  name="delivery_instructions"
                  placeholder="Dodaj specjalne instrukcje dojazdu (e.g., kod do klatki, miejsce rozpoznawcze, itd.)"
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
                  placeholder="Add any notes about your order"
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
                Akceptuję <TermsLink to="/terms">Warunki & wymagania</TermsLink>{" "}
                and <TermsLink to="/privacy">Polityka prywatności</TermsLink>
              </TermsLabel>
            </TermsContainer>
            <ErrorContainer>
              <ErrorMessage name="terms_accepted" component="div" />
            </ErrorContainer>

            <PlaceOrderButton
              type="submit"
              disabled={formikProps.isSubmitting || loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </PlaceOrderButton>
          </StyledForm>
        );
      }}
    </Formik>
  );
};

// Styled Components
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

  /* Add dropdown arrow */
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
