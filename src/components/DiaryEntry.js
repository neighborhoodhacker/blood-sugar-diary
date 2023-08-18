import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../css/DiaryEntry.css'

function DiaryEntry(props) {
	const [showHide, setShowHide] = useState(false);

	const toggleView = (e) => {
		setShowHide(!showHide);
	}

	useEffect(() => {
		setShowHide(false);
	}, [props.entry]);

	return (
		<tr>
			<td colSpan="2">
				<div className="modal fade" id={"deleteModal" + props.entry.id} tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h1 className="modal-title fs-5" id="deleteModalLabel">Delete Entry</h1>
								<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div className="modal-body">
								Do you wish to delete this entry?
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary"
									data-bs-dismiss="modal">Cancel</button>
								<button type="button" className="btn btn-primary"
									onClick={e => props.deleteEntry(props.entry.id)}
									data-bs-dismiss="modal"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="row" onClick={toggleView}>
					<div className="col">
						<div style={showHide ? { transform: "rotate(90deg)" } : { transform: "rotate(0deg)" }}
							className="d-inline-block toggle me-1">
							<FontAwesomeIcon icon={icon({ name: 'angle-right' })} />
						</div>
						{(new Date(props.entry.date)).toLocaleString().replace(":00 ", " ")}
					</div>
					<div className="text-end col">{props.entry.bloodSugar}</div>
				</div>
				{
					showHide ? (
						<>
							<div className="row mt-1">
								<div className="col-sm-2">
									<div className="row">
										<div className="col">
											<div className="row">
												<div className="col">
													<span className="fw-bold">Weight:</span> {props.entry.weight === 0 ? '—' : props.entry.weight}
												</div>
											</div>
											<div className="row">
												<div className="col">
													<span className="fw-bold">You Felt:</span> {
														(() => {
															switch (props.entry.feel) {
																case 100:
																	return <FontAwesomeIcon icon={icon({ name: "face-laugh-beam", style: "regular" })} size="xl" />
																	break;
																case 75:
																	return <FontAwesomeIcon icon={icon({ name: "face-smile", style: "regular" })} size="xl" />
																	break;
																case 50:
																	return <FontAwesomeIcon icon={icon({ name: "face-meh", style: "regular" })} size="xl" />
																	break;
																case 25:
																	return <FontAwesomeIcon icon={icon({ name: "face-frown", style: "regular" })} size="xl" />
																	break;
																case 0:
																	return <FontAwesomeIcon icon={icon({ name: "face-sad-tear", style: "regular" })} size="xl" />
																	break;
																default:
																	return <>—</>
																	break;
															}
														})()
													}
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-sm-9"><span className="fw-bold">Notes:</span> {props.entry.notes === '' ? '—' : props.entry.notes}</div>
								<div className="col-sm-1 text-end">
									<NavLink to="#">
										<FontAwesomeIcon
											className="text-secondary dark-on-hover"
											icon={icon({ name: 'trash' })}
											data-bs-toggle="modal"
											data-bs-target={"#deleteModal" + props.entry.id} />
									</NavLink>
								</div>
							</div>
							{props.entry.beforeAfter ? (
								<div className="row">
									<div className="col-sm-2"><span className="fw-bold">Carb. Intake:</span> {props.entry.carbIntake === 0 ? '—' : props.entry.carbIntake}</div>
									<div className="col-sm-10"><span className="fw-bold">Food Consumed:</span> {props.entry.foodConsumed === '' ? '—' : props.entry.foodConsumed}</div>
								</div>
							) : ''}
						</>) : ''
				}
			</td>
		</tr >
	);
}

export default DiaryEntry;