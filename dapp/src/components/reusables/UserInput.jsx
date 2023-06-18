import { React, useState } from "react";
import { useForm } from "react-hook-form";
import PrimaryButton from "./PrimaryButton";
import {
	editCarMetadata,
	editCarStatus,
	addCar,
	setOwner,
} from "../../Web3Client";

const UserInput = ({ label, name, placeholder }) => {
	const { handleSubmit } = useForm();
	const [item, setItem] = useState("");
	let params;

	const onSubmit = async () => {
		switch (name) {
			case "editCarMetadata":
				params = item.split(", ");
				await editCarMetadata(
					params[0],
					params[1],
					params[2],
					params[3],
					params[4]
				);
				break;
			case "editCarStatus":
				await editCarStatus(item);
				break;
			case "addCar":
				params = item.split(", ");
				await addCar(params[0], params[1], params[2], params[3], params[4]);
				break;
			case "setOwner":
				await setOwner(item);
				break;
			default:
				console.warn("unrecognized field name");
				break;
		}
	};

	const handleChange = (event) => {
		setItem(event.target.value);
	};

	return (
		<form
			className='border-gray-300 shadow-lg rounded-xl p-6 mt-4 border-2'
			onSubmit={handleSubmit(onSubmit)}>
			<div className='space-y-4 text-lg font-semibold'>
				<label className='block'>{label}</label>
				<input
					className='w-full p-2 border-gray-300 rounded-xl border-2'
					placeholder={placeholder}
					onChange={handleChange}
				/>
				<PrimaryButton title='Submit' />
			</div>
		</form>
	);
};

export default UserInput;
