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
 
}
