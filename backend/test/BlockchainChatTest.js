const BlockchainChat = artifacts.require("./BlockchainChat.sol");

contract("BlockchainChat", accounts => {
  let contractIns;

  beforeEach(async () => {
    contractIns = await BlockchainChat.new();
  })

  it("should able to add new message", async () => {
    await contractIns.addMessage("A message", { from: accounts[0] });

    const messages = await contractIns.fetchAllMessages({ from: accounts[0] });

    assert.equal(messages.length, 1);
  });

  it("should emit the AddNew event when adding message", async () => {
    const addRs = await contractIns.addMessage("A message", { from: accounts[0] });

    assert.equal(addRs.logs[0].event, "AddMessage")
  });

  it("should able to delete a message", async () => {
    const addRs = await contractIns.addMessage("A message", { from: accounts[0] });

    let messages = await contractIns.fetchAllMessages({ from: accounts[0] });

    assert.equal(messages.length, 1);

    await contractIns.deleteMessage(0, { from: accounts[0] });

    messages = await contractIns.fetchAllMessages({ from: accounts[0] });

    assert.equal(messages.length, 0);
  });

  it("should emit the DeleteMessage event when deleting message", async () => {
    await contractIns.addMessage("A message", { from: accounts[0] });
    const addRs = await contractIns.deleteMessage(0, { from: accounts[0] });

    assert.equal(addRs.logs[0].event, "DeleteMessage")
  });

  it("should able to delete only owner post", async () => {
    await contractIns.addMessage("A message", { from: accounts[0] });
    try {
      await contractIns.deleteMessage(0, { from: accounts[1] });
      assert.fail();
    } catch (e) {
      assert.equal(e.reason, "You are not the owner of this message");
    }
  });

  it("should able to fetch all posts", async () => {
    await contractIns.addMessage("A message", { from: accounts[0] });
    await contractIns.addMessage("A message", { from: accounts[1] });
    
    const messages = await contractIns.fetchAllMessages({ from: accounts[2] });
    assert.equal(messages.length, 2);
  });

  it("should able to fetch owner posts", async () => {
    await contractIns.addMessage("A message", { from: accounts[0] });
    await contractIns.addMessage("A message", { from: accounts[1] });
    
    const messages = await contractIns.getMyMessages({ from: accounts[1] });
    assert.equal(messages.length, 1);
  });
});
