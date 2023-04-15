// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/**
  * @title BlockchainChat
  * @dev Blockchain demo with a simple chat messager application.
  * @custom:dev-run-script ./scripts/deploy_with_web3.ts
  */
contract BlockchainChat {
  struct Message {
    uint msgId;       // An integer value
    string message;   // The message
    bool isDeleted;   // Is deleted ?
    uint createdAt;   // Store the timestamp value for the message created datetime
  }

  // These event will be fired on each added or deleted message
  event AddMessage(address sender, uint msgId);
  event DeleteMessage(uint msgId);

  // List of messages
  Message[] private messages;
  // A mapping of message and sender
  mapping(uint => address) private msgMap;

  // ABIs
  function addMessage(string memory message) external {
    uint msgId = messages.length; // Start from zero
    messages.push(
      // I recommend you should use this style <id>:<value> to avoid potential bugs
      Message({
        msgId: msgId,
        message: message,
        isDeleted: false,
        createdAt: block.timestamp
      })
    );
    msgMap[msgId] = msg.sender;
    // Notify the subcribers
    emit AddMessage(msg.sender, msgId);
  }

  /**
   * Delete a message
   * @param msgId: the message id is the index of item in the array
   */
  function deleteMessage(uint msgId) isOwner(msgId) OutOfRange(msgId) external {
    messages[msgId].isDeleted = true;
    emit DeleteMessage(msgId);
  }

  function fetchAllMessages() external view returns(Message[] memory) {
    // It is great if we have Array.filter ^^
    Message[] memory tmpMsgs = new Message[](messages.length);
    uint counter = 0;
    for (uint i = 0; i < messages.length; i++) {
      if (isNotDeleted(i)) {
        tmpMsgs[counter++] = messages[i];
      }
    }
    // Return filtered messages
    Message[] memory result = new Message[](counter);
    for (uint i = 0; i < counter; i++) {
      result[i] = tmpMsgs[i];
    }

    return result;
  }

  function getMyMessages() external view returns(Message[] memory) {
    // It is great if we have Array.filter ^^
    Message[] memory tmpMsgs = new Message[](messages.length);
    uint counter = 0;
    for (uint i = 0; i < messages.length; i++) {
      if (isNotDeleted(i) && isMine(messages[i].msgId)) {
        tmpMsgs[counter++] = messages[i];
      }
    }
    if (counter == 0) {
      return tmpMsgs;
    }
    // Return filtered messages
    Message[] memory result = new Message[](counter);
    for (uint i = 0; i < counter; i++) {
      result[i] = tmpMsgs[i];
    }

    return result;
  }

  modifier isOwner(uint msgId) {
    require(isMine(msgId), "You are not the owner of this message");
    _;
  }

  modifier OutOfRange(uint index) {
    require(index < messages.length, "Out of range index");
    _;
  }

  function isMine(uint msgId) private view returns (bool) {
    return msg.sender == msgMap[msgId];
  }

  function isNotDeleted(uint index) OutOfRange(index) private view returns (bool) {
    if (messages[index].isDeleted == false) {
      return true;
    } else {
      return false;
    }
  }
}
