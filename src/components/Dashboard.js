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
  color: white;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
  gap: 15px; /* Reduced gap for charts to be closer together */
  justify-items: center;

  /* Adjust for medium screens (tablets) */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on medium screens */
  }

  /* Adjust for smaller screens (phones) */
  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack charts vertically */
    padding: 10px; /* Reduce padding for smaller screens */
  }
`;

// Chart container with specific size
const ChartContainer = styled.div`
  width: 320px;
  max-width: 100%; /* Ensure it doesn't get too large on small screens */
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
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
`;

// Main dashboard component
const Dashboard = () => {
  const [ethData, setEthData] = useState(null);
  const [baseData, setBaseData] = useState(null);
  const [btcData, setBtcData] = useState(null);

  const fetchData = async (coin) => {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart`,
      {
        params: { vs_currency: "usd", days: "30" },
      }
    );

    return {
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
          color: 'white', // Set legend labels color to white
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
          color: 'white', // Set x-axis labels to white
        },
      },
      y: {
        ticks: {
          color: 'white', // Set y-axis labels to white
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

export default Dashboard;