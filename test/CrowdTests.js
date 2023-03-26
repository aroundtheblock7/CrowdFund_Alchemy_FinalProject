const { expect, assert } = require('chai');
const { ethers } = require("hardhat");

describe('Token Contract()', () => {
    let CrowdFund, crowdfund, CrowdCoin, crowdcoin, owner, addr1, addr2;

    before(async () => {
        CrowdCoin = await ethers.getContractFactory("CrowdCoin");
        crowdcoin = await CrowdCoin.deploy();
        CrowdFund = await ethers.getContractFactory("CrowdFund");
        crowdfund = await CrowdFund.deploy(crowdcoin.address);

        [owner, addr1, addr2] = await ethers.getSigners();
    })

    describe('Deployment', () => {
        it('Should set the right owner', async () => {
            expect(await crowdfund.owner()).to.equal(owner.address);
         });

         it('Should allow addr1 to mint 12 crowdcoin tokens', async () => {
         const MINT_ETHER = ethers.utils.parseEther("12");
         await crowdcoin.connect(addr1).mint(MINT_ETHER);
         expect(await crowdcoin.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("12"));
         console.log(await crowdcoin.balanceOf(addr1.address));
        });
        
        it('Should allow addr1 to mint 5 crowdcoin tokens', async () => {
            const MINT_ETHER = ethers.utils.parseEther("5");
            await crowdcoin.connect(addr2).mint(MINT_ETHER);
            expect(await crowdcoin.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("5"));
            console.log(await crowdcoin.balanceOf(addr2.address));
        });

        it("Should allow under to launch a project", async () => {
            console.log(((new Date().getTime()/1000).toString()));
            const a = Math.floor(Number((new Date().getTime()/1000).toString()));
            const b = Math.floor(Number(((new Date().getTime()/1000) + 1000).toString()));
            const aNumber = Number(a);
            const bNumber = Number(b);
            console.log(aNumber);
            console.log(bNumber);
            
            const ONE_ETHER = ethers.utils.parseEther("1");
            await crowdfund.connect(owner).launch(ONE_ETHER, aNumber, bNumber);
            console.log(await crowdfund.count());
            
            console.log(await crowdfund.campaigns(1));
            expect(await crowdfund.count()).to.equal("1");
            
          });

        it("Should allow addr1 to pledge tokens to campaign", async () => {
            const ONE_ETHER = ethers.utils.parseEther("1");
            let tx1 = await crowdcoin.connect(addr1).approve(crowdfund.address, ONE_ETHER);
            await tx1.wait();
            console.log("Transaction1:",tx1.hash);
           
           let tx2 = await crowdfund.connect(addr1).pledge(1, ONE_ETHER);
           await tx2.wait();
           console.log("Transaction2:",tx2.hash);
            
           const balance = await crowdfund.pledgedAmount(1, addr1.address);
           expect(await balance == "1")
        });

        it("Should allow addr2 to pledge tokens to campaign", async () => {
            const THREE_ETHER = ethers.utils.parseEther("3");
            let tx1 = await crowdcoin.connect(addr2).approve(crowdfund.address, THREE_ETHER);
            await tx1.wait();
            console.log("Transaction1:",tx1.hash);
           
           let tx2 = await crowdfund.connect(addr2).pledge(1, THREE_ETHER);
           await tx2.wait();
           console.log("Transaction2:",tx2.hash);
            
           const balance = await crowdfund.pledgedAmount(1, addr2.address);
           expect(await balance == "3")
        });

        it("Should ensure the total amount pledged to campaign 1 is correct", async () => {
            const totalPledged = await crowdfund.campaigns(1).pledged;
            expect(await totalPledged == "4")
        });

        it("Should allow addr2 to unpledge his tokens", async () => {
           const ONE_ETHER = ethers.utils.parseEther("1");
           let tx3 = await crowdfund.connect(addr2).unpledge(1, ONE_ETHER);
           await tx3.wait();
           console.log("Transaction3:",tx3.hash);
           const balance = await crowdfund.pledgedAmount(1, addr1.address);
           expect(await balance == "0")
        });

        it("Should ensure the total amount pledged to campaign 1 after user upledged is correct", async () => {
            const totalPledged = await crowdfund.campaigns(1).pledged;
            expect(await totalPledged == "3")
        });

        it("Should allow owner/creator of campaign 1 to claim tokens", async () => {
            let tx4 = await crowdfund.connect(owner).claim(1);
            await tx4.wait();
            console.log("Transaction4:",tx4.hash);
            const ownerBalance = await crowdcoin.balanceOf(owner.address);
            console.log(ownerBalance);
            expect (await ownerBalance == "3");
        });

        it("Should ensure the campaign has been claimed", async () => {
            const claimed = await crowdfund.campaigns(1).claimed;
            expect(await claimed == true)
        });

    });
});