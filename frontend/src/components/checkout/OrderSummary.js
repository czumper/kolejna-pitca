import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const SummaryContainer = styled.div`
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 1.5rem;
`;

const SummaryTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: #555;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TotalPrice = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  text-align: right;
  margin-top: 1rem;
  color: #d32f2f;
`;

const OrderSummary = ({ items }) => {
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <SummaryContainer>
      <SummaryTitle>Podsumowanie zamówienia</SummaryTitle>
      <ItemList>
        {items.map((item) => (
          <Item key={item.id}>
            <span>
              {item.name} (x{item.quantity})
            </span>
            <span>{(item.price * item.quantity).toFixed(2)} zł</span>
          </Item>
        ))}
      </ItemList>
      <TotalPrice>Łączna kwota: {totalPrice.toFixed(2)} zł</TotalPrice>
    </SummaryContainer>
  );
};

OrderSummary.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default OrderSummary;