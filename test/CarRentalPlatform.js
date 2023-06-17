const CarRentalPlatform = artifacts.require("CarRentalPlatform");

contract("CarRentalPlatform", (accounts) => {
	let carRentalPlatform;
	const owner = accounts[0];
	const user = accounts[1];
	const rentFee = 10;
	const saleFee = 10000;

	beforeEach(async () => {
		carRentalPlatform = await CarRentalPlatform.new({ from: owner });
	});

	it("Should add a new user", async () => {
		await carRentalPlatform.addUser("John", "Doe", { from: user });
		const userInfo = await carRentalPlatform.getUser(user);
		assert.equal(userInfo.name, "John");
		assert.equal(userInfo.lastName, "Doe");
	});

	it("Should add a new car", async () => {
		await carRentalPlatform.addCar(
			"Tesla Model Y",
			"https://example.com/img.jpg",
			rentFee,
			saleFee,
			{ from: owner }
		);
		const carInfo = await carRentalPlatform.getCar(1);
		assert.equal(carInfo.name, "Tesla Model Y");
		assert.equal(carInfo.imgUrl, "https://example.com/img.jpg");
	});

	it("Should rent a car", async () => {
		await carRentalPlatform.addUser("John", "Doe", { from: user });
		await carRentalPlatform.addCar(
			"Tesla Model Y",
			"https://example.com/img.jpg",
			rentFee,
			saleFee,
			{ from: owner }
		);

		await carRentalPlatform.deposit({ from: user, value: 10000 });

		await carRentalPlatform.checkOut(1, { from: user });

		const userInfo = await carRentalPlatform.getUser(user);
		const carInfo = await carRentalPlatform.getCar(1);
		assert.equal(userInfo.rentedCarId, 1);
		assert.equal(carInfo.status.toString(), "1"); // 1 means "InUse" status
	});
});
