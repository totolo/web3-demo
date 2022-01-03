import Head from 'next/head'
import { useState } from 'react';
import Web3 from "web3";

export default function Home() {
  const [metaMaskConnected, setMetaMaskConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [showCurrentBalance, setShowCurrentBalance] = useState(false);

  let web3 = new Web3();
  const ethEnabled = async () => {
    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
      web3 = new Web3(window.ethereum);
      return true;
    }
    return false;
  };

  const checkAccounts = async () => {
    if (!await ethEnabled()) {
      alert("Please install MetaMask to use this dApp!");
    }
    let accs = await web3.eth.getAccounts();
    const newAccounts = await Promise.all(accs.map(async address => {
      const balance = await web3.eth.getBalance(address);
      return web3.utils.fromWei(balance, 'ether');
    }));
    setAccounts(newAccounts);
  };

  const showBalance = async () => {
    await checkAccounts();
    setShowCurrentBalance(true);
  };

  const onClickConnect = async () => {
    await checkAccounts();
    setMetaMaskConnected(true);
  }

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Show me the money!
        </h1>
        <button className="button" style={{display: metaMaskConnected ? "none" : "block"}} onClick={onClickConnect}>Connect With MetaMask</button>
        <button className="button" style={{display: metaMaskConnected ? "block" : "none"}} onClick={showBalance}>Show ETH Balance</button>
        <p style={{display: showCurrentBalance && accounts.length > 0 ? "block" : "none"}}>Current ETH Balance: {parseFloat(accounts[0]).toFixed(2)}</p>
        <p style={{display: showCurrentBalance && accounts.length === 0 ? "block" : "none", color: "red"}}>Please connect your test account!</p>

      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        
        .button {
          background-color: #4CAF50;
          border: none;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
        }
        
        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }
        
        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }
        .logo {
          height: 1em;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
