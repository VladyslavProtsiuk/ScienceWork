export default async function getUser(login, passwd) {
	let bd = {
		log: login,
		pass: passwd,
	};
	let answer = fetch("http://localhost:3001/getUser", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(bd),
	}).then(async (response) => {
		return await response.text();
	});
	let returnings = JSON.parse(await answer);
	return returnings;
}

export async function getEvents(date) {
	let answer = fetch("http://localhost:3001/getEvents", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ date: new Date(date) }),
	}).then(async (response) => {
		return await response.text();
	});
	let returnings = JSON.parse(await answer);
	return returnings;
}

export async function addEvent(sending) {
	let answer = fetch("http://localhost:3001/addEvent", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ sending: sending }),
	}).then(async (response) => {
		return await response.text();
	});
	let returnings = await answer;
	return returnings;
}
