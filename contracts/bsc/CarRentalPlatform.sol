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

}
