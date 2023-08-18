import '../css/App.css'
import axios from 'axios'
import { useContext } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useJwt } from 'react-jwt'
import Preference from '../components/Preference'
import { Settings } from '../components/SiteContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

function UserPreferences() {
	const navigate = useNavigate();
	const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
	const settingsContext = useContext(Settings);
	const { isExpired } = useJwt(cookies['jwt']);

	const savePic = () => {
		var formData = new FormData();
		var imagefile = document.querySelector('#profilePic');
		if (imagefile.files[0]) {
			formData.append("files", imagefile.files[0]);
			axios.post('http://localhost:1337/api/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${cookies['jwt']}`
				}
			}).then(response => {
				axios.post('http://localhost:1337/api/user-preferences/update-for-user', {
					profilePic: response.data[0],
				}, {
					headers: {
						Authorization: `Bearer ${cookies['jwt']}`
					}
				}).then(response => {
					settingsContext.setUserPreferences(response.data);
				});
			});
		}
	}

	const saveDiabetesType = () => {
		if (document.querySelector('#diabetesType').value) {
			axios.post('http://localhost:1337/api/user-preferences/update-for-user', {
				diabetesType: document.querySelector('#diabetesType').value,
			}, {
				headers: {
					Authorization: `Bearer ${cookies['jwt']}`
				}
			}).then(response => {
				settingsContext.setUserPreferences(response.data);
			});
		}
	}

	const saveBirthday = () => {
		if (document.querySelector('#birthday').value) {
			axios.post('http://localhost:1337/api/user-preferences/update-for-user', {
				birthday: document.querySelector('#birthday').value,
			}, {
				headers: {
					Authorization: `Bearer ${cookies['jwt']}`
				}
			}).then(response => {
				settingsContext.setUserPreferences(response.data);
			});
		}
	}

	const saveWeight = () => {
		let data = {}

		if (document.querySelector('#startingWeight').value) {
			data['startingWeight'] = document.querySelector('#startingWeight').value;
		}

		if (document.querySelector('#startingWeightDate').value) {
			data['startingWeightDate'] = document.querySelector('#startingWeightDate').value;
		}

		if (document.querySelector('#targetWeight').value) {
			data['targetWeight'] = document.querySelector('#targetWeight').value;
		}

		axios.post('http://localhost:1337/api/user-preferences/update-for-user', data, {
			headers: {
				Authorization: `Bearer ${cookies['jwt']}`
			}
		}).then(response => {
			settingsContext.setUserPreferences(response.data);
		});
	}

	if (isExpired || cookies['user'] === '') {
		navigate('/login');
	}

	return (
		<>
			<header className="App-header"><h1>User Preferences</h1></header>
			<main className="container-lg border border-light-subtle rounded p-5">
				<Preference option={
					[
						(<input className="form-control" id="profilePic"
							type="file" accept="image/*" />)
					]
				} title={['Profile Pic']} for={['profilePic']}
					existingValue={[
						(() => {
							if (settingsContext.userPreferences && settingsContext.userPreferences.profilePic) {
								return (
									<>
										<img
											src={"http://localhost:1337" + settingsContext.userPreferences.profilePic.formats.thumbnail.url}
											alt="Profile Pic"
											style={{ height: '75px', width: '75px', borderRadius: '37.5px', objectFit: 'cover', objectPosition: '50%', }}
										/>&nbsp;&nbsp;
									</>
								)
							} else {
								return (
									<>
										<FontAwesomeIcon icon={icon({ name: 'user', style: 'regular' })} size='xl' />&nbsp;&nbsp;
									</>
								)
							}
						})()]
					} save={savePic} />
				<hr />
				<Preference option={
					[
						(<select className="form-select" id="diabetesType">
							<option value=""></option>
							<option value="1">Type 1</option>
							<option value="2">Type 2</option>
						</select>)
					]
				} title={['Diabetes Type']} for={['diabetesType']}
					existingValue={[(() => {
						if (settingsContext.userPreferences && settingsContext.userPreferences.diabetesType) {
							return 'Type ' + settingsContext.userPreferences.diabetesType
						} else {
							return '—'
						}
					})()]
					} save={saveDiabetesType} />
				<hr />
				<Preference option={
					[
						(<input type="date" className="form-control" id="birthday" />)
					]
				} title={['Birthday']} for={['birthday']}
					existingValue={[(() => {
						if (settingsContext.userPreferences && settingsContext.userPreferences.birthday) {
							return (new Date(settingsContext.userPreferences.birthday + ' 00:00:00')).toLocaleDateString();
						} else {
							return '—/—/— ';
						}
					})()]
					} save={saveBirthday} />
				<hr />
				<Preference option={
					[
						(<input type="number" className="form-control" id="startingWeight" defaultValue={
							(() => {
								if (settingsContext.userPreferences && settingsContext.userPreferences.startingWeight) {
									return settingsContext.userPreferences.startingWeight;
								}
							})()
						} />),
						(<input type="date" className="form-control" id="startingWeightDate" defaultValue={
							(() => {
								if (settingsContext.userPreferences && settingsContext.userPreferences.startingWeightDate) {
									return settingsContext.userPreferences.startingWeightDate;
								}
							})()
						} />),
						(<input type="number" className="form-control" id="targetWeight" defaultValue={
							(() => {
								if (settingsContext.userPreferences && settingsContext.userPreferences.targetWeight) {
									return settingsContext.userPreferences.targetWeight;
								}
							})()
						} />)
					]
				} title={['Starting Weight',
					'Starting Weight Date Measured',
					'Target Weight']}
					for={['startingWeight',
						'startingWeightDate',
						'targetWeight']}
					existingValue={
						(() => {
							let weight = [];
							if (settingsContext.userPreferences && settingsContext.userPreferences.startingWeight) {
								weight.push(settingsContext.userPreferences.startingWeight);
							} else {
								weight.push('—');
							}
							if (settingsContext.userPreferences && settingsContext.userPreferences.startingWeightDate) {
								weight.push((new Date(settingsContext.userPreferences.startingWeightDate + ' 00:00:00')).toLocaleDateString());
							} else {
								weight.push('—/—/—');
							}
							if (settingsContext.userPreferences && settingsContext.userPreferences.targetWeight) {
								weight.push(settingsContext.userPreferences.targetWeight);
							} else {
								weight.push('—');
							}
							return weight;
						})()
					} save={saveWeight} />
			</main>
		</>
	);
}

export default UserPreferences;