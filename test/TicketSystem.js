const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventTicket Contract", function () {

  let contract;
  let owner;
  let user;
  let user2; // أضفنا يوزر ثاني لتجربة التحويل

  beforeEach(async function () {
    [owner, user, user2] = await ethers.getSigners();

    const EventTicket = await ethers.getContractFactory("EventTicket");
    contract = await EventTicket.deploy();
    await contract.waitForDeployment();
  });

  // 1) اختبار إنشاء حدث (كما هو)
  it("should allow owner to create event", async function () {
    await contract.createEvent("BLVD WORLD", ethers.parseEther("1"), 500, 1767225600);
    const eventData = await contract.events(1);
    expect(eventData.name).to.equal("BLVD WORLD");
  });

  // 2) اختبار شراء تذكرة وتأكيد الملكية (تعديل مهم)
  it("should record ticket ownership after purchase", async function () {
    await contract.createEvent("Winter wonderland", ethers.parseEther("1"), 1000, 1767225600);

    // شراء تذكرة
    await contract.connect(user).buyTicket(1, { value: ethers.parseEther("1") });

    // التأكد أن التذكرة رقم 1 في الحدث رقم 1 مسجلة باسم "user"
    const ticketOwner = await contract.ticketOwners(1, 1);
    expect(ticketOwner).to.equal(user.address);
  });

  // 3) اختبار تحويل التذكرة (رقم 7 في السلسلة)
  it("should transfer ticket ownership to another user", async function () {
    await contract.createEvent("Riyadh Season", ethers.parseEther("1"), 100, 1767225600);
    await contract.connect(user).buyTicket(1, { value: ethers.parseEther("1") });

    // تحويل التذكرة رقم 1 من user إلى user2
    await contract.connect(user).transferTicket(1, 1, user2.address);

    // التأكد أن المالك الجديد هو user2
    expect(await contract.ticketOwners(1, 1)).to.equal(user2.address);
    // التأكد أن عداد تذاكر user1 نقص
    expect(await contract.ticketCount(1, user.address)).to.equal(0);
  });

  // 4) اختبار الاسترجاع (Refund)
  it("should allow user to refund ticket and get ETH back", async function () {
    await contract.createEvent("Concert", ethers.parseEther("1"), 100, 1767225600);
    
    // شحن العقد بـ ETH أولاً ليتمكن من الإرجاع (عن طريق الـ owner)
    await owner.sendTransaction({
        to: await contract.getAddress(),
        value: ethers.parseEther("5")
    });

    await contract.connect(user).buyTicket(1, { value: ethers.parseEther("1") });

    // تنفيذ الاسترجاع
    await expect(() => 
        contract.connect(user).refundTicket(1, 1)
    ).to.changeEtherBalances([user, contract], [ethers.parseEther("1"), ethers.parseEther("-1")]);

    // التأكد أن الملكية مُسحت (صارت عنوان صفر)
    expect(await contract.ticketOwners(1, 1)).to.equal(ethers.ZeroAddress);
  });

  // 5) اختبار الحد الأقصى 5 تذاكر (كما هو)
  it("should allow only 5 tickets per user", async function () {
    await contract.createEvent("BLVD city", ethers.parseEther("1"), 500, 1767225600);
    for (let i = 0; i < 5; i++) {
      await contract.connect(user).buyTicket(1, { value: ethers.parseEther("1") });
    }
    await expect(
      contract.connect(user).buyTicket(1, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Max 5 tickets allowed");
  });
});