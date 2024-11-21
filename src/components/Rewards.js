import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const Container = styled.div`
  padding: 20px;
  color: white;
`;

const ConnectButton = styled.button`
  padding: 10px 20px;
  background: #1abc9c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #16a085;
  }
`;

const DisconnectButton = styled.button`
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #c0392b;
  }
`;

const WalletInfoDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
`;

const BalanceCard = styled.div`
  padding: 20px;
  border-radius: 20px;
  background: #f0f0f0;
  box-shadow: 8px 8px 16px #b8b8b8, -8px -8px 16px #ffffff;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  ${(props) =>
    props.isUp
      ? `
    background: #e8f9e8;
    box-shadow: 8px 8px 16px #2b9f2b, -8px -8px 16px #56d56f;
  `
      : props.isDown
      ? `
    background: #f9e8e8;
    box-shadow: 8px 8px 16px #9f2b2b, -8px -8px 16px #d56f56;
  `
      : ""}
`;

const Rewards = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [ethereumBalance, setEthereumBalance] = useState(null);
  const [baseBalance, setBaseBalance] = useState(null);
  const [ethereumFiatValue, setEthereumFiatValue] = useState(null);
  const [baseFiatValue, setBaseFiatValue] = useState(null);
  const [network, setNetwork] = useState(null);
  const [ethereumPrice, setEthereumPrice] = useState(null);
  const [basePrice, setBasePrice] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const connectedAddress = localStorage.getItem("walletAddress");
      if (connectedAddress) {
        reconnectWallet();
      }

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletAddress(accounts[0]);
        }
      });
    }
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

      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      let networkName = "";
      if (chainId === "0x1") {
        networkName = "Ethereum";
      } else if (chainId === "0x2105") {
        networkName = "Base";
      } else {
        networkName = "Unknown";
      }

      setWalletAddress(address);
      setNetwork(networkName);
      localStorage.setItem("walletAddress", address);

      fetchBalances(address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Connection failed! Please try again.");
    }
  };

  const reconnectWallet = async () => {
    try {
      const [address] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      let networkName = "";
      if (chainId === "0x1") {
        networkName = "Ethereum";
      } else if (chainId === "0x2105") {
        networkName = "Base";
      } else {
        networkName = "Unknown";
      }

      setWalletAddress(address);
      setNetwork(networkName);
      fetchBalances(address);
    } catch (error) {
      console.error("Error reconnecting wallet:", error);
    }
  };

  const fetchBalances = async (address) => {
    try {
      // Ethereum Provider
      const ethProvider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
      const ethWeiBalance = await ethProvider.getBalance(address);
      const ethBalanceFormatted = ethers.formatEther(ethWeiBalance);
      setEthereumBalance(ethBalanceFormatted);

      // Base Provider
      const baseProvider = new ethers.JsonRpcProvider("https://base.llamarpc.com");
      const baseWeiBalance = await baseProvider.getBalance(address);
      const baseBalanceFormatted = ethers.formatEther(baseWeiBalance);
      setBaseBalance(baseBalanceFormatted);

      // Fetch fiat values and prices for Ethereum and Base
      fetchFiatValues(ethBalanceFormatted, baseBalanceFormatted);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const fetchFiatValues = async (ethBalance, baseBalance) => {
    try {
      // Fetch ETH price from CoinGecko
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const prices = await response.json();
      const ethPrice = prices.ethereum?.usd || 0;
      setEthereumPrice(ethPrice);

      const ethFiatValue = (ethBalance * ethPrice).toFixed(2);
      setEthereumFiatValue(ethFiatValue);

      // Set the same price for Base as Ethereum for simplicity
      setBasePrice(ethPrice);
      const baseFiatValue = (baseBalance * ethPrice).toFixed(2);
      setBaseFiatValue(baseFiatValue);
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
    setNetwork(null);
    localStorage.removeItem("walletAddress");
  };

  // Create pie chart data
  const getChartData = (balance, fiatValue) => ({
    labels: ['Balance', 'Remaining'],
    datasets: [
      {
        data: [fiatValue, 100 - fiatValue], // Display fiat value vs remaining percentage
        backgroundColor: fiatValue > 0 ? '#2ecc71' : '#e74c3c',
        hoverBackgroundColor: fiatValue > 0 ? '#27ae60' : '#c0392b',
      },
    ],
  });

  return (
    <Container>
      <div>
        <h2>Wallet Info</h2>
        {!walletAddress ? (
          <ConnectButton onClick={connectWallet}>Connect Wallet</ConnectButton>
        ) : (
          <>
            <p>Connected Wallet Address: {walletAddress}</p>
            <DisconnectButton onClick={disconnectWallet}>
              Disconnect Wallet
            </DisconnectButton>
            <WalletInfoDiv>
              <BalanceCard isUp={parseFloat(ethereumFiatValue) > 0}>
                <h3>Ethereum</h3>
                <p>Balance: {ethereumBalance} ETH</p>
                <p>Fiat Value: ${ethereumFiatValue || "0.00"} USD</p>
                <Pie data={getChartData(ethereumBalance, ethereumFiatValue)} />
              </BalanceCard>
              <BalanceCard isUp={parseFloat(baseFiatValue) > 0}>
                <h3>Base</h3>
                <p>Balance: {baseBalance} BASE</p>
                <p>Fiat Value: ${baseFiatValue || "0.00"} USD</p>
                <Pie data={getChartData(baseBalance, baseFiatValue)} />
              </BalanceCard>
            </WalletInfoDiv>
          </>
        )}
      </div>
    </Container>
  );
};

export default Rewards;