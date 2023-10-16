// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SimpleStorage {

    uint256 public favoriteNumber;

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    People[] public people;
    mapping(string => uint256) public numberToPeople;

    function store(uint256 _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256)  {
        return favoriteNumber;
    }

    function addPeople(string memory _name, uint256 _favoriteNumber) public  {
        numberToPeople[_name] = _favoriteNumber;
        people.push(People(_favoriteNumber,_name));
    }

}