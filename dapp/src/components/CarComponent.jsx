import React from "react";
import { checkOut, checkIn } from "../Web3Client";
import Web3 from "web3";

const CarComponent = (props) => {
	const checkOutCar = async () => {
		await checkOut(props.id);
	};

	const checkInCar = async () => {
		await checkIn(props.id);
	};

	return (
		<div className='border-2 border-indigo-500 p-4 rounded-lg shadow-md bg-gray-100 flex flex-col items-center space-y-4'>
			<img
				src={props.image}
				alt='car image'
				className='w-80 h-60 rounded-md object-cover'
			/>
			<p className='w-80 text-black text-lg text-center mt-8'>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
				odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
				quis sem at nibh elementum imperdiet.
			</p>
			<div className='text-indigo-700 space-y-4 text-xl mt-4 text-center'>
				<p>{props.name}</p>
			</div>
			<div className='text-indigo-700 space-y-4 text-lg mt-4 text-center'>
				<p>Car Fee: {Web3.utils.fromWei(props.rentFee)} BNB</p>
				<p>Sale Fee: {Web3.utils.fromWei(props.saleFee)} BNB</p>
				<p className={props.carStatus == 2 ? "text-green-500" : "text-red-300"}>
					{props.carStatus == 2 ? "Active" : "Inactive"}
				</p>
			</div>
			<div className='flex flex-row justify-evenly mt-10'>
				<button
					onClick={() => checkOutCar()}
					className='p-2 bg-gradient-to-r  from-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-500 rounded-lg text-white text-sm text-center font-semibold w-32'>
					Check out
				</button>
				<button
					onClick={() => checkInCar(props.id)}
					className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-500 rounded-lg text-white text-sm text-center font-semibold w-32'>
					Check in
				</button>
			</div>
		</div>
	);
};

export default CarComponent;
