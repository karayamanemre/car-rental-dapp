import React, { Fragment } from "react";
import ReactDOM from "react-dom";

const Overlay = (props) => {
	return (
		<div className='bg-white overflow-y-auto overflow-hidden overscroll-contain z-30 fixed inset-1/4 md:inset-1/4 w-3/4 h-3/4 md:w-1/2 md:h-1/2 rounded-xl p-6 shadow-2xl'>
			<div className='content'>{props.children}</div>
		</div>
	);
};

const BackDrop = (props) => {
	return (
		<div
			onClick={props.close}
			className='bg-black opacity-75 top-0 left-0 z-20 fixed w-full h-full'>
			{props.children}
		</div>
	);
};

const Modal = (props) => {
	return (
		<Fragment>
			{ReactDOM.createPortal(
				<BackDrop close={props.close} />,
				document.getElementById("overlay-root")
			)}
			{ReactDOM.createPortal(
				<Overlay>{props.children}</Overlay>,
				document.getElementById("overlay-root")
			)}
		</Fragment>
	);
};

export default Modal;
