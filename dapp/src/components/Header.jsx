import { React, useEffect, useState } from "react";
import { getUserAddress } from "../Web3Client";
import { toast } from "react-toastify";

const Header = (props) => {
	const [copied, setCopied] = useState(false);
	const [userAddress, setUserAddress] = useState("..................");

	useEffect(() => {
		const getAddress = async () => {
			let address = await getUserAddress();
			setUserAddress(address);
		};
		getAddress();
	}, []);

	const handleCopy = () => {
		navigator.clipboard
			.writeText(userAddress)
			.then(() => {
				setCopied(true);
				toast.success("Copied to clipboard!");
				setTimeout(() => {
					setCopied(false);
				}, 1000);
			})
			.catch((error) => {
				console.error("Error copying text to clipboard:", error);
				toast.error("Failed to copy text to clipboard!");
			});
	};

	const short_address = () => {
		return userAddress.substring(0, 6) + "..." + userAddress.slice(-3);
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	function handleScroll() {
		const body = document.querySelector("body");
		if (window.scrollY > 0) {
			body.classList.add("scrolled");
		} else {
			body.classList.remove("scrolled");
		}
	}

	return (
		<>
			<header className='sticky top-0 z-40 backdrop-blur-lg p-4 flex justify-between items-center transition-all duration-200 ease-in-out'>
				<div className='ml-4 text-white font-bold text-2xl'>
					Car Rental Platform
				</div>
				{props.loggedIn ? (
					<div
						className='text-white hover:text-black hover:bg-gray-200 cursor-pointer font-bold text-lg rounded-md p-2 transition-colors duration-200 ease-in-out'
						onClick={handleCopy}>
						{!copied ? short_address(userAddress) : "Copied to clipboard"}
					</div>
				) : (
					<div className='text-lg text-white font-semibold grid-flow-col grid gap-4'>
						<h3 className='cursor-pointer hover:underline'>0x000...000</h3>
					</div>
				)}
			</header>
		</>
	);
};

export default Header;
