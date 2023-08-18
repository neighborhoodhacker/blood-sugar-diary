import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

function CreateEntry(props) {
	const [afterMeal, setAfterMeal] = useState(false);
	const [bloodSugar, setBloodSugar] = useState(130);
	const [carbIntake, setCarbIntake] = useState(0);
	const [feel, setFeel] = useState();
	const [date, setDate] = useState("2000-01-01");
	const [time, setTime] = useState("00:00");
	const [weight, setWeight] = useState(0);
	const [cookies, setCookie, removeCookie] = useCookies(['jwt']);

	useEffect(() => {
		const currentDate = new Date();
		setDate(
			currentDate.getFullYear() + '-' +
			(currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)) + '-' +
			(currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate())
		);

		setTime((currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours())
			+ ':' + (currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes()));
		axios.get("http://localhost:1337/api/diary-entries/for-current-user/1/1", {
			headers: {
				Authorization: `Bearer ${cookies['jwt']}`
			}
		}).then(response => {
			setWeight(response.data[0].weight);
		});

		let faces = document.querySelectorAll("[class*=fa-face]");
		faces.forEach(face => {
			face.addEventListener('click', () => {
				setFeel(face.getAttribute('data-value'));
			});
		});
	}, []);

	const createEntryOnSubmit = (e) => {
		e.preventDefault();

		let data = {
			beforeAfter: afterMeal,
			bloodSugar: bloodSugar,
			date: (new Date(date + " " + time)),
			notes: (document.querySelector('#notes')).value,
			weight: weight,
			foodConsumed: (document.querySelector('#foodConsumed') ? document.querySelector('#foodConsumed').value : ''),
			carbIntake: (document.querySelector('#carbIntake') ? document.querySelector('#carbIntake').value : 0),
		};

		if (feel) {
			data['feel'] = feel
		}

		axios.post('http://localhost:1337/api/diary-entries/create-for-user',
			data,
			{
				headers: {
					Authorization: `Bearer ${cookies['jwt']}`,
					'Content-Type': 'application/json'
				},
			}).then(() => {
				props.updateEntries();
				setFeel();
				setAfterMeal(false);
				setBloodSugar(130)
			});
	}

	return (
		<>
			<span className="fw-bold">New Entry:</span>
			<form onSubmit={createEntryOnSubmit}>
				<div className="row">
					<div className="col-sm-3"><label htmlFor="date">Date checked: </label><input className="form-control" type="date" id="date" value={date} onChange={e => setDate(e.target.value)} /></div>
					<div className="col-sm-3"><label htmlFor="time">Time checked: </label><input className="form-control" type="time" id="time" value={time} onChange={e => setTime(e.target.value)} /></div>
					<div className="col-sm-3"><label htmlFor="bloodSugar">Blood sugar (mg/dL): </label><input className="form-control " type="number" id="bloodSugar" value={bloodSugar} onChange={e => setBloodSugar(e.target.value)} /></div>
					<div className="col-sm-3"><label htmlFor="weight">Weight (in lbs): </label><input className="form-control " type="number" id="weight" value={weight} onChange={e => setWeight(e.target.value)} /></div>
				</div>
				<div className="row">
					<div className="col-sm-9"><label htmlFor="notes">Notes: </label><textarea className="form-control" id="notes" /></div>
					<div className="col-sm-3"><label htmlFor="feel">How do you feel: </label>
						<p>
							{
								feel === '100'
									? <FontAwesomeIcon icon={icon({ name: "face-laugh-beam", style: "solid" })} size="3x" style={{ cursor: 'pointer' }} data-value={100} />
									: <FontAwesomeIcon icon={icon({ name: "face-laugh-beam", style: "regular" })} size="3x" style={{ cursor: 'pointer' }} data-value={100} />
							}&nbsp;&nbsp;
							{
								feel === '75'
									? <FontAwesomeIcon icon={icon({ name: "face-smile", style: "solid" })} size="3x" style={{ cursor: 'pointer' }} data-value={75} />
									: <FontAwesomeIcon icon={icon({ name: "face-smile", style: "regular" })} size="3x" style={{ cursor: 'pointer' }} data-value={75} />
							}&nbsp;&nbsp;
							{
								feel === '50'
									? <FontAwesomeIcon icon={icon({ name: "face-meh", style: "solid" })} size="3x" style={{ cursor: 'pointer' }} data-value={50} />
									: <FontAwesomeIcon icon={icon({ name: "face-meh", style: "regular" })} size="3x" style={{ cursor: 'pointer' }} data-value={50} />
							}&nbsp;&nbsp;
							{
								feel === "25"
									? <FontAwesomeIcon icon={icon({ name: "face-frown", style: "solid" })} size="3x" style={{ cursor: 'pointer' }} data-value={25} />
									: <FontAwesomeIcon icon={icon({ name: "face-frown", style: "regular" })} size="3x" style={{ cursor: 'pointer' }} data-value={25} />
							}&nbsp;&nbsp;
							{
								feel === '0'
									? <FontAwesomeIcon icon={icon({ name: "face-sad-tear", style: "solid" })} size="3x" style={{ cursor: 'pointer' }} data-value={0} />
									: <FontAwesomeIcon icon={icon({ name: "face-sad-tear", style: "regular" })} size="3x" style={{ cursor: 'pointer' }} data-value={0} />
							}&nbsp;&nbsp;
						</p>
					</div>
				</div>
				<div className="row">
				</div>
				<div className="row my-3">
					<div className="col">
						<div className="form-check form-switch">
							<label className="form-check-label" htmlFor="flexSwitchCheckDefault">After meal?</label>
							<input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={afterMeal} onChange={e => setAfterMeal(e.target.checked)} />
						</div>
					</div>
				</div>
				{afterMeal ?
					<div className="row mb-3">
						<div className="col-sm-6">
							<label htmlFor="carbIntake">Carb. intake (in grams): </label>
							<input type="number" className="form-control" id="carbIntake"
								value={carbIntake}
								onClick={e => { setCarbIntake(e.target.value) }}
							/>
						</div>
						<div className="col-sm-6"><label htmlFor="foodConsumed">Food consumed: </label><textarea className="form-control" id="foodConsumed" /></div>
					</div>
					:
					''
				}
				<div className="row mb-3">
					<div className="col">
						<button className="btn btn-success" type="submit"><FontAwesomeIcon icon={icon({ name: 'note-sticky', style: "regular" })} /> Add Entry</button>
					</div>
				</div>
			</form>
		</>
	)
}

export default CreateEntry;