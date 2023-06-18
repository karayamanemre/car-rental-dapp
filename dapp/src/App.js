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

import InfoBox from "./components/InfoBox";
import TopLabel from "./components/TopLabel";
import Status from "./components/Status";
import InputComponent from "./components/InputComponent";
import Header from "./components/Header";
import CarComponent from "./components/CarComponent";
import Modal from "./components/UI/Modal";
import PrimaryButton from "./components/reusables/PrimaryButton";
import AdminActions from "./components/AdminActions";
import DueComponent from "./components/DueComponent";

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
			if (isAUser.address !== emptyAddress) {
				setLoggedIn(true);
				setUserCredit(
					Web3.utils.fromWei(String(isAUser.balance), "ether").toString()
				);
				let userDue = Web3.utils
					.fromWei(String(isAUser.debt), "ether")
					.toString();
				setDue(userDue);
				setUserName(isAUser.name);
				let address = await getUserAddress();
				let owner = await getOwner();
				if (address === owner.toLowerCase()) {
					setIsAdmin(true);
				}
				let carArray = [];
				let carsByStatus = await getCarsByStatus(2);
				carArray.push(...carsByStatus);
				if (isAUser.rentedCarId !== "0") {
					const userCar = await getCar(Number(isAUser.rentedCarId));
					carArray.push(userCar);
				}
				setCars(carArray);
				if (isAUser.rentedCarId !== "0") {
					let rentedCar = await getCar(isAUser.rentedCarId);
					setIsAvailable(`Rented ${rentedCar.name} - ${rentedCar.id}`);
				} else {
					if (userDue !== "0") {
						setIsAvailable("Pay your due to rent again!");
					}
				}
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
		<div>
			<Header loggedIn={loggedIn} />
			{loggedIn ? (
				<>
					<div className='mt-12'>
						<TopLabel userName={userName} />
					</div>
					<div className='grid place-content-center mt-8'>
						{isAdmin && (
							<PrimaryButton
								onClick={() => setShowModal(true)}
								title='Admin Actions'
							/>
						)}
					</div>
					<div className=' mx-auto grid place-content-center  mt-12'>
						<div className='flex flex-row items-center'>
							<div className='grid grid-flow-row md:grid-flow-col  items-center'>
								<InfoBox
									label='BNB Credit'
									number={userCredit}
									icon={<BiWalletAlt />}
								/>
								<InfoBox
									label='BNB Due'
									number={due}
									icon={<GiToken />}
								/>
								<InfoBox
									label='Ride Minutes'
									number={rideMins}
									icon={<BiTimeFive />}
								/>
								<div className='grid place-items-center'>
									<Status status={isAvailable} />
								</div>
							</div>
						</div>
					</div>
					<div className='place-content-center  grid items-center p-4 mt-12'>
						<InputComponent
							holder=' Credit balance'
							label='Credit your account'
							type='credit'
						/>
						<DueComponent label='Pay your due' />
						<InputComponent
							holder=' Withdraw balance'
							label='Withdraw token from your account'
							type='withdraw'
						/>
					</div>
					<div className='grid md:grid-flow-col gap-4 gap-y-12 justify-evenly mt-24 pb-24'>
						{cars.length > 0 ? (
							cars.map((car) => (
								<div key={car.id}>
									<CarComponent
										carStatus={car.status}
										rentFee={car.rentFee}
										saleFee={car.saleFee}
										image={car.imgUrl}
										id={car.id}
										name={car.name}
									/>
								</div>
							))
						) : (
							<div className='text-white text-4xl mb-60'>LOADING CARS...</div>
						)}
					</div>
				</>
			) : (
				<div className='h-screen text-white  w-full'>
					<div className=' p-4 mt-10 grid place-content-center'>
						<h1 className='text-2xl font-bold text-center'>
							Register To Car Rental Platform
						</h1>
						<h3 className='text-center mt-4'>
							Enter your name and surname to register
						</h3>
						<div className='grid mb-8 mt-4 grid-flow-row'>
							<input
								className='p-2 mb-4 text-black rounded-md'
								placeholder='Enter your Name'
								onChange={handleNameChange}
							/>
							<input
								className='p-2 mb-4 text-black rounded-md'
								placeholder='Enter your Surname'
								onChange={handleLastNameChange}
							/>
							<PrimaryButton
								title='Register'
								onClick={() => {
									register(name, lastName);
								}}
							/>
						</div>
					</div>
				</div>
			)}
			{showModal && (
				<Modal close={() => setShowModal(false)}>
					<AdminActions />
				</Modal>
			)}
			<ToastContainer />
		</div>
	);
}

export default App;
