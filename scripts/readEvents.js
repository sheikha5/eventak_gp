const hre = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const eventTicket = await hre.ethers.getContractAt(
    "EventTicket",
    contractAddress
  );

  const count = await eventTicket.eventCount();
  console.log("------------------------------------------");
  console.log("Total Events in Contract:", count.toString());
  console.log("------------------------------------------");

  for (let i = 1; i <= count; i++) {
    const event = await eventTicket.events(i);

    // تحويل السعر من Wei إلى ETH ليكون مقروءاً
    const priceInEth = hre.ethers.formatEther(event.price);
    
    const date = new Date(Number(event.date) * 1000).toLocaleString();

    console.log(`\nEvent ID: ${i}`);
    console.log(`Name: ${event.name}`);
    console.log(`Price: ${priceInEth} ETH`);
    console.log(`Total Tickets: ${event.totalTickets}`);
    console.log(`Sold Tickets: ${event.soldTickets}`);
    console.log(`Event Date: ${date}`);
    console.log("------------------------------------------");
  }
}

main().catch(console.error);