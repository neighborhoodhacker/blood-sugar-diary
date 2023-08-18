import '../css/App.css'
import axios from 'axios';
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

function Login() {
	const [error, setError] = useState('');
	const [cookies, setCookie, removeCookie] = useCookies(['jwt', 'user']);
	const navigate = useNavigate();
	return (
		<>
			<header className="App-header"><h1>Login</h1></header>
			<main className="container-lg">
				{error ? <>
					<h1>Unable to login.</h1>
					<h4>{error.response.data.error.message}</h4>
					<br />
				</> : <></>}
				<form onSubmit={e => { handleSubmit(e, setError, setCookie, navigate) }}>
					<input type="text" className="form-control" placeholder="Username" id="username" />
					<br />
					<input type="password" className="form-control" placeholder="Password" id="password" />
					<br />
					<button className='btn btn-success'>Login</button>
				</form>
			</main>
		</>
	);
}

const handleSubmit = (e, setError, setCookie, navigate) => {
	e.preventDefault();

	// Request API.
	axios.post('http://localhost:1337/api/auth/local', {
		identifier: (document.querySelector("#username")).value,
		password: (document.querySelector("#password")).value
	})
		.then(response => {
			// Handle success.
			setError('');
			setCookie('user', response.data.user);
			setCookie('jwt', response.data.jwt);
			navigate('/');
		})
		.catch(error => {
			setError(error);
		});
}

export default Login;