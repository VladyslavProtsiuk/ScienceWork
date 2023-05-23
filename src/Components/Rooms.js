import React from "react";
import { getEvents, addEvent } from "../logic/Connect_db";
import getUser from "../logic/Connect_db";
import "../css/Style.css";
import "../css/Rooms.css";
import { useCookies } from "react-cookie";

class RoomsBody extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			is_all: false,
			num_of_days1: 31,
			num_of_days2: 31,
			events: "",
			filter_states: {
				0: true,
				1: true,
				2: true,
				3: true,
				4: true,
			},
		};
		this.allHandler = this.allHandler.bind(this);
		this.buttonChange = this.buttonChange.bind(this);
		this.handleMonthSelect1 = this.handleMonthSelect1.bind(this);
		this.handleMonthSelect2 = this.handleMonthSelect2.bind(this);
		this.addOptionsToDays1 = this.addOptionsToDays1.bind(this);
		this.addOptionsToDays2 = this.addOptionsToDays2.bind(this);
		this.handleTomorrow = this.handleTomorrow.bind(this);
		this.handleYesterday = this.handleYesterday.bind(this);
		this.openOrClose = this.openOrClose.bind(this);
		this.addEvent = this.addEvent.bind(this);
		this.getEvents = this.getEvents.bind(this);
		this.addEventsToTable = this.addEventsToTable.bind(this);
		this.roomsFilter = this.roomsFilter.bind(this);
		// CheckUser();
	}

	handleToday1() {
		let now = new Date();
		let year = now.getFullYear();
		let month = now.getMonth();
		let day = now.getDate();
		document.querySelector(".year_drop").value = "" + year;
		document.querySelector(".month_drop").value = "" + (month + 1);
		document.querySelector(".day_drop").value = "" + day;
		this.getEvents();
	}

	handleToday2() {
		let now = new Date();
		let year = now.getFullYear();
		let month = now.getMonth();
		let day = now.getDate();
		document.querySelector("#yearEvent").value = "" + year;
		document.querySelector("#MonthEvent").value = "" + (month + 1);
		document.querySelector("#dayEvent").value = "" + day;
	}

	allHandler(event) {
		let filter_states;
		let inputs = [];
		for (let i = 1; i < 6; i++) {
			inputs.push(document.querySelector(`#room${i}_checkbox`));
		}

		if (this.state.isAll) {
			inputs.forEach((elem) => {
				elem.checked = true;
			});
			this.setState({
				isAll: false,
			});
			event.target.innerText = "Жодна";
			filter_states = {
				0: true,
				1: true,
				2: true,
				3: true,
				4: true,
			};
		} else {
			inputs.forEach((elem) => {
				elem.checked = false;
			});
			this.setState({
				isAll: true,
			});
			event.target.innerText = "Усі";
			filter_states = {
				0: false,
				1: false,
				2: false,
				3: false,
				4: false,
			};
		}
		this.setState({ filter_states: filter_states });
		this.getEvents();
		this.roomsFilter();
	}
	roomsFilter() {
		let keys = Object.keys(this.state.filter_states);
		let count = [];
		for (let i = 0; i < keys.length; i++) {
			if (this.state.filter_states[keys[i]]) {
				count.push(keys[i]);
			}
		}
		document.querySelector(".calendar_forground").style.gridTemplateColumns =
			"repeat(" + count.length + ", 1fr)";

		let elements = [];

		if (count.includes("0")) {
			elements.push(document.querySelectorAll(".forground_footer"));
		}
		if (count.includes("1")) {
			elements.push(document.querySelectorAll(".forground_teen"));
		}
		if (count.includes("2")) {
			elements.push(document.querySelectorAll(".forground_child"));
		}
		if (count.includes("3")) {
			elements.push(document.querySelectorAll(".forground_confe"));
		}
		if (count.includes("4")) {
			elements.push(document.querySelectorAll(".forground_mans"));
		}
		let counter = 1;
		for (let i = 0; i < elements.length; i++) {
			for (let j = 0; j < elements[i].length; j++) {
				elements[i][j].style.gridColumn = counter + " / " + (+counter + 1);
			}
			counter++;
		}
	}
	buttonChange() {
		let inputs = [];

		for (let i = 1; i < 6; i++) {
			inputs.push(document.querySelector(`#room${i}_checkbox`).checked);
		}
		let same = true;
		let n = 1;

		let filter_states = {
			0: inputs[0],
			1: inputs[1],
			2: inputs[2],
			3: inputs[3],
			4: inputs[4],
		};
		this.setState({ filter_states: filter_states });
		this.getEvents();
		while (same) {
			if (inputs[0] === inputs[n]) {
				if (n !== 4) {
					n++;
				} else {
					break;
				}
			} else {
				same = false;
			}
		}

		if (same && inputs[0]) {
			this.setState({
				isAll: false,
			});
			document.querySelector(".choose_room0").innerText = "Жодна";
		} else if (same) {
			this.setState({
				isAll: true,
			});
			document.querySelector(".choose_room0").innerText = "Усі";
		}
	}
	addOptionsToDays1() {
		let code_of_days = [];
		for (let i = 0; i < this.state.num_of_days1; i++) {
			code_of_days.push(
				<option
					value={i + 1}
					key={i}
					className={"drop_select drop_select" + (i + 1)}
				>
					{i + 1}
				</option>
			);
		}
		return code_of_days;
	}
	addOptionsToDays2() {
		let code_of_days = [];
		for (let i = 0; i < this.state.num_of_days2; i++) {
			code_of_days.push(
				<option
					value={i + 1}
					key={i}
					className={"drop_select drop_select" + (i + 1)}
				>
					{i + 1}
				</option>
			);
		}
		return code_of_days;
	}
	componentDidMount() {
		this.handleToday1();
		this.handleToday2();
		this.getEvents();
	}

	async getEvents() {
		let day = document.querySelector(".day_drop");
		let month = document.querySelector(".month_drop");
		let dat = new Date(2023, month.value - 1, +day.value);
		dat.setHours(3);
		dat.setMinutes(0);
		dat.setSeconds(0, 0);
		dat = dat.toISOString();
		let avents = await getEvents(dat);
		avents = avents.filter((element) => {
			return this.state.filter_states[element.wrapper_where];
		});
		this.setState({
			events: avents,
		});
		setTimeout(() => {
			this.roomsFilter();
		}, 1);
		this.roomsFilter();
	}

	addEventsToTable() {
		let events = this.state.events;
		let events_code = [];
		for (let i = 0; i < events.length; i++) {
			let room = "";
			let codeName = "";
			switch (events[i].wrapper_where) {
				case "0":
					room = "Підвал";
					codeName = "footer";
					break;
				case "1":
					room = "Юнацька";
					codeName = "teen";
					break;
				case "2":
					room = "Новацька";
					codeName = "child";
					break;
				case "3":
					room = "Конференц-зал";
					codeName = "confe";
					break;
				case "4":
					room = "Мансарда";
					codeName = "mans";
					break;
				default:
					room = "Error";
					codeName = "error";
					break;
			}
			let minuteCodeStart = NaN;
			switch (events[i].minuteStart) {
				case "00":
					minuteCodeStart = 0;
					break;

				case "15":
					minuteCodeStart = 1;
					break;

				case "30":
					minuteCodeStart = 2;
					break;

				case "45":
					minuteCodeStart = 3;
					break;

				default:
					break;
			}
			let minuteCodeEnd = NaN;
			switch (events[i].minuteEnd) {
				case "00":
					minuteCodeEnd = 0;
					break;

				case "15":
					minuteCodeEnd = 1;
					break;

				case "30":
					minuteCodeEnd = 2;
					break;

				case "45":
					minuteCodeEnd = 3;
					break;

				default:
					break;
			}
			let event;
			if (
				+events[i].hourEnd * 4 +
					1 +
					+minuteCodeEnd -
					(+events[i].hourStart * 4 + 1 + +minuteCodeStart) >=
				10
			) {
				event = (
					<div
						key={i}
						className={"forground_event event_tall forground_" + codeName}
						title={room}
						style={{
							gridRow:
								+events[i].hourStart * 4 +
								1 +
								+minuteCodeStart +
								"/" +
								(+events[i].hourEnd * 4 + 1 + +minuteCodeEnd),
						}}
					>
						<div className="event_wrapper">
							<div className="event_title">{room}</div>
							<div className="event_what">{events[i].wrapper_what}</div>
							<div className="event_time">
								{events[i].hourStart +
									":" +
									events[i].minuteStart +
									" - " +
									events[i].hourEnd +
									":" +
									events[i].minuteEnd}
							</div>
						</div>
					</div>
				);
			} else {
				event = (
					<div
						key={i}
						className={"forground_event event_short forground_" + codeName}
						title={room}
						style={{
							gridRow:
								+events[i].hourStart * 4 +
								1 +
								+minuteCodeStart +
								"/" +
								(+events[i].hourEnd * 4 + 1 + +minuteCodeEnd),
						}}
					>
						<div className="event_wrapper">
							<div className="event_what">{events[i].wrapper_what}</div>
							<div className="event_time">
								{events[i].hourStart +
									":" +
									events[i].minuteStart +
									" - " +
									events[i].hourEnd +
									":" +
									events[i].minuteEnd}
							</div>
						</div>
					</div>
				);
			}

			events_code.push(event);
		}
		return events_code;
	}

	handleMonthSelect1() {
		let month = document.querySelector(".month_drop");
		let months = {
			1: 31,
			2: 28,
			3: 31,
			4: 30,
			5: 31,
			6: 30,
			7: 31,
			8: 31,
			9: 30,
			10: 31,
			11: 30,
			12: 31,
		};
		let num_of_days = months[month.value];
		this.setState({ num_of_days1: num_of_days });
		this.getEvents();
	}
	handleMonthSelect2() {
		let month = document.querySelector("#MonthEvent");
		let months = {
			1: 31,
			2: 28,
			3: 31,
			4: 30,
			5: 31,
			6: 30,
			7: 31,
			8: 31,
			9: 30,
			10: 31,
			11: 30,
			12: 31,
		};
		let num_of_days = months[month.value];
		this.setState({ num_of_days2: num_of_days });
	}
	handleTomorrow() {
		let day = document.querySelector(".day_drop");
		let month = document.querySelector(".month_drop");
		if (+day.value === 31 && +month.value === 12) {
			alert("Наступний рік ще не доданий!");
			return;
		}
		if (+day.value === day.children.length) {
			month.value = +month.value + 1;
			this.handleMonthSelect1();
			day.value = 1;
		} else {
			day.value = +day.value + 1;
		}
		this.getEvents();
	}
	async handleYesterday() {
		let day = document.querySelector(".day_drop");
		let month = document.querySelector(".month_drop");
		if (+day.value === 1 && +month.value === 1) {
			alert("Наступний рік ще не доданий!");
			return;
		}
		if (+day.value === 1) {
			month.value = +month.value - 1;
			await this.handleMonthSelect1();
			day.value = +day.children.length;
		} else {
			day.value = +day.value - 1;
		}
		this.getEvents();
	}
	addMonths1() {
		let months = {
			1: "Січень",
			2: "Лютий",
			3: "Березень",
			4: "Квітень",
			5: "Травень",
			6: "Червень",
			7: "Липень",
			8: "Серпень",
			9: "Вересень",
			10: "Жовтень",
			11: "Листопад",
			12: "Грудень",
		};
		let code_of_months = [];
		for (let i = 0; i < Object.keys(months).length; i++) {
			code_of_months.push(
				<option
					value={i + 1}
					key={32 + i}
					className={"drop_select drop_select" + (i + 1)}
				>
					{months[i + 1]}
				</option>
			);
		}
		return code_of_months;
	}
	addMonths2() {
		let months = {
			1: "Січень",
			2: "Лютий",
			3: "Березень",
			4: "Квітень",
			5: "Травень",
			6: "Червень",
			7: "Липень",
			8: "Серпень",
			9: "Вересень",
			10: "Жовтень",
			11: "Листопад",
			12: "Грудень",
		};
		let code_of_months = [];
		for (let i = 0; i < Object.keys(months).length; i++) {
			code_of_months.push(
				<option
					value={i + 1}
					key={32 + i}
					className={"drop_select drop_select" + (i + 1)}
				>
					{months[i + 1]}
				</option>
			);
		}
		return code_of_months;
	}
	addTime() {
		let code_of_time = [];
		for (let i = 0; i < 24; i++) {
			code_of_time.push(
				<div key={45 + i} className="time_hour">
					{i.toString().length === 1 ? "0" + i : i}:00
				</div>
			);
			code_of_time.push(<hr key={70 + i} className="lines_hr" />);
		}
		return code_of_time;
	}
	startHourSelect() {
		let code_of_time = [];
		for (let i = 0; i < 24; i++) {
			code_of_time.push(
				<option
					value={i.toString().length === 1 ? "0" + i : i}
					key={95 + i}
					className={"hourSelect_hourOption hourSelect_hourOption" + i}
				>
					{i.toString().length === 1 ? "0" + i : i}
				</option>
			);
		}
		return code_of_time;
	}
	addMinuteSelect() {
		let code_of_time = [];
		for (let i = 0; i < 4; i++) {
			let value;
			switch (i) {
				case 0:
					value = "00";
					break;
				case 1:
					value = "15";
					break;
				case 2:
					value = "30";
					break;
				case 3:
					value = "45";
					break;
				default:
					value = "00";
			}
			code_of_time.push(
				<option
					value={value}
					key={120 + i}
					className={"hourSelect_hourOption hourSelect_hourOption" + i}
				>
					{value}
				</option>
			);
		}
		return code_of_time;
	}
	openOrClose() {
		let shadow = document.querySelector(".container_shadow");
		let window = document.querySelector(".container_window");
		shadow.classList.toggle("container_shadow-opened");
		window.classList.toggle("container_window-opened");
	}
	addEvent() {
		let hourStart = document.querySelector("#hourStart");
		let minuteStart = document.querySelector("#minuteStart");
		let hourEnd = document.querySelector("#hourEnd");
		let minuteEnd = document.querySelector("#minuteEnd");
		let wrapper_what = document.querySelector(".wrapper_what");
		let wrapper_where = document.querySelector("#wrapper_where");
		let dayEvent = document.querySelector("#dayEvent");
		let MonthEvent = document.querySelector("#MonthEvent");
		let yearEvent = document.querySelector("#yearEvent");
		let date = new Date(
			+yearEvent.value,
			MonthEvent.value - 1,
			+dayEvent.value,
			3
		);
		let sending = {
			hourStart: hourStart.value,
			minuteStart: minuteStart.value,
			hourEnd: hourEnd.value,
			minuteEnd: minuteEnd.value,
			wrapper_what: wrapper_what.value,
			wrapper_where: wrapper_where.value,
			date: date,
		};
		let compare_date = new Date();
		compare_date.setHours(0, 0, 0, 0);
		if (sending.date.getTime() < compare_date.getTime()) {
			alert("Wrong date!");
			return;
		}
		if (sending.hourStart >= sending.hourEnd) {
			alert("Wrong time!");
			return;
		}
		if (
			sending.hourEnd +
				sending.minuteEnd / 60 -
				(sending.hourStart + minuteStart / 60) <
			1
		) {
			alert("Minimal time for event = 1 hour!");
			return;
		}
		if (sending.wrapper_what.replaceAll(" ", "") === "") {
			alert("Wrong name of event!");
			return;
		}
		let eve = this.state.events.filter((element) => {
			return +element.wrapper_where === +sending.wrapper_where;
		});

		eve = eve.filter((element) => {
			return new Date(element.date) === sending.date;
		});
		let hours = [];
		for (let i = sending.hourStart; i <= +sending.hourEnd; i++) {
			hours.push(i);
		}
		let booked_event_start;
		let booked_event_end;
		for (let i = 0; i < eve.length; i++) {
			for (let j = 0; j < hours.length; j++) {
				if (eve[i].hourStart === hours[j]) {
					booked_event_start = hours[j];
				}
			}
			for (let j = 0; j < hours.length; j++) {
				if (eve[i].hourEnd === hours[j]) {
					booked_event_end = eve[i];
				}
			}
		}

		if (booked_event_start) {
			alert("Already booked!");
			return;
		}
		if (booked_event_end) {
			if (booked_event_end.minuteEnd > sending.minuteStart) {
				alert("Already booked!");
				return;
			}
		}

		addEvent(sending);
		this.openOrClose();
		hourStart.value = "12";
		minuteStart.value = "00";
		hourEnd.value = "13";
		minuteEnd.value = "00";
		wrapper_what.value = "";
		wrapper_where.value = "0";
		setTimeout(this.handleToday2, 2);
		this.getEvents();
	}
	render() {
		return (
			<div className="container-rooms">
				<div className="container_navigation">
					<div className="navigation_day">
						День:
						<select
							defaultValue={1}
							onChange={this.getEvents}
							className="day_drop"
						>
							<this.addOptionsToDays1 />
						</select>
					</div>

					<div className="navigation_month">
						Місяць:
						<select
							defaultValue={1}
							onChange={this.handleMonthSelect1}
							className="month_drop"
						>
							<this.addMonths1 />
						</select>
					</div>
					<div className="navigation_year">
						Рік:
						<select defaultValue={2023} className="year_drop">
							<option value="2023" className="drop_select">
								2023
							</option>
						</select>
					</div>
					<div className="navigation_ytt">
						<div className="ytt_yesterday" onClick={this.handleYesterday}>
							{"<"}
						</div>
						<div className="ytt_today" onClick={this.handleToday}>
							Сьогодні
						</div>
						<div className="ytt_tomorrow" onClick={this.handleTomorrow}>
							{">"}
						</div>
					</div>

					<div className="navigation_add" onClick={this.openOrClose}>
						+
					</div>
				</div>
				<div className="container_chooseRoom">
					<div className="choose_room choose_room0" onClick={this.allHandler}>
						Жодна
					</div>
					<input
						type="checkbox"
						defaultChecked
						hidden
						onChange={this.buttonChange}
						name="show_room1"
						id="room1_checkbox"
					/>
					<label htmlFor="room1_checkbox" className="choose_room choose_room1">
						Підвал
					</label>
					<input
						type="checkbox"
						defaultChecked
						hidden
						onChange={this.buttonChange}
						name="show_room2"
						id="room2_checkbox"
					/>
					<label htmlFor="room2_checkbox" className="choose_room choose_room2">
						Юнацька
					</label>
					<input
						type="checkbox"
						defaultChecked
						hidden
						onChange={this.buttonChange}
						name="show_room3"
						id="room3_checkbox"
					/>
					<label htmlFor="room3_checkbox" className="choose_room choose_room3">
						Новацька
					</label>
					<input
						type="checkbox"
						defaultChecked
						hidden
						onChange={this.buttonChange}
						name="show_room4"
						id="room4_checkbox"
					/>
					<label htmlFor="room4_checkbox" className="choose_room choose_room4">
						Конференц-зал
					</label>
					<input
						type="checkbox"
						defaultChecked
						hidden
						onChange={this.buttonChange}
						name="show_room5"
						id="room5_checkbox"
					/>
					<label htmlFor="room5_checkbox" className="choose_room choose_room5">
						Мансарда
					</label>
				</div>
				<div className="container_calendar">
					<div className="calendar_background">
						<this.addTime />
					</div>
					<div className="calendar_forground">
						<this.addEventsToTable />
					</div>
				</div>
				<div className="container_shadow"></div>
				<div className="container_window">
					<div className="window_wrapper">
						<div className="wrapper_top">
							<div className="wrapper_title">Зайняти кімнату</div>
							<div className="wrapper_close" onClick={this.openOrClose}>
								<div className="close_tick close_tick1"></div>
								<div className="close_tick close_tick2"></div>
							</div>
						</div>

						<div className="wrapper_addEvent">
							<div className="addEvent_row addEvent_row1">
								<div className="row_title">Дата</div>
								<div className="row_wrapper">
									<div className="wrapper_combination">
										<div className="row_dayTitle">День:</div>
										<select name="" id="dayEvent" className="row_hourSelect">
											<this.addOptionsToDays2 />
										</select>
									</div>
									<div className="wrapper_combination">
										<div className="row_MonthTitle">Місяць:</div>
										<select
											name=""
											id="MonthEvent"
											onChange={this.handleMonthSelect2}
											className="row_MonthSelect"
										>
											<this.addMonths2 />
										</select>
									</div>
									<div className="wrapper_combination">
										<div className="row_yearTitle">Рік:</div>
										<select name="" id="yearEvent" className="row_yearSelect">
											<option value="2023" className="yearSelect_option">
												2023
											</option>
										</select>
									</div>
								</div>
							</div>
							<div className="addEvent_row addEvent_row2">
								<div className="row_title">Старт:</div>
								<div className="row_wrapper">
									<div className="wrapper_combination">
										<div className="row_hourTitle">Година:</div>
										<select
											name=""
											defaultValue={"12"}
											id="hourStart"
											className="row_hourSelect"
										>
											<this.startHourSelect />
										</select>
									</div>
									<div className="wrapper_combination">
										<div className="row_minuteTitle">Хвилина:</div>
										<select
											name=""
											id="minuteStart"
											className="row_minuteSelect"
											defaultValue={"00"}
										>
											<this.addMinuteSelect />
										</select>
									</div>
								</div>
							</div>
							<div className="addEvent_row addEvent_row3">
								<div className="row_title">Кінець:</div>
								<div className="row_wrapper">
									<div className="wrapper_combination">
										<div className="row_hourTitle">Година:</div>
										<select
											name=""
											defaultValue={"13"}
											id="hourEnd"
											className="row_hourSelect"
										>
											<this.startHourSelect />
										</select>
									</div>
									<div className="wrapper_combination">
										<div className="row_minuteTitle">Хвилина:</div>
										<select
											name=""
											defaultValue={"00"}
											id="minuteEnd"
											className="row_minuteSelect"
										>
											<this.addMinuteSelect />
										</select>
									</div>
								</div>
							</div>
							<div className="addEvent_row addEvent_row4">
								<div className="row_title">Що відбуватиметься:</div>
								<div className="row_wrapper">
									<input type="text" className="wrapper_what" />
								</div>
							</div>
							<div className="addEvent_row addEvent_row5">
								<div className="row_title">Де відбуватиметься:</div>
								<div className="row_wrapper">
									<select name="wrapper_where" id="wrapper_where">
										<option value="0">Підвал</option>
										<option value="1">Юнацька</option>
										<option value="2">Новацька</option>
										<option value="3">Конференц-зал</option>
										<option value="4">Мансарда</option>
									</select>
								</div>
							</div>

							<div className="addEvent_row addEvent_row6">
								<div className="row_submit" onClick={this.addEvent}>
									Зайняти
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function NoLogin() {
	return (
		<div className="container-noLogin">
			<h1>Потрібно увійти для користування</h1>
		</div>
	);
}

function Rooms() {
	const [cookies] = useCookies(["user"]);
	if (Object.keys(cookies).length === 0) {
		return <NoLogin />;
	}
	getUser(cookies.login, cookies.password).then((response) => {
		if (!response) {
			return <NoLogin />;
		}
	});
	return <RoomsBody />;
}
export default Rooms;
