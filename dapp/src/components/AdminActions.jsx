import React from "react";
import UserInput from "./reusables/UserInput";

const AdminActions = () => {
	return (
		<section className='grid gap-6 items-start p-4 bg-gray-100 rounded-md shadow-md'>
			<h2 className='font-semibold text-2xl text-indigo-700'>Admin Actions</h2>
			<UserInput
				label='Edit Car Metadata'
				placeholder='Name, Url, Rent fee, Sale fee'
				name='editCarMetadata'
			/>
			<UserInput
				label='Edit Car Status'
				placeholder='Status (0 -> Retired | 1 -> InUSe | 2 -> Available)'
				name='editCarStatus'
			/>
			<UserInput
				label='Add Car'
				placeholder='Name, Url, Rent fee, Sale fee'
				name='addCar'
			/>
			<UserInput
				label='Set Owner'
				placeholder='New owner address'
				name='setOwner'
			/>
		</section>
	);
};

export default AdminActions;
