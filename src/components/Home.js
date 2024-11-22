import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Container for the entire dashboard
const Container = styled.div`
  padding: 20px;
  color: var(--text-color);
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
  gap: 15px; /* Reduced gap for charts to be closer together */
  justify-items: center;
  margin-top: 16%;

  /* Adjust for medium screens (tablets) */
  @media (max-width: 1350px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on medium screens */
    margin-top: 20%; /* Move the content further down for smaller screens */
  }

  /* Adjust for medium screens (tablets) */
  @media (max-width: 1250px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on medium screens */
    margin-top: 25%; /* Move the content further down for smaller screens */
  }

  /* Adjust for medium screens (tablets) */
  @media (max-width: 1150px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on medium screens */
    margin-top: 30%; /* Move the content further down for smaller screens */
  }

  /* Adjust for medium screens (tablets) */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on medium screens */
    margin-top: 35%; /* Move the content further down for smaller screens */
  }

  /* Adjust for smaller screens (phones) */
  @media (max-width: 800px) {
    grid-template-columns: 1fr; /* Stack charts vertically */
    padding: 10px; /* Reduce padding for smaller screens */
    margin-top: 45%; /* Move the content further down for smaller screens */
  }

  /* Adjust for smaller screens (phones) */
  @media (max-width: 700px) {
    grid-template-columns: 1fr; /* Stack charts vertically */
    padding: 10px; /* Reduce padding for smaller screens */
    margin-top: 50%; /* Move the content further down for smaller screens */
  }
`;

// Chart container with specific size
const ChartContainer = styled.div`
  width: 320px;
  max-width: 100%; /* Ensure it doesn't get too large on small screens */
  background: var(--card-background-color);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 
    0 4px 10px rgba(0, 0, 0, 0.5), /* Raised effect (outer) */
    inset 4px 4px 8px rgba(0, 0, 0, 0.3), /* Sunken effect (inner) */
    inset -4px -4px 8px rgba(255, 255, 255, 0.2); /* Light sunken effect (inner) */
  text-align: center;

  /* Make chart containers responsive */
  @media (max-width: 768px) {
    width: 100%; /* Full width for small screens */
    padding: 15px;
  }
`;

// Title for each chart
const ChartTitle = styled.h3`
  margin-bottom: 15px;
  color: var(--text-color);
`;

// Cache expiry time
const CACHE_EXPIRY_TIME = 60 * 1000; // 1 minute

// Main dashboard component
const Home = () => {
  const [ethData, setEthData] = useState(null);
  const [baseData, setBaseData] = useState(null);
  const [btcData, setBtcData] = useState(null);

  const fetchData = async (coin) => {
    const cacheKey = `${coin}Data`;
    const cachedData = JSON.parse(localStorage.getItem(cacheKey));
    const now = Date.now();

    // Check if cached data exists and is still valid
    if (cachedData && (now - cachedData.timestamp < CACHE_EXPIRY_TIME)) {
      return cachedData.data;
    }

    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart`,
      {
        params: { vs_currency: "usd", days: "30" },
      }
    );

    const formattedData = {
      labels: data.prices.map(([timestamp]) =>
        new Date(timestamp).toLocaleDateString()
      ),
      datasets: [
        {
          label: `${coin.toUpperCase()} Price (USD)`,
          data: data.prices.map(([, price]) => price),
          borderColor: '#a0f72e',
          backgroundColor: 'rgba(160, 247, 46, 0.2)',
          tension: 0.3,
        },
      ],
    };

    // Cache the new data with a timestamp
    localStorage.setItem(cacheKey, JSON.stringify({
      data: formattedData,
      timestamp: now,
    }));

    return formattedData;
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      const eth = await fetchData("ethereum");
      const base = await fetchData("base");
      const btc = await fetchData("bitcoin");
      setEthData(eth);
      setBaseData(base);
      setBtcData(btc);
    };
    fetchDataAsync();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'var(--text-color)', // Use CSS variable for legend labels
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: $${context.raw.toFixed(2)}`, // Format tooltips
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'var(--text-color)', // Use CSS variable for x-axis labels
        },
      },
      y: {
        ticks: {
          color: 'var(--text-color)', // Use CSS variable for y-axis labels
        },
      },
    },
  };

  return (
    <Container>
      <ChartContainer>
        <ChartTitle>Ethereum (ETH)</ChartTitle>
        {ethData ? <Line data={ethData} options={options} /> : <p>Loading...</p>}
      </ChartContainer>
      <ChartContainer>
        <ChartTitle>Base (BASE)</ChartTitle>
        {baseData ? <Line data={baseData} options={options} /> : <p>Loading...</p>}
      </ChartContainer>
      <ChartContainer>
        <ChartTitle>Bitcoin (BTC)</ChartTitle>
        {btcData ? <Line data={btcData} options={options} /> : <p>Loading...</p>}
      </ChartContainer>
    </Container>
  );
};

export default Home;