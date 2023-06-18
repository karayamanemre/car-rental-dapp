import { useState, useEffect } from "react";
import Web3 from "web3";
import {
	getUserAddress,
	register,
	getCarsByStatus,
	getCar,
	getOwner,
	login,
} from "./Web3Client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiWalletAlt, BiTimeFive } from "react-icons/bi";
import { GiToken } from "react-icons/gi";

import Header from "./components/Header";

function App() {
	const [showModal, setShowModal] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);
	const [userName, setUserName] = useState("");
	const [cars, setCars] = useState([]);
	const [name, setName] = useState({});
	const [lastName, setLastName] = useState({});
	const [isAdmin, setIsAdmin] = useState(false);
	const [userCredit, setUserCredit] = useState("0");
	const [due, setDue] = useState("0");
	const [isAvailable, setIsAvailable] = useState("Can Rent");
	const [rideMins, setRideMins] = useState("0");

	const emptyAddress = "0x0000000000000000000000000000000000000000";

	useEffect(() => {
		const handleInit = async () => {
			let isAUser = await login();
			// If the user exists
			if (isAUser.address !== emptyAddress) {
				setLoggedIn(true); //login user
				// set user credits
				setUserCredit(
					Web3.utils.fromWei(String(isAUser.balance), "ether").toString()
				);
				// set user due
				let userDue = Web3.utils
					.fromWei(String(isAUser.debt), "ether")
					.toString();
				setDue(userDue);
				// set user name
				setUserName(isAUser.name);
				// get the user address
				let address = await getUserAddress();
				// get the owner
				let owner = await getOwner();
				// see if the user is the owner
				if (address === owner.toLowerCase()) {
					setIsAdmin(true);
				}
				// get cars
				let carArray = [];
				let carsByStatus = await getCarsByStatus(2);
				carArray.push(...carsByStatus);
				if (isAUser.rentedCarId !== "0") {
					const userCar = await getCar(Number(isAUser.rentedCarId));
					carArray.push(userCar);
				}
				setCars(carArray);
				// update user status
				if (isAUser.rentedCarId !== "0") {
					let rentedCar = await getCar(isAUser.rentedCarId);
					setIsAvailable(`Rented ${rentedCar.name} - ${rentedCar.id}`);
				} else {
					console.warn(userDue);
					if (userDue !== "0") {
						setIsAvailable("Pay your due to rent again!");
					}
				}
				// adjust ride time
				let rideMins = "0";
				if (isAUser.rentedCarId !== "0") {
					rideMins = Math.floor(
						(Math.floor(Date.now() / 1000) - isAUser.start) / 60
					).toString();
				}
				setRideMins(rideMins);
			}
		};

		handleInit();
	}, []);

	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const handleLastNameChange = (event) => {
		setLastName(event.target.value);
	};

	return (
		<div className='App'>
			<Header loggedIn={loggedIn} />
			<main></main>
			<ToastContainer />
		</div>
	);
}

export default App;
