import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

function SearchEntries() {
	const [endDate, setEndDate] = useState("");
	const [foodConsumedContains, setFoodConsumedContains] = useState();
	const [minBloodSugar, setMinBloodSugar] = useState(0);
	const [maxBloodSugar, setMaxBloodSugar] = useState(1000);
	const [notesContains, setNotesContains] = useState();
	const [startDate, setStartDate] = useState("");
	const [searchParams, setSearchParams] = useSearchParams();

	const searchOnSubmit = e => {
		e.preventDefault();
		let params = {};

		if (startDate !== '') {
			params['startDate'] = new Date(startDate + " 00:00:00");
		}

		if (endDate !== '') {
			params['endDate'] = new Date(endDate + " 23:59:59");
		}

		if (minBloodSugar) {
			params['minBloodSugar'] = minBloodSugar;
		}

		if (maxBloodSugar !== 1000) {
			params['maxBloodSugar'] = maxBloodSugar;
		}

		if (foodConsumedContains) {
			params["foodConsumedContains"] = foodConsumedContains;
		}

		if (notesContains) {
			params["notesContains"] = notesContains;
		}

		setSearchParams(params);
	}
	return (
		<>
			<span className="fw-bold">Search:</span>
			<form onSubmit={searchOnSubmit}>
				<div className="row">
					<div className="col-sm-3">
						<label htmlFor="startDate">Start Date:&nbsp;</label>
						<input className="form-control" id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
					</div>
					<div className="col-sm-3">
						<label htmlFor="endDate">End Date:&nbsp;</label>
						<input className="form-control" id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
					</div>
					<div className="col-sm-6">
						<div className="row">
							<div className="col">
								<label htmlFor="minBloodSugar">Blood Sugar Range:</label>
							</div>
						</div>
						<div className="row">
							<div className="col-sm-6">
								<input className="form-control" id="minBloodSugar"
									type="number" value={minBloodSugar}
									onChange={e => setMinBloodSugar(e.target.value)}
									placeholder="min" />
							</div>
							<div className="col-sm-6">
								<input className="form-control" id="maxBloodSugar"
									type="number" value={maxBloodSugar}
									onChange={e => setMaxBloodSugar(e.target.value)}
									placeholder="max" />
							</div>
						</div>
					</div>

				</div>
				<div className="row mb-3">
					<div className="col-sm-6">
						<label htmlFor="foodConsumedContains">
							Food Consumed:
						</label>
						<input type="text" className="form-control"
							id="foodConsumedContains"
							value={foodConsumedContains}
							onChange={e => setFoodConsumedContains(e.target.value)}
							placeholder="food consumed"
						/>
					</div>
					<div className="col-sm-6">
						<label htmlFor="notesContains">
							Notes:
						</label>
						<input type="text" className="form-control"
							id="notesContains"
							value={notesContains}
							onChange={e => setNotesContains(e.target.value)}
							placeholder="notes"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<button className="btn btn-info"><FontAwesomeIcon icon={icon({ name: 'magnifying-glass' })} /> Search</button>
					</div>
				</div>
			</form>
		</>
	)
}

export default SearchEntries;