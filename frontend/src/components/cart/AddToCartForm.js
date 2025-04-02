import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { addItemToCart } from "../../features/cart/cartSlice";
import { toast } from "react-toastify";

// Validation schema
const CartItemSchema = Yup.object().shape({
  size: Yup.string()
    .oneOf(["small", "medium", "large"], "Wybierz prawidłowy rozmiar")
    .required("Rozmiar jest wymagany"),
  quantity: Yup.number()
    .min(1, "Ilość musi wynosić conajmniej 1")
    .max(10, "Max ilość to 10")
    .required("Ilość jest wymagana"),
  specialInstructions: Yup.string().max(
    200,
    "Specjalne życzenia muszą zawierać 200 lub mniej znaków"
  ),
});

const AddToCartForm = ({ pizza }) => {
  const dispatch = useDispatch();
  const [selectedToppings, setSelectedToppings] = useState([]);

  // Calculate price based on size and toppings
  const calculatePrice = (size, toppings) => {
    let basePrice = 0;

    switch (size) {
      case "small":
        basePrice = pizza.price_small;
        break;
      case "medium":
        basePrice = pizza.price_medium;
        break;
      case "large":
        basePrice = pizza.price_large;
        break;
      default:
        basePrice = pizza.price_medium;
    }

    const toppingsPrice = toppings.reduce((sum, topping) => {
      let toppingPrice = 0;

      switch (size) {
        case "small":
          toppingPrice = topping.price_small;
          break;
        case "medium":
          toppingPrice = topping.price_medium;
          break;
        case "large":
          toppingPrice = topping.price_large;
          break;
        default:
          toppingPrice = topping.price_medium;
      }

      return sum + toppingPrice;
    }, 0);

    return basePrice + toppingsPrice;
  };

  const handleToppingToggle = (topping) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    const price = calculatePrice(values.size, selectedToppings);

    const cartItem = {
      id: `${pizza.id}-${Date.now()}`, // Unique ID for the cart item
      pizza,
      size: values.size,
      quantity: values.quantity,
      toppings: selectedToppings,
      specialInstructions: values.specialInstructions || "",
      price,
    };

    dispatch(addItemToCart(cartItem));
    toast.success("Dodano do koszyka!");
    resetForm();
    setSelectedToppings([]);
  };

  return (
    <Formik
      initialValues={{
        size: "medium",
        quantity: 1,
        specialInstructions: "",
      }}
      validationSchema={CartItemSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched }) => (
        <StyledForm>
          <FormSection>
            <SectionTitle>Rozmiar</SectionTitle>
            <SizeOptions role="group">
              <SizeOption>
                <SizeRadio
                  type="radio"
                  name="size"
                  value="small"
                  id="size-small"
                />
                <SizeLabel htmlFor="size-small">
                  <SizeName>Mała</SizeName>
                  <SizePrice>ZŁ{pizza.price_small.toFixed(2)}</SizePrice>
                </SizeLabel>
              </SizeOption>

              <SizeOption>
                <SizeRadio
                  type="radio"
                  name="size"
                  value="medium"
                  id="size-medium"
                />
                <SizeLabel htmlFor="size-medium">
                  <SizeName>Średnia</SizeName>
                  <SizePrice>ZŁ{pizza.price_medium.toFixed(2)}</SizePrice>
                </SizeLabel>
              </SizeOption>

              <SizeOption>
                <SizeRadio
                  type="radio"
                  name="size"
                  value="large"
                  id="size-large"
                />
                <SizeLabel htmlFor="size-large">
                  <SizeName>Duża</SizeName>
                  <SizePrice>ZŁ{pizza.price_large.toFixed(2)}</SizePrice>
                </SizeLabel>
              </SizeOption>
            </SizeOptions>
            {errors.size && touched.size && (
              <ErrorText>{errors.size}</ErrorText>
            )}
          </FormSection>

          <FormSection>
            <SectionTitle>Extra dodatki</SectionTitle>
            <ToppingsGrid>
              {pizza.available_toppings?.map((topping) => (
                <ToppingOption key={topping.id}>
                  <ToppingCheckbox
                    type="checkbox"
                    id={`topping-${topping.id}`}
                    checked={selectedToppings.some((t) => t.id === topping.id)}
                    onChange={() => handleToppingToggle(topping)}
                  />
                  <ToppingLabel htmlFor={`topping-${topping.id}`}>
                    <ToppingName>{topping.name}</ToppingName>
                    <ToppingPrice>
                      +ZŁ{topping[`price_${values.size}`].toFixed(2)}
                    </ToppingPrice>
                  </ToppingLabel>
                </ToppingOption>
              ))}
            </ToppingsGrid>
          </FormSection>

          <FormSection>
            <SectionTitle>Ilość</SectionTitle>
            <QuantityWrapper>
              <QuantityInput type="number" name="quantity" min="1" max="10" />
            </QuantityWrapper>
            {errors.quantity && touched.quantity && (
              <ErrorText>{errors.quantity}</ErrorText>
            )}
          </FormSection>

          <FormSection>
            <SectionTitle>Specjalne życzenia</SectionTitle>
            <SpecialInstructions
              as="textarea"
              name="specialInstructions"
              placeholder="Specjalne życzenia? (Opcjonalne)"
              rows="3"
            />
            {errors.specialInstructions && touched.specialInstructions && (
              <ErrorText>{errors.specialInstructions}</ErrorText>
            )}
          </FormSection>

          <TotalPrice>
            Total: ZŁ{calculatePrice(values.size, selectedToppings).toFixed(2)}
          </TotalPrice>

          <AddToCartButton type="submit">Dodaj do koszyka</AddToCartButton>
        </StyledForm>
      )}
    </Formik>
  );
};

// Styled Components
const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  margin: 0;
  color: #333;
`;

const SizeOptions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const SizeOption = styled.div`
  flex: 1;
`;

const SizeRadio = styled(Field)`
  display: none;

  &:checked + label {
    border-color: #d32f2f;
    background-color: #ffebee;
  }
`;

const SizeLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #d32f2f;
  }
`;

const SizeName = styled.span`
  font-weight: 500;
`;

const SizePrice = styled.span`
  color: #d32f2f;
  font-weight: 600;
  margin-top: 0.25rem;
`;

const ToppingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
`;

const ToppingOption = styled.div`
  display: flex;
  align-items: center;
`;

const ToppingCheckbox = styled.input`
  margin-right: 0.5rem;
`;

const ToppingLabel = styled.label`
  display: flex;
  justify-content: space-between;
  flex: 1;
  cursor: pointer;
`;

const ToppingName = styled.span`
  font-size: 0.9rem;
`;

const ToppingPrice = styled.span`
  color: #d32f2f;
  font-size: 0.9rem;
  font-weight: 500;
`;

const QuantityWrapper = styled.div`
  width: 100px;
`;

const QuantityInput = styled(Field)`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #d32f2f;
  }
`;

const SpecialInstructions = styled(Field)`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #d32f2f;
  }
`;

const TotalPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #d32f2f;
  margin-top: 0.5rem;
`;

const AddToCartButton = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 0.5rem;

  &:hover {
    background-color: #b71c1c;
  }
`;

const ErrorText = styled.div`
  color: #c62828;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

export default AddToCartForm;
