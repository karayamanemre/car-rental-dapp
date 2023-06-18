import React from "react";

const Status = (props) => {
	let state;
	props.status === "Can Rent"
		? (state = `border backdrop-blur p-4 rounded-xl shadow-lg border-green-500 m-2 shadow-green-500 text-white font-bold text-xl`)
		: (state =
				"border p-4 rounded-xl shadow-lg border-red-500 m-2 shadow-red-500 text-white font-bold text-xl");
	return (
		<div className={state}>
			<div className='text-center'>
				{props.status ? props.status : "Unavailable"}
			</div>
		</div>
	);
};

export default Status;
