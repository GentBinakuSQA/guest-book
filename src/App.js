import { useEffect, useState } from "react";
import React from 'react';
import NearWalletSelector from "near-wallet-selector";
import Form from './components/Form';
import SignIn from './components/SignIn';
import Messages from './components/Messages';
import Big from "big.js";

const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();


const near = new NearWalletSelector({
  wallets: ["nearwallet", "senderwallet", "ledgerwallet", "mywallet"],
  networkId: "testnet",
  theme: "dark",
  walletSelectorUI: {
      description: 'Please select a wallet to connect to this dapp:',
      explanation: 'Wallets are used to send, receive, and store digital assets.\n' +
          '                There are different types of wallets. They can be an extension\n' +
          '                added to your browser, a hardware device plugged into your\n' +
          '                computer, web-based, or as an app on your phone.',
  }
});
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([])

  const onSubmit = (e) => {

    e.preventDefault();
    const { fieldset, message, donation } = e.target.elements; 
    fieldset.disabled = true;
    window.contract.addMessage(
      { text: message.value },
      BOATLOAD_OF_GAS,
      Big(donation.value || '0').times(10 ** 24).toNumber()
    ).then(() => {
      window.contract.getMessages().then(messages => {
        console.log(messages)
        setMessages(messages);
        message.value = '';
        donation.value
        fieldset.disabled = false;
        message.focus();
      });
    });
  };

  useEffect(() => {
    setIsLoggedIn(near.isSignedIn());
    if(window.accountId)
        window.contract.getMessages().then(setMessages);

  }, []);

  near.on("connect", () => {
        near.setContract(['getMessages'],  ['addMessage']).then(() =>{
            near.getContract().then(async (obj) =>{
                  window.accountId = await obj.account.accountId,
                  window.balance = 1
                  window.contract = await obj.contract
            })
        })
  });
  near.on("disconnect", () => {
    window.balance = null
    window.accountId = null
    window.contract = null
    console.log("disconnect");
  });
  near.on("signIn", () => {
    console.log("signIn")
  });
  near.on("connected", () => {
    console.log("connected")
  })

  function handleOpenModal() {
    near.showModal();
  }

  function handleLogout() {
    near.signOut();
    setIsLoggedIn(false);
  }
  return (
    <div className="App">
      <div className="Buttons">
        <h2>Guest Book Integrated with Modal</h2>
        {!isLoggedIn && <button onClick={handleOpenModal}>Connect</button>}
        {isLoggedIn && <button onClick={handleLogout}>Disconnect</button>}
      </div>
    <div>
      { isLoggedIn 
        ? <Form onSubmit={onSubmit} user={window.accountId} balance={window.balance} />
        : <SignIn/>
      }
      { !!isLoggedIn && !!messages.length && <Messages messages={messages}/> }
    </div>
    </div>
  );
}

export default App;
