const hre = require("hardhat");

async function main() {
  // 1. جلب العقد
  const EventTicket = await hre.ethers.getContractFactory("EventTicket");

  console.log("Deploying EventTicket contract...");

  // 2. نشر العقد
  const eventTicket = await EventTicket.deploy();

  // 3. انتظار اكتمال النشر
  await eventTicket.waitForDeployment();

  const contractAddress = await eventTicket.getAddress();
  console.log("------------------------------------------");
  console.log("EventTicket deployed to:", contractAddress);
  console.log("------------------------------------------");

  // 4.  شحن العقد بمبلغ بسيط (مثلاً 0.1 ETH)
  // لضمان عمل دالة الـ Refund فوراً عند التجربة
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Funding the contract for refund tests...");
  const tx = await deployer.sendTransaction({
    to: contractAddress,
    value: hre.ethers.parseEther("0.1"), // يمكنك تغيير المبلغ حسب رغبتك
  });
  await tx.wait();

  console.log("Contract successfully funded with 0.1 ETH");
  console.log("Deployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});