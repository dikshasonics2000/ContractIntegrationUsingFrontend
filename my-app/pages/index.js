import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal"; //Web3Modal is an easy-to-use library to help developers add support for multiple providers in their apps with a simple customizable configuration.
import { BigNumber, providers, Contract } from "ethers"; // library used to connect the frontend to smart contracts
import { useEffect, useRef, useState } from "react";
import { CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {

    const [walletConnected, setWalletConnected] = useState(false);
 const [firstName, setFirstName] = useState('');

 const [loading, setLoading] = useState(false);
 const [scndName, setScndName] = useState('');

 const [admNo, setadmNo] = useState(0);

 const [a, setA] = useState('');

 
  const web3ModalRef = useRef(); // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open

 
  const getProviderOrSigner = async (needSigner = false) => {
    
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

 
  
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      
    } catch (err) {
      console.error(err);
    }
  };

  const printHello = async () => {
    try {
      const provider = await getProviderOrSigner(true);
      const Contracts = new Contract(
        CONTRACT_ADDRESS,
        abi,
        provider
      );

      const message = await Contracts.printHello(a);
  
      window.alert(message);
    } catch (error) {
      console.error(error);
    }
  }

const setDetails = async () => {
  try {
    const signer = await getProviderOrSigner(true);
    const provider = await getProviderOrSigner(true);
    const Contracts = new Contract(
      CONTRACT_ADDRESS,
      abi,
      provider
    );
    const details = await Contracts.setDetails(firstName, scndName, admNo);
      
      
      window.alert("value assigned");

     // window.alert("value assigned");
      
  } catch (error) {
    console.error(error);
  }
}

const getDetails = async (admNo) => {
  try {
    const provider = await getProviderOrSigner(true);
    const Contracts = new Contract(
      CONTRACT_ADDRESS,
      abi,
      provider
    );

    const value = await Contracts.getDetails(admNo); //get the details of admNo 123 from the mapping in the contract
    window.alert(value); 

  } catch (error) {
    console.error(error);
    
  }
}

  const renderButton = () => {
  if (walletConnected) {
   
     return (
        <div>
             <input
            type="text"
            placeholder="firstName"
            // BigNumber.from converts the `e.target.value` to a BigNumber
            onChange={(e) => setFirstName(e.target.value)}
          />
           <input
            type="text"
            placeholder="secondName"
            onChange={(e) => setScndName(e.target.value)}
          />
           <input
            type="number"
            placeholder="admNo"
            onChange={(e) => setadmNo(e.target.value)}
          />
        <button onClick = {() => setDetails(firstName, scndName, admNo)}> 
        submit
         </button>
         <input
            type="number"
            placeholder="admNo"
            onChange={(e) => setadmNo(e.target.value)}
          />
           <button onClick = {() => getDetails(admNo)}> 
        submit
         </button>
        </div>
        
      );
    
  } else {
    return (
      <button onClick={connectWallet}>
        Connect your wallet
      </button>
    );
  
}};
 
  useEffect(() => {
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      //connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Student Details</title>
      </Head>
      <div className={styles.main}>
        <div>
          <h1 >The details</h1>
          
          
          {renderButton()}
        </div>
      </div>
    </div>
  );
  
  }
 