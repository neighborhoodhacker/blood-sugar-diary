import { useContext, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { Settings } from '../components/SiteContext';

function Logout() {
	const settingsContext = useContext(Settings);
	const [cookies, setCookie, removeCookie] = useCookies(['jwt', 'user']);
	const navigate = useNavigate();
	useEffect(() => {
		settingsContext.setUserPreferences({});
		removeCookie('jwt');
		removeCookie('user');
		navigate('/');
	}, []);
	return (
		<>
			<h1>You have been logged out. Redirecting...</h1>
		</>
	);
}

export default Logout;