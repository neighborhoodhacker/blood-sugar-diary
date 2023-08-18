import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

function Preference(props) {
	const [edit, setEdit] = useState(false);

	let preferences = props.option.map((value, index) => {
		return (
			<div key={index} className="row mb-2 align-items-center">
				<div className="col-sm-3">
					<label
						htmlFor={props.for[index]}
						style={{ padding: 'calc(.375rem + 1px) calc(.75rem + 1px)', fontSize: '1rem', lineHeight: '1.5' }}
					>{props.title[index]}</label>
				</div>
				<div className="col-sm-9 text-end">
					{edit
						? props.option[index]
						: props.existingValue[index]
					}
				</div>
			</div>
		)
	});

	return (
		<div className="row">
			<div className="col-sm-11">
				{preferences}
			</div>
			<div className="col-sm-1">
				{edit
					? <NavLink to="#"
						onClick={e => {
							setEdit(false);
							props.save();
						}}
						style={{ textDecoration: 'none', color: 'black' }}
					>
						<FontAwesomeIcon icon={icon({ name: 'floppy-disk', style: 'regular' })} />
						&nbsp;save
					</NavLink>
					: <NavLink to="#"
						onClick={e => setEdit(true)}
						style={{ textDecoration: 'none', color: 'black' }}
					>
						<FontAwesomeIcon icon={icon({ name: 'pencil' })} />
						&nbsp;edit
					</NavLink>
				}
			</div>
		</div>
	)
}

export default Preference;