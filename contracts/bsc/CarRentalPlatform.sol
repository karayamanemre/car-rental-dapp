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

}
