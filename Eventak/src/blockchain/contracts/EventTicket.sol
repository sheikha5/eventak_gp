pragma solidity ^0.8.28;

contract EventTicket {

    //  صاحب العقد (المنظم العام)
    address public owner;

    //  شكل الحدث (Data Model)
    struct Event {
        string name;          // اسم الحدث
        uint price;           // سعر التذكرة
        uint totalTickets;    // إجمالي التذاكر
        uint soldTickets;     // التذاكر المباعة
        uint date;            // وقت الحدث
        address organizer;    // منشئ الحدث
    }

    //  عداد الأحداث
    uint public eventCount;

    //  تخزين الأحداث (mapping = قاعدة بيانات)
    mapping(uint => Event) public events;
mapping(uint => mapping(address => uint)) public ticketCount; //يخزن عدد التذاكر اللي حجزها المستخدم في الحدث الواحد
mapping(uint256 => address) public ticketOwners;
//تنبيه للفرونت 
event TicketBought(address buyer, uint eventId);

    // constructor ينفذ مرة وحدة عند نشر العقد
    constructor() {
        owner = msg.sender;
    }

    //  إنشاء Event جديد
    function createEvent(
        string memory _name,
        uint _price,
        uint _totalTickets,
        uint _date
    ) public {

        //  فقط owner يقدر ينشئ أحداث
        require(msg.sender == owner, "Only owner can create events");

        //  زيادة رقم الحدث
        eventCount++;

        //  تخزين الحدث داخل mapping
        events[eventCount] = Event({
            name: _name,
            price: _price,
            totalTickets: _totalTickets,
            soldTickets: 0,
            date: _date,
            organizer: msg.sender
        });
    }
    function buyTicket(uint _eventId) public payable {

    Event storage myEvent = events[_eventId];

    require(bytes(myEvent.name).length > 0, "Event does not exist");
    require(msg.value == myEvent.price, "Incorrect ETH amount");

    // حد أقصى 5 تذاكر لكل يوزر
    require(ticketCount[_eventId][msg.sender] < 5, "Max 5 tickets allowed");

    require(myEvent.soldTickets < myEvent.totalTickets, "Sold out");

    ticketCount[_eventId][msg.sender] += 1;
    myEvent.soldTickets++;
ticketOwners[myEvent.soldTickets] = msg.sender;
emit TicketBought(msg.sender, _eventId);
    payable(owner).transfer(msg.value);}
function transferTicket(uint256 ticketId, address to) public {
        require(ticketOwners[ticketId] == msg.sender, "Not the owner");
        require(to != address(0), "Invalid address");
        ticketOwners[ticketId] = to;
    }

}
}