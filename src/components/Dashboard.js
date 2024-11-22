import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Container for the whole component
const Container = styled.div`
  padding: 20px;
  color: var(--text-color);
  background: transparent;

  /* Adjust for medium screens (tablets) */
  @media (max-width: 1350px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on medium screens */
    margin-top: 10%; /* Move the content further down for smaller screens */
  }

  /* Adjust for medium screens (tablets) */
  @media (max-width: 1250px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on medium screens */
    margin-top: 15%; /* Move the content further down for smaller screens */
  }

  /* Adjust for medium screens (tablets) */
  @media (max-width: 1150px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on medium screens */
    margin-top: 20%; /* Move the content further down for smaller screens */
  }

  /* Adjust for medium screens (tablets) */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on medium screens */
    margin-top: 25%; /* Move the content further down for smaller screens */
  }

  /* Adjust for smaller screens (phones) */
  @media (max-width: 800px) {
    grid-template-columns: 1fr; /* Stack charts vertically */
    padding: 10px; /* Reduce padding for smaller screens */
    margin-top: 35%; /* Move the content further down for smaller screens */
  }

  /* Adjust for smaller screens (phones) */
  @media (max-width: 700px) {
    grid-template-columns: 1fr; /* Stack charts vertically */
    padding: 10px; /* Reduce padding for smaller screens */
    margin-top: 40%; /* Move the content further down for smaller screens */
  }
`;

// Header section
const Header = styled.div`
  margin-top: 17%;
`;

// Button styling for connect and disconnect
const Button = styled.button`
  padding: 10px 20px;
  margin: 10px 0;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ variant }) =>
    variant === "connect" ? "#1abc9c" : "#e74c3c"};
  &:hover {
    background: ${({ variant }) =>
      variant === "connect" ? "#16a085" : "#c0392b"};
  }
`;

// Wallet info container with spacing
const WalletInfoDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns for Ethereum and Base */
  gap: 20px;
  margin-top: 20px;
  align-items: start; /* Align items to the top of their grid cells */
`;

const BalanceCard = styled.div`
  background: var(--card-background-color);
  border-radius: 12px;
  box-shadow: 
    0 4px 10px rgba(0, 0, 0, 0.5), 
    inset 4px 4px 8px rgba(0, 0, 0, 0.3), 
    inset -4px -4px 8px rgba(255, 255, 255, 0.2);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Section = styled.div`
  text-align: center;
  margin-bottom: 10px; /* Add spacing between sections */
`;

const ChartContainer = styled.div`
  width: 100%;
  max-width: 300px; /* Ensure consistent chart size */
  margin-top: 10px;
`;

const Label = styled.div`
  font-size: 1.1em;
  color: var(--text-color);
`;

const Value = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: ${(props) => (props.isFiat ? "#2ecc71" : "var(--text-color)")};
`;


const Dashboard = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [ethereumBalance, setEthereumBalance] = useState(null);
  const [baseBalance, setBaseBalance] = useState(null);
  const [ethereumFiatValue, setEthereumFiatValue] = useState(null);
  const [baseFiatValue, setBaseFiatValue] = useState(null);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const connectedAddress = localStorage.getItem("walletAddress");
        if (connectedAddress) {
          setWalletAddress(connectedAddress);
          fetchBalances(connectedAddress);
        }

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length === 0) {
            disconnectWallet();
          } else {
            setWalletAddress(accounts[0]);
            fetchBalances(accounts[0]);
          }
        });
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or a compatible wallet extension!");
      return;
    }

    try {
      const [address] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(address);
      localStorage.setItem("walletAddress", address);
      fetchBalances(address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Connection failed! Please try again.");
    }
  };

  const fetchBalances = async (address) => {
    try {
      const ethProvider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
      const ethWeiBalance = await ethProvider.getBalance(address);
      const ethBalanceFormatted = ethers.formatEther(ethWeiBalance);
      setEthereumBalance(ethBalanceFormatted);

      const baseProvider = new ethers.JsonRpcProvider("https://base.llamarpc.com");
      const baseWeiBalance = await baseProvider.getBalance(address);
      const baseBalanceFormatted = ethers.formatEther(baseWeiBalance);
      setBaseBalance(baseBalanceFormatted);

      fetchFiatValues(ethBalanceFormatted, baseBalanceFormatted);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const fetchFiatValues = async (ethBalance, baseBalance) => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const prices = await response.json();
      const ethPrice = prices.ethereum?.usd || 0;
      setEthereumFiatValue((ethBalance * ethPrice).toFixed(2));
      setBaseFiatValue((baseBalance * ethPrice).toFixed(2));
    } catch (error) {
      console.error("Error fetching fiat values:", error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setEthereumBalance(null);
    setBaseBalance(null);
    setEthereumFiatValue(null);
    setBaseFiatValue(null);
    localStorage.removeItem("walletAddress");
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'var(--text-color)',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'var(--text-color)',
        },
      },
      y: {
        ticks: {
          color: 'var(--text-color)',
        },
      },
    },
  };

  const getChartData = (label, value, color) => ({
    labels: [label],
    datasets: [
      {
        label: 'Fiat Value (USD)',
        data: [value || 0],
        backgroundColor: [color],
      },
    ],
  });

  return (
    <Container>
      <Header>
        <h2>Dashboard</h2>
        {!walletAddress ? (
          <Button variant="connect" onClick={connectWallet}>
            Connect Wallet
          </Button>
        ) : (
          <>
            <p>Wallet Address: {walletAddress}</p>
            <Button variant="disconnect" onClick={disconnectWallet}>
              Disconnect Wallet
            </Button>
          </>
        )}
      </Header>
      {walletAddress && (
        <WalletInfoDiv>
        {/* Ethereum Balance Card */}
        <BalanceCard>
          <h3>Ethereum</h3>
          <Section>
            <Label>Balance</Label>
            <Value>{ethereumBalance || "0.00"} ETH</Value>
          </Section>
          <Section>
            <Label>Fiat Value</Label>
            <Value isFiat>${baseFiatValue || "0.00"}</Value>
          </Section>
          <ChartContainer>
            <Bar
              data={getChartData("Ethereum", ethereumFiatValue, "#2ecc71")}
              options={chartOptions}
            />
          </ChartContainer>
        </BalanceCard>
      
        {/* Base Balance Card */}
        <BalanceCard>
          <h3>Base</h3>
          <Section>
            <Label>Balance</Label>
            <Value>{baseBalance || "0.00"} BASE</Value>
          </Section>
          <Section>
            <Label>Fiat Value</Label>
            <Value isFiat>${baseFiatValue || "0.00"}</Value>
          </Section>
          <ChartContainer>
            <Bar
              data={getChartData("Base", baseFiatValue, "#e74c3c")}
              options={chartOptions}
            />
          </ChartContainer>
        </BalanceCard>

      </WalletInfoDiv>
      
      )}
    </Container>
  );
};

export default Dashboard;