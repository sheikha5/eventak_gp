// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract EventTicket {

    // صاحب العقد (المنظم العام)
    address public owner;

    // شكل الحدث (Data Model)
    struct Event {
        string name;          // اسم الحدث
        uint price;           // سعر التذكرة
        uint totalTickets;    // إجمالي التذاكر
        uint soldTickets;     // التذاكر المباعة
        uint date;            // وقت الحدث
        address organizer;    // منشئ الحدث
    }

    // عداد الأحداث
    uint public eventCount;

    // تخزين الأحداث (mapping = قاعدة بيانات)
    mapping(uint => Event) public events;

    // تخزين ملكية كل تذكرة (ربط رقم الحدث برقم التذكرة بمالكها)
    mapping(uint => mapping(uint => address)) public ticketOwners;

    // يخزن عدد التذاكر اللي حجزها المستخدم في الحدث الواحد
    mapping(uint => mapping(address => uint)) public ticketCount;

    // تنبيه للفرونت 
    event TicketBought(address buyer, uint eventId, uint ticketId);

    // constructor ينفذ مرة وحدة عند نشر العقد
    constructor() {
        owner = msg.sender;
    }

    // إنشاء Event جديد
    function createEvent(
        string memory _name,
        uint _price,
        uint _totalTickets,
        uint _date
    ) public {
        require(msg.sender == owner, "Only owner can create events");
        eventCount++;
        events[eventCount] = Event({
            name: _name,
            price: _price,
            totalTickets: _totalTickets,
            soldTickets: 0,
            date: _date,
            organizer: msg.sender
        });
    }

    // شراء تذكرة
    function buyTicket(uint _eventId) public payable {
        Event storage myEvent = events[_eventId];
        require(bytes(myEvent.name).length > 0, "Event does not exist");
        require(msg.value == myEvent.price, "Incorrect ETH amount");
        require(ticketCount[_eventId][msg.sender] < 5, "Max 5 tickets allowed");
        require(myEvent.soldTickets < myEvent.totalTickets, "Sold out");

        uint currentTicketId = myEvent.soldTickets + 1;
        ticketOwners[_eventId][currentTicketId] = msg.sender;

        ticketCount[_eventId][msg.sender] += 1;
        myEvent.soldTickets++;

        payable(owner).transfer(msg.value);
        emit TicketBought(msg.sender, _eventId, currentTicketId);
    }

    // تحويل ملكية التذكرة (إهداء أو بيع)
    function transferTicket(uint _eventId, uint _ticketId, address _to) public {
        require(ticketOwners[_eventId][_ticketId] == msg.sender, "You do not own this ticket");
        require(_to != address(0), "Invalid address");

        ticketOwners[_eventId][_ticketId] = _to;
        ticketCount[_eventId][msg.sender] -= 1;
        ticketCount[_eventId][_to] += 1;
    }

    // دالة الاسترجاع (Refund)
    function refundTicket(uint _eventId, uint _ticketId) public {
        require(ticketOwners[_eventId][_ticketId] == msg.sender, "You do not own this ticket");
        
        uint price = events[_eventId].price;
        // التأكد من وجود رصيد في العقد لإرجاع المال
        require(address(this).balance >= price, "Contract balance insufficient for refund");

        ticketOwners[_eventId][_ticketId] = address(0);
        ticketCount[_eventId][msg.sender] -= 1;
        events[_eventId].soldTickets -= 1;

        payable(msg.sender).transfer(price);
    }

    // دالة لاستقبال الإيثيريوم من الـ Owner لتغطية عمليات الاسترجاع
    receive() external payable {}
}