import React from "react";
import PrimaryButton from "./reusables/PrimaryButton";

const CarDetailsModal = ({ carName, carPic, closeModal }) => {
	return (
		<div className='relative bg-white rounded-lg shadow-md w-[50vw] h-[50vh] p-6 absolute top-[20vh] left-[25vw] flex flex-col items-center justify-between'>
			<span
				onClick={() => closeModal()}
				className='absolute top-4 right-4 text-lg text-red-500 hover:text-red-600 cursor-pointer'>
				X
			</span>
			<div className='flex flex-col items-center space-y-4'>
				<h1 className='text-2xl font-bold text-indigo-700'>{carName}</h1>
				<img
					src={carPic}
					alt='car image'
					className='w-80 h-60 rounded-lg object-cover'
				/>
			</div>
			<PrimaryButton title='Activate Car' />
		</div>
	);
};

export default CarDetailsModal;
