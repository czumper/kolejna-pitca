import React from "react";
import pizzaImage from "../assets/Pitcanf.png"; // Ścieżka do obrazka pizzy – dodaj go do /src/assets/

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Strona nie znaleziona.</h1>
      <img src={pizzaImage} alt="Obracająca się pizza" style={styles.pizza} />
      <p style={styles.text}>
        Wygląda na to, że zabłądziłeś, mordeczko. Wróć na główną albo zamawiaj
        pizzę, bo tu nic nie ma!
      </p>
      <a href="/" style={styles.button}>
        Wróć na główną
      </a>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f8f8f8",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "3rem",
    color: "#ff4444",
    marginBottom: "20px",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  pizza: {
    width: "300px",
    height: "300px",
    animation: "spin 4s linear infinite", // Obrót pizzy
    marginBottom: "30px",
  },
  text: {
    fontSize: "1.5rem",
    color: "#333",
    maxWidth: "600px",
    marginBottom: "20px",
  },
  button: {
    display: "inline-block",
    padding: "15px 30px",
    fontSize: "1.2rem",
    color: "#fff",
    backgroundColor: "#ff4444",
    textDecoration: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#cc3333", // Hover w JS wymaga dodatkowej logiki, więc pomijam albo użyj styled-components
  },
};

// CSS w <style> dla animacji (bo keyframes nie działają w inline styles)
const GlobalStyle = () => (
  <style>
    {`
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 768px) {
        .not-found-title {
          fontSize: '2rem';
        }
        .spinning-pizza {
          width: '200px';
          height: '200px';
        }
        .not-found-text {
          fontSize: '1.2rem';
        }
        .back-home-button {
          padding: '10px 20px';
          fontSize: '1rem';
        }
      }
    `}
  </style>
);

// Komponent z globalnym stylem
const NotFoundWithStyle = () => (
  <>
    <GlobalStyle />
    <NotFoundPage />
  </>
);

export default NotFoundWithStyle;
