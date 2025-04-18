
const Marketplace = artifacts.require('./Marketplace.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Marketplace', ([deployer, seller, buyer]) => {
  let marketplace;

  before(async () => {
    marketplace = await Marketplace.deployed();
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await marketplace.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('has a name', async () => {
      const name = await marketplace.name();
      assert.equal(name, 'Ethereum Marketplace');
    });
  });

  describe('products', async () => {
    let result, productCount;
    const productName = "Test Product";
    const productDescription = "This is a test product";
    const productPrice = web3.utils.toWei('1', 'Ether');

    before(async () => {
      result = await marketplace.createProduct(productName, productDescription, productPrice, { from: seller });
      productCount = await marketplace.productCount();
    });

    it('creates products', async () => {
      // SUCCESS
      assert.equal(productCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
      assert.equal(event.name, productName, 'name is correct');
      assert.equal(event.description, productDescription, 'description is correct');
      assert.equal(event.price, productPrice, 'price is correct');
      assert.equal(event.owner, seller, 'owner is correct');
      assert.equal(event.purchased, false, 'purchased is correct');

      // FAILURE: Product must have a name
      await marketplace.createProduct('', productDescription, productPrice, { from: seller }).should.be.rejected;
      // FAILURE: Product must have a description
      await marketplace.createProduct(productName, '', productPrice, { from: seller }).should.be.rejected;
      // FAILURE: Product must have a price
      await marketplace.createProduct(productName, productDescription, 0, { from: seller }).should.be.rejected;
    });

    it('lists products', async () => {
      const product = await marketplace.products(productCount);
      assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct');
      assert.equal(product.name, productName, 'name is correct');
      assert.equal(product.description, productDescription, 'description is correct');
      assert.equal(product.price, productPrice, 'price is correct');
      assert.equal(product.owner, seller, 'owner is correct');
      assert.equal(product.purchased, false, 'purchased is correct');
    });

    it('sells products', async () => {
      // Track the seller balance before purchase
      let oldSellerBalance = await web3.eth.getBalance(seller);
      oldSellerBalance = new web3.utils.BN(oldSellerBalance);

      // SUCCESS: Buyer makes purchase
      result = await marketplace.purchaseProduct(productCount, { from: buyer, value: productPrice });

      // Check logs
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
      assert.equal(event.name, productName, 'name is correct');
      assert.equal(event.description, productDescription, 'description is correct');
      assert.equal(event.price, productPrice, 'price is correct');
      assert.equal(event.owner, buyer, 'owner is now the buyer');
      assert.equal(event.purchased, true, 'purchased is now true');

      // Check that seller received funds
      let newSellerBalance = await web3.eth.getBalance(seller);
      newSellerBalance = new web3.utils.BN(newSellerBalance);

      let price = new web3.utils.BN(productPrice);
      const expectedBalance = oldSellerBalance.add(price);

      assert.equal(newSellerBalance.toString(), expectedBalance.toString());

      // FAILURE: Tries to buy a product that does not exist (invalid id)
      await marketplace.purchaseProduct(99, { from: buyer, value: productPrice }).should.be.rejected;
      // FAILURE: Buyer tries to buy without enough ether
      await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
      // FAILURE: Buyer tries to buy an already purchased product
      await marketplace.purchaseProduct(productCount, { from: deployer, value: productPrice }).should.be.rejected;
      // FAILURE: Buyer tries to buy their own product
      await marketplace.createProduct("Test Product 2", "Another test product", productPrice, { from: buyer });
      await marketplace.purchaseProduct(2, { from: buyer, value: productPrice }).should.be.rejected;
    });
  });
});
