const HelloBlockchain = artifacts.require("./HelloBlockchain.sol");

contract("HelloBlockchain", async accounts => {
  beforeEach(async () => {
  });

  //test 1
  it("should create a new NFT", async () => {
    const contract = await HelloBlockchain.new();
    const id = 1;
    const name = "Test1 Name";
    const description = "Test1 Description";
    await contract.createNFT(id, name, description, { from: accounts[0] });

    const nameInContract = await contract.getName(id);
    const descriptionInContract = await contract.getDescription(id);
    assert.equal(nameInContract, name, "NFT name does not match");
    assert.equal(descriptionInContract, description, "NFT description does not match");
  });

  //test 2
  it("should transfer the NFT", async () => {
    const contract = await HelloBlockchain.new();
    const id = 2;
    const name = "Test2 Name";
    const description = "Test2 Description";
    await contract.createNFT(id, name, description, { from: accounts[0] });
    await contract.transferNFT(accounts[1], id, { from: accounts[0] });

    const ownerInContract = await contract.getOwner(id);
    assert.equal(ownerInContract, accounts[1], "NFT owner does not match");
  });

  //test 3
  it("should list the NFT for sale with a price", async () => {
    const contract = await HelloBlockchain.new();
    const id = 3;
    const name = "Test3 Name";
    const description = "Test3 Description";
    const price = 10;
    await contract.createNFT(id, name, description, { from: accounts[0] });
    await contract.listNFTForSale(id, price, { from: accounts[0] });

    const isSaleInContract = await contract.getIsSale(id);
    const priceInContract = await contract.getPrice(id);
    assert.equal(isSaleInContract, true, "NFT is not on sale");
    assert.equal(priceInContract, price, "NFT price does not match");
  });

  //test 4
  it("should remove the NFT from sale ", async () => {
    const contract = await HelloBlockchain.new();
    const id = 4;
    const name = "Test4 Name";
    const description = "Test4 Description";
    const price = 10;
    await contract.createNFT(id, name, description, { from: accounts[0] });
    await contract.listNFTForSale(id, price, { from: accounts[0] });
    await contract.removeNFTFromSale(id, { from: accounts[0] });

    const isSaleInContract = await contract.getIsSale(id);
    assert.equal(isSaleInContract, false, "NFT is still on sale");
  });

  //test 5
  it("should execute a successful NFT purchase", async () => {
    const contract = await HelloBlockchain.new();
    const id = 5;
    const name = "Test5 Name";
    const description = "Test5 Description";
    const price = 10;
    await contract.createNFT(id, name, description, { from: accounts[0] });
    await contract.listNFTForSale(id, price, { from: accounts[0] });
    await contract.purchaseNFT(id, {from: accounts[1], value: price});

    const ownerInContract = await contract.getOwner(id);
    assert.equal(ownerInContract, accounts[1], "NFT owner does not match");
    const lastTransactionInContract = await contract.getLastTransaction();
    assert.equal(lastTransactionInContract.price, price, "Seller did not receive the correct amount");
  });

  //test 6
  it("should execute a unsuccessful NFT purchase", async () => {
    const contract = await HelloBlockchain.new();
    const id = 6;
    const name = "Test6 Name";
    const description = "Test6 Description";
    const price = 10;
    await contract.createNFT(id, name, description, { from: accounts[0] });
    await contract.listNFTForSale(id, price, { from: accounts[0] });
    await contract.purchaseNFT(id, {from: accounts[1], value: price/2});

    const ownerInContract = await contract.getOwner(id);
    assert.equal(ownerInContract, accounts[0], "NFT owner should not change");
  });



});
