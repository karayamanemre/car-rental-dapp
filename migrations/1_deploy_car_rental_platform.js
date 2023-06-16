const fs = require("fs");
const CarRentalPlatform = artifacts.require("CarRentalPlatform");

module.exports = async function (deployer) {
	await deployer.deploy(CarRentalPlatform);
	const deployed = await CarRentalPlatform.deployed();
	let CarRentalPlatformAddress = await deployed.address;

	let config = `export const CarRentalPlatformAddress = "${CarRentalPlatformAddress}";`;
	console.log(config);
	let data = JSON.stringify(config);
	fs.writeFileSync("config.js", JSON.parse(data));
};
