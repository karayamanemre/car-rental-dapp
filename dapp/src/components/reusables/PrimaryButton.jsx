import React from "react";

const PrimaryButton = ({ title, onClick, type }) => {
	return (
		<button
			type={type}
			onClick={onClick}
			className='bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-purple-600 active:from-purple-700 active:via-pink-700 active:to-red-700 py-2 w-40 rounded-lg my-4 m-auto'>
			<span className='text-white text-lg'>{title}</span>
		</button>
	);
};

export default PrimaryButton;
