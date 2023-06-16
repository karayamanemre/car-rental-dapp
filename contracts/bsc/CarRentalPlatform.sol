// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";

contract CarRentalPlatform {
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
  event ChechOut(address indexed walletAddress, uint indexed carId);
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

}
