import { ethers } from 'ethers';
import { Alert } from 'react-native'; 

const contractABI = require('../abi.json'); 
import { CONTRACT_ADDRESS } from '../constants';

export const buyTicketOnBlockchain = async (eventId: number, priceInEther: string) => {
    try {
        const ethereum = (global as any).ethereum;

        if (!ethereum) {
            Alert.alert("تنبيه", "يرجى استخدام متصفح يدعم المحفظة");
            return null;
        }

       
        const provider = (ethers as any).providers 
            ? new (ethers as any).providers.Web3Provider(ethereum)
            : new (ethers as any).BrowserProvider(ethereum);

        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();

        const abi = contractABI.abi ? contractABI.abi : contractABI;
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

       
        const parseEther = (ethers as any).utils 
            ? (ethers as any).utils.parseEther 
            : (ethers as any).parseUnits; 

        const tx = await contract.buyTicket(eventId, {
            value: parseEther(priceInEther, "ether")
        });

        const receipt = await tx.wait();
        return receipt.transactionHash;

    } catch (error: any) {
        console.error("Blockchain Error:", error);
        Alert.alert("خطأ", "حدثت مشكلة في العملية");
        return null;
    }
};