import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
    contract: null,
  });
  const [account, setAccount] = useState();
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);

  // Listen for account changes
  const accountListener = async (provider) => {
    provider.on('accountsChanged', async (accounts) => {
      setAccount(accounts[0]);
    })
  }

  // Detect the wallet on startup
  useEffect(() => {
    const runMe = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract('BlockchainChat', provider);
      
      if (provider) {
        accountListener(provider);

        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        });
      }
    };

    runMe().catch(err => alert(err.message));
  }, []);

  // Fetch account once connected
  useEffect(() => {
    const getAccounts = async () => {
      const account = await web3Api.web3.eth.getAccounts();
      setAccount(account[0]);
    }
    web3Api.web3 && getAccounts();
  }, [web3Api.provider])

  // Try to connect to MetaMask
  const connectWallet = async () => {
    if (!web3Api?.provider) {
      alert('You have to launch MetaMask');
      return;
    }
    web3Api.provider.request({method: 'eth_requestAccounts'})
  }

  const addMessage = async (message) => {
    await web3Api.contract.addMessage(message, {
      from: account
    });
  }

  const deleteMessage = async (msgId) => {
    try {
      await web3Api.contract.deleteMessage(msgId, { from: account });
    } catch (err) {
      let errMsg = err.reason;
      if (!errMsg) {
        if (err.message.startsWith('Internal JSON-RPC error.')) {
          errMsg = JSON.parse(err.message.slice(24)).data.reason;
        }
      }
      alert(errMsg);
    }
  }

  const fetchAllMessages = async () => {
    const posts = await web3Api.contract.fetchAllMessages({ from: account });
    setPosts(posts);
  }

  const fetchMyMessages = async () => {
    const posts =  await web3Api.contract.getMyMessages({ from: account });
    setPosts(posts);
  }

  return (
    <div className="App">
      Your Account: {account} <br/>

      <div><input type="text" value={message} onChange={(event) => {
        setMessage(event.target.value);
      }} /></div> <br/>

      <button onClick={() => {
        addMessage(message);
      }}>Add Message</button> <br/>

      <button onClick={() => {
        deleteMessage(message);
      }}>Delete Message</button> <br/>

      <button onClick={() => {
        connectWallet();
      }}>Connect</button> <br/>

      <button onClick={() => {
        fetchAllMessages();
      }}>Fetch All Messages</button> <br/>

      <button onClick={() => {
        fetchMyMessages();
      }}>Fetch My Messages</button> <br/>
      Posts: {posts.map(post => {
        return (
          <div key={post.msgId}>
            <p>{post.msgId}: {post.message}</p>
          </div>
        )
      })}
    </div>
  );
}

export default App;
