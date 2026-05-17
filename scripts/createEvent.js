const hre = require("hardhat");

async function main() {
  
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const eventTicket = await hre.ethers.getContractAt(
    "EventTicket",
    contractAddress
  );

  console.log("Creating event...");

  const price = hre.ethers.parseEther("0.01"); 
  const totalTickets = 1000;
  const eventDate = 1767225600; // تاريخ مستقبلي (2026)

  const tx = await eventTicket.createEvent(
    "Winter Wonderland",
    price,
    totalTickets,
    eventDate
  );

  await tx.wait();

  console.log("Event 'Winter Wonderland' created successfully! 🎟️");
}

main().catch(console.error);