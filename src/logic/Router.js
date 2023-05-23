// eslint-disable
import React from "react";
import Login from "../Components/Login";
import Rooms from "../Components/Rooms";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/rooms" element={<Rooms />} />
				</Routes>
			</Router>
		);
	}
}
