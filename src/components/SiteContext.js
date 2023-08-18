import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useJwt } from 'react-jwt'

export const Settings = createContext();

export const SiteContext = ({ children }) => {
	const [userPreferences, setUserPreferences] = useState();
	const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
	const { isExpired } = useJwt(cookies['jwt']);

	useEffect(() => {
		if (!isExpired) {
			axios.get('http://localhost:1337/api/user-preferences/for-current-user', {
				headers: {
					Authorization: `Bearer ${cookies['jwt']}`
				}
			}).then(response => {
				if (response.data.length === 0) {
					axios.post('http://localhost:1337/api/user-preferences/create-for-user',
						{}, {
						headers: {
							Authorization: `Bearer ${cookies['jwt']}`
						}
					}).then(response => {
						setUserPreferences(response.data);
					});
				} else {
					setUserPreferences(response.data[0]);
				}
			});
		}
	}, [isExpired]);

	return (
		<Settings.Provider value={{ userPreferences: userPreferences, setUserPreferences: setUserPreferences }}>
			{children}
		</Settings.Provider>
	)
}