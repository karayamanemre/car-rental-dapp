import React from "react";

const TopLabel = ({ userName }) => {
	return (
		<div className='flex items-center h-full bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-md'>
			<h1 className='m-auto text-3xl font-semibold text-center text-white'>
				Welcome! {userName}
			</h1>
		</div>
	);
};

export default TopLabel;
