import { React, useState } from "react";
import { deposit, withdrawBalance } from "../Web3Client";

const InputComponent = (props) => {
	const [balance, setBalance] = useState("");

	const creditAccount = async () => {
		alert(
			"Adding " +
				balance +
				" token to your account, this can take a couple of seconds..."
		);
		await deposit(balance);
	};

	const withdraw = async () => {
		alert(
			"Withdrawing " +
				balance +
				" token from your account, this can take a couple of seconds..."
		);
		await withdrawBalance(balance);
	};

	const handleBalanceChange = (event) => {
		setBalance(event.target.value);
	};

	const buttonClicked = () => {
		if (props.type === "credit") {
			creditAccount();
		} else if (props.type === "withdraw") {
			withdraw();
		} else {
			console.warn("Operation is unknown.");
		}
	};

	return (
		<div className='flex flex-col items-center space-y-4 bg-white rounded-md p-4'>
			<p className='text-xl font-bold text-indigo-600'>{props.label}</p>
			<input
				className='border border-indigo-500 rounded-md py-2 px-4 w-full'
				placeholder={props.holder}
				onChange={handleBalanceChange}
			/>
			<button
				onClick={buttonClicked}
				className='w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition-colors'>
				<span className='text-lg font-semibold'>Submit</span>
			</button>
		</div>
	);
};

export default InputComponent;
