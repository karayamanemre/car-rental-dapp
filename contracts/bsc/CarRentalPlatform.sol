// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CarRentalPlatform is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _counter;
  
  address private owner;

  uint private totalPayments;

  struct User {
    address walletAddress;
    string name;
    string lastName;
    uint rentedCarId;
    uint balance;
    uint debt;
    uint start;
  }

  struct Car {
    uint id;
    string name;
    string imgUrl;
    Status status;
    uint rentFee;
    uint saleFee;
  }

  enum Status {
    Retired,
    InUse,
    Available
  }

  event CarCreated(uint indexed id, string name, string imgUrl, uint rentFee, uint saleFee);
  event CarMetaDataUpdated(uint indexed id, string name, string imgUrl, uint rentFee, uint saleFee);
  event CarStatusUpdated(uint indexed id, Status status);

  event UserCreated(address indexed walletAddress, string name, string lastName);
  event Deposit(address indexed walletAddress, uint amount);
  event CheckOut(address indexed walletAddress, uint indexed carId);
  event CheckIn(address indexed walletAddress, uint indexed carId);
  event PaymentMade(address indexed walletAddress, uint amount);
  event Withdraw(address indexed walletAddress, uint amount);

  mapping(uint => Car) private cars;
  mapping(address => User) private users;

  constructor() {
    owner = msg.sender;
    totalPayments = 0;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function");
    _;
  }

  function setOwner(address _newOwner) public onlyOwner {
    owner = _newOwner;
  }

  function addUser(string calldata name, string calldata lastName) external {
    require(!isUser(msg.sender), "User already exists");
    users[msg.sender] = User(msg.sender, name, lastName, 0, 0, 0, 0);

    emit UserCreated(msg.sender, users[msg.sender].name, users[msg.sender].lastName);
  }

  function addCar(string calldata name, string calldata imgUrl, uint rentFee, uint saleFee) external onlyOwner {
    _counter.increment();
    uint id = _counter.current();
    cars[id] = Car(id, name, imgUrl, Status.Available, rentFee, saleFee);

    emit CarCreated(id, cars[id].name, cars[id].imgUrl, cars[id].rentFee, cars[id].saleFee);
  }

  function updateCarMetaData(uint id, string calldata name, string calldata imgUrl, uint rentFee, uint saleFee) external onlyOwner {
    require(cars[id].id != 0, "Car does not exist");
    Car storage car = cars[id];
    if(bytes(name).length != 0) {
      car.name = name;
    }
    if(bytes(imgUrl).length != 0) {
      car.imgUrl = imgUrl;
    }
    if(rentFee > 0) {
      car.rentFee = rentFee;
    }
    if(saleFee > 0) {
      car.saleFee = saleFee;
    }

    emit CarMetaDataUpdated(id, car.name, car.imgUrl, car.rentFee, car.saleFee);
  }

  function updateCarStatus(uint id, Status status) external onlyOwner {
    require(cars[id].id != 0, "Car does not exist");
    cars[id].status = status;

    emit CarStatusUpdated(id, status);
  }

  function checkOut(uint id) external {
    require(isUser(msg.sender), "User does not exist");
    require(cars[id].status == Status.Available, "Car is not available");
    require(users[msg.sender].rentedCarId == 0, "User already has a car rented");
    require(users[msg.sender].debt == 0, "User has a debt");

    users[msg.sender].start = block.timestamp;
    users[msg.sender].rentedCarId = id;
    cars[id].status = Status.InUse;

    emit CheckOut(msg.sender, id);
  }

  function checkIn() external {
    require(isUser(msg.sender), "User does not exist");

    uint rentedCarId = users[msg.sender].rentedCarId;
    require(rentedCarId != 0, "User does not have a car rented");

    uint timeElapsed = block.timestamp - users[msg.sender].start;
    uint rentFee = cars[rentedCarId].rentFee;

    users[msg.sender].debt += calculateDebt(timeElapsed, rentFee);

    users[msg.sender].rentedCarId = 0;
    users[msg.sender].start = 0;
    cars[rentedCarId].status = Status.Available;

    emit CheckIn(msg.sender, rentedCarId);
  }

  function deposit() external payable {
    require(isUser(msg.sender), "User does not exist");
    require(msg.value > 0, "Deposit amount must be greater than 0");

    users[msg.sender].balance += msg.value;

    emit Deposit(msg.sender, msg.value);
  }

  function makePayment() external {
    require(isUser(msg.sender), "User does not exist");

    uint debt = users[msg.sender].debt;
    uint balance = users[msg.sender].balance;

    require(debt > 0, "User does not have a debt");
    require(balance >= debt, "User does not have enough balance");

    unchecked {
      users[msg.sender].balance -= debt;
    }

    totalPayments += debt;
    users[msg.sender].debt = 0;

    emit PaymentMade(msg.sender, debt);
  }

  function withdraw(uint amount) external nonReentrant {
    require(isUser(msg.sender), "User does not exist");

    uint balance = users[msg.sender].balance;
    require (balance >= amount, "User does not have enough balance");

    unchecked {
      users[msg.sender].balance -= amount;
    }

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed.");

    emit Withdraw(msg.sender, amount);
  }

  function withdrawOwnerBalance(uint amount) external onlyOwner {
    require(totalPayments >= amount, "Owner does not have enough balance");

    (bool success, ) = owner.call{value: amount}("");
    require(success, "Transfer failed.");

    unchecked {
      totalPayments -= amount;
    }
  }

  function getOwner() external view returns(address) {
    return owner;
  }

  function isUser(address walletAddress) private view returns(bool) {
    return users[walletAddress].walletAddress != address(0);
  }

  function getUser(address walletAddress) external view returns(User memory) {
    require(isUser(walletAddress), "User does not exist");
    return users[walletAddress];
  }

  function getCar(uint id) external view returns(Car memory) {
    require(cars[id].id != 0, "Car does not exist");
    return cars[id];
  }

  function getCarsByStatus(Status _status) external view returns(Car[] memory) {
    uint count = 0;
    uint length = _counter.current();
    for(uint i = 1; i <= length; i++) {
      if(cars[i].status == _status) {
        count++;
      }
    }
    Car[] memory result = new Car[](count);
    count = 0;
    for(uint i = 1; i <= length; i++) {
      if(cars[i].status == _status) {
        result[count] = cars[i];
        count++;
      }
    }
    return result;
  }
 
  function calculateDebt(uint timeElapsed, uint rentFee) private pure returns(uint) {
    uint minutesElapsed = timeElapsed / 60;
    return minutesElapsed * rentFee;
  }

  function getCurrentCount() external view returns(uint) {
    return _counter.current();
  }

  function getContractBalance() external view onlyOwner returns(uint) {
    return address(this).balance;
  }

  function getTotalPayments() external view onlyOwner returns(uint) {
    return totalPayments;
  }
}
