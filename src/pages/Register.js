import "../css/App.css"
import "../css/Register.css"
import axios from 'axios'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const REGISTRATION_STATE = {
	NOT_COMPLETE: 0,
	SUCCESS: 1,
	FAILURE: 2
};

function Register() {
	const [success, setSuccess] = useState(REGISTRATION_STATE.NOT_COMPLETE);
	const [username, setUsername] = useState('');
	const [error, setError] = useState('');
	return (
		<>
			<header className="App-header"><h1>Register for an Account</h1></header>
			<main className="container-lg">
				{(() => {
					switch (success) {
						case REGISTRATION_STATE.SUCCESS:
							return (<><h1 className="success">Successfully registered user {username}. <NavLink to="/login">Login</NavLink></h1><br /></>);
						case REGISTRATION_STATE.FAILURE:
							return (
								<>
									<h1 className="failure">Failed to register user {username}.</h1>
									<h4>Error: {error.response.data.error.message}</h4>
									<br />
								</>
							);
						default:
							break;
					}
				})()}
				<form id="registration_form" onSubmit={e => { submitForRegistration(e, setSuccess, setUsername, setError) }}>
					<input onBlur={doesUserExist} className="form-control mb-2" type="text" placeholder="username" aria-label="username" pattern="[A-Za-z0-9]{6,32}" id="username" required />
					<span id="onUserError" className="d-block"></span>
					<input onBlur={doesEmailExist} className="form-control mb-2" type="email" placeholder="email" id="email" required />
					<span id="onEmailError" className="d-block"></span>
					<label htmlFor="password">Password must contain at least one letter, number, and special character and be at least 6 characters long.</label>
					<input onBlur={doPasswordsMatch} className="form-control mb-2" type="password" placeholder="password" id="password" required />
					<input onBlur={doPasswordsMatch} className="form-control mb-2" type="password" placeholder="confirm password" id="confirmation" required />
					<span id="onPasswordError" className="d-block"></span>
					<button className="btn btn-success mb-2" type="submit">Register</button>
				</form>
			</main>
		</>
	)
}

async function doesUserExist(e) {
	let userError = document.querySelector('#onUserError');
	if (e.target.value !== "") {
		const doesExist = await axios.get('http://localhost:1337/api/user-management/does-user-exist/' + e.target.value);
		if (doesExist.data) {
			userError.innerHTML = "Username " + e.target.value + " is already in use.";
		} else {
			userError.innerHTML = "";
		}
	} else {
		userError.innerHTML = "";
	}
}

async function doesEmailExist(e) {
	let userError = document.querySelector('#onEmailError');
	if (e.target.value !== "") {
		const doesExist = await axios.get('http://localhost:1337/api/user-management/does-email-exist/' + e.target.value);
		if (doesExist.data) {
			userError.innerHTML = "Email " + e.target.value + " is already in use.";
		} else {
			userError.innerHTML = "";
		}
	} else {
		userError.innerHTML = "";
	}
}

function doPasswordsMatch(event) {
	let password = document.querySelector('#password');
	let confirmation = document.querySelector('#confirmation');
	let passwordError = document.querySelector('#onPasswordError');
	if (confirmation.value !== "" && password.value !== "" && password.value !== confirmation.value) {
		passwordError.innerHTML = "Passwords must match.";
	} else {
		passwordError.innerHTML = "";
	}
}

async function submitForRegistration(e, setSuccess, setUsername, setError) {
	e.preventDefault();
	let username = document.querySelector("#username").value;
	setUsername(username);
	let email = document.querySelector("#email").value;
	let password = document.querySelector("#password").value;
	let confirmation = document.querySelector("#confirmation").value;
	let emailError = document.querySelector('#onEmailError');
	let passwordError = document.querySelector('#onPasswordError');
	if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
		emailError.innerHTML = "Please enter a valid email address.";
		return;
	}
	if (password !== confirmation || password.length < 6 ||
		password.length > 32 || !/[0-9]/.test(password) ||
		!/[a-z]/.test(password) || !/[A-Z]/.test(password) ||
		!/[*.!@$%^&(){}\[\]:;<>,.?\/~_+-=|]/.test(password)) {
		passwordError.innerHTML = "Passwords do not meet requirements.";
		return;
	}
	axios.post('http://localhost:1337/api/auth/local/register', {
		username: username,
		email: email,
		password: password
	})
		.then(response => {
			(document.querySelector("#registration_form")).reset();
			setSuccess(REGISTRATION_STATE.SUCCESS);
		})
		.catch(error => {
			setSuccess(REGISTRATION_STATE.FAILURE);
			setError(error);
			console.log(error);
		});
}

export default Register;