const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testing the NFT contract", function () {

  let contractFactory;
  let contract;
  let owner;
  let alice;
  let bob;
  let ownerAddress;
  let aliceAddress;
  let bobAddress
  let token_0;
  const fee_base = 1000;
  const fee_mul = 3;
  const tax_base = 1000;
  const tax_mul = 1;
  const split_base = 3;
  const split_mul = 2;

  const token0Uri = "https://protocol.ai/"

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    aliceAddress = await alice.getAddress();
    bobAddress = await bob.getAddress();
    contractFactory = await ethers.getContractFactory("NFT");
    contract = await contractFactory.deploy();
    token_0 = await contract.createToken(token0Uri, [], []);
  });

  it("Test name and tokenUri", async function () {
    expect(await contract.name()).to.equal("Graph Funder");
    expect(await contract.tokenURI(0)).to.equal(token0Uri);
  });

  // TOD0: test getters

  it("Tests donate method", async function () {
    // Parse the etherString representation of ether 
    // into a BigNumber instance of the amount of wei.
    const donationAmount = ethers.utils.parseEther("1");
    expect(await contract.tokenDonationBalance(0)).to.equal(0);
    expect(await contract.getTreasuryBalance()).to.equal(0);
    // 
    await contract.connect(alice).donate(0, {value: donationAmount});
    let net_donation = donationAmount.sub(donationAmount.mul(tax_mul).div(tax_base));
    let balance = await contract.tokenDonationBalance(0);
    expect(balance).to.eq(net_donation);
    let treasury_bal = await contract.getTreasuryBalance();
    expect(treasury_bal).to.eq( donationAmount.sub(net_donation) );
    // // testing donations < 100
    const smallDonation = 90;
    await contract.connect(alice).donate(0, {value: smallDonation});
    balance_dash = await contract.tokenDonationBalance(0);
    // // balance_dash should be balance + smallDonation
    expect(balance_dash).to.eq( balance.add(smallDonation) );
    // // treasury_bal should be the same as above
    expect(treasury_bal).to.eq( donationAmount.sub(net_donation) );
  });

  it("Tests create/get dependencies", async function () {
    let deps0 = await contract.getDependencies(0);
    expect(deps0.length).to.eq(0);
    // 
    // creates _tokenIds[1]
    // tests dependencies of _tokenIds[1]
    await contract.createToken(token0Uri, [0], [2]);
    let deps1 = await contract.getDependencies(1);
    expect(deps1.length).to.eq(1);
    expect(deps1[0]).to.eq(0);
    // // 
    // // creates _tokenIds[2]
    // // tests deps
    let dep_2 = [0,1];
    let shares_2 = [2, 4]
    await contract.createToken(token0Uri, dep_2, shares_2 );
    let deps2 = await contract.getDependencies(2);
    expect(deps2.length).to.eq(dep_2.length);
    for(i=0 ; i<deps2.length ; i++) {
      expect(deps2[i]).to.eq( dep_2[i] ); 
    }
    // creates _tokenIds[3] with wrong entry as dep
    // tests revert
    let dep_3 = [0,1,99];
    await expect (contract.createToken(token0Uri, dep_3, [1, 1, 1])).to.be.revertedWith("Invalid tokenId in dependencies entry");
  });

  it("Tests claimToOwner", async function () {
  // claim w/o deps
    let owner_balance = await owner.getBalance();
    // 
    const donationAmount = ethers.utils.parseEther("1");
    const net_donation = donationAmount.sub(donationAmount.mul(tax_mul).div(tax_base));
    await contract.connect(alice).donate(0, {value: donationAmount});
    expect( await contract.claimable(0,0)).to.eq(net_donation);
    // 
    let claimer_fee = net_donation.mul(fee_mul).div(fee_base);
    await contract.connect(bob).claimToOwner(0);
    let owner_bal_2 = await owner.getBalance();
    expect ( owner_bal_2).to.eq( owner_balance.add(   net_donation.sub(claimer_fee)  ) );
    console.log('claimToOwner w/o deps passed');
    //
    //
    await expect(contract.claimToOwner(0)).to.be.revertedWith(
      "There are no funds to be claimed for the owner"
      );
  // claim to owner with deps
    // // _tokenIds[1]
    await contract.createToken( token0Uri, [], [] );
    // // _tokenIds[2] with deps=[0,1]
    let deps_2 = [0,1];
    let shares_2 = [2, 4];
    await contract.createToken( token0Uri, deps_2, shares_2  );
    await contract.connect(alice).donate( 2, {value: donationAmount} );
    let claimable_by_owner = ( (net_donation.mul(split_mul)).div(split_base) );
    expect( await contract.claimable(2, 2) ).to.eq( claimable_by_owner  );
    // 
    owner_bal = await owner.getBalance();
    let bob_bal = await bob.getBalance();
    let tx_claim = await contract.connect(bob).claimToOwner(2);
    claimer_fee = claimable_by_owner.mul(fee_mul).div(fee_base);
    owner_bal_2 = await owner.getBalance();
    expect ( owner_bal_2 ).to.eq( owner_bal.add( claimable_by_owner.sub(claimer_fee) ) );
    // 
    //checks if the claimer got his fee
    let bob_bal_2 = await bob.getBalance();
    receipt = await tx_claim.wait();
    let tx_gasPaid = receipt.gasUsed * receipt.effectiveGasPrice;
    expect(bob_bal_2).to.eq( bob_bal.add( claimer_fee ).sub(tx_gasPaid) );
    //
    expect (await contract.tokenDonationBalance(2) ).to.eq( net_donation.sub( claimable_by_owner ) );
    expect ( await contract.claimable( 2, 2 ) ).to.eq( 0 );
    console.log('claim to owner w deps passed');
   
  });

  it("Tests claimToDep", async function () {
    // tokenId = 1; bob is owner
    await contract.connect(bob).createToken(token0Uri, [], []);
    // tokenId = 2; deps = [0,1]
    const deps = [0,1];
    const shares = [2, 4];
    await contract.createToken(token0Uri, deps, shares);
    // 
    const donationAmount = ethers.utils.parseEther("1");
    const net_donation = donationAmount.sub( donationAmount.mul(tax_mul).div(tax_base) );
    await contract.connect(alice).donate(2, {value: donationAmount});
    // 
    expect(await contract.tokenDonationBalance(2)).to.eq(net_donation);
    //
    const deps_Split = net_donation.mul(split_base - split_mul).div(split_base);
    const total_Shares = shares[0] + shares[1];
    const claimable_by_0 = deps_Split.mul(shares[0]).div(total_Shares);
    const claimable_by_1 = deps_Split.mul(shares[1]).div(total_Shares); 
    expect( await contract.claimable(0, 2) ).to.eq( claimable_by_0  );
    //
    expect( await contract.claimable(1, 2) ).to.eq( claimable_by_1  );
    //
    const claimer_bal = await owner.getBalance();
    const tx_claim = await contract.claimToDep(1, 2);
    const claimer_fee = claimable_by_1.mul(fee_mul).div(fee_base);
    expect( await contract.tokenDonationBalance(1)).to.eq(claimable_by_1.sub(claimer_fee));
    expect( await contract.claimable(1,1)).to.eq(claimable_by_1.sub(claimer_fee));
    await expect(contract.connect(alice).claimToDep(0,1)).to.be.revertedWith(
      "There are no funds to be claimed to this dependency"
    );
    // 
    const claimer_bal_2 = await owner.getBalance();
    receipt = await tx_claim.wait();
    tx_gasPaid = receipt.gasUsed * receipt.effectiveGasPrice;
    expect(claimer_bal_2).to.eq( claimer_bal.add( claimer_fee ).sub(tx_gasPaid) );
  });

});