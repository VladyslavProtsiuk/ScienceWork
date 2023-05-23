/* eslint-disable react/jsx-pascal-case */
import React from "react";
import "../css/Style.css";
import "../css/Login.css";
import getUser from "../logic/Connect_db";
import logo from "../img/lileyka-green.png";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Login() {
	const navigate = useNavigate();
	const [, setCookie] = useCookies(["Login"]);
	async function HandleSubmit(event) {
		event.preventDefault();

		let login = event.target.login.value;
		let passwd = event.target.passwd.value;

		console.log(login);
		console.log(passwd);

		if (login === "" || passwd === "") {
			alert("enter smth");
			return;
		}
		let user = await getUser(login, passwd);

		if ((await user) === undefined) {
			alert("Wrong login or passwd");
			return;
		}

		if (await !user) {
			alert("Login failed");
			return;
		}
		setCookie("login", login, { maxAge: 24 * 60 * 60 });
		setCookie("password", passwd, { maxAge: 24 * 60 * 60 });
		navigate("/rooms");
	}

	return (
		<div className="container-login">
			<form onSubmit={HandleSubmit} className="container_authen">
				<div className="authen_logo">
					<img src={logo} alt="Лілейка" className="logo_image" />
				</div>
				<div className="authen_login">
					<div className="login_wrapper">
						<div className="wrapper_text">Your login</div>
						<input type="text" name="login" className="wrapper_login" />
					</div>
				</div>
				<div className="authen_passwd">
					<div className="passwd_wrapper">
						<div className="wrapper_text">Your password</div>
						<input type="password" name="passwd" className="wrapper_passwd" />
					</div>
				</div>

				<div className="authen_btn">
					<div className="btn_wrapper">
						<button type="submit" className="wrapper_btn">
							Login
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
export default Login;
