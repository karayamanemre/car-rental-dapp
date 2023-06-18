import { React } from "react";
import { makePayment } from "../Web3Client";

const DueComponent = (props) => {
	const paymentClicked = async () => {
		await makePayment();
	};

	return (
		<div className='p-4 bg-gray-200 rounded-md shadow-md'>
			<div className='grid items-center justify-items-center p-8'>
				<p className='text-2xl font-semibold py-2 my-2 text-center text-indigo-800'>
					{props.label}
				</p>
				<button
					onClick={paymentClicked}
					className='bg-indigo-500 hover:bg-indigo-600 py-2 w-48 rounded-lg my-4 transition-colors duration-200 ease-in-out'>
					<span className='text-white text-lg font-bold'>Submit</span>
				</button>
			</div>
		</div>
	);
};

export default DueComponent;
