import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DiaryEntry from '../components/DiaryEntry'

function DiaryTable(props) {
	const navigate = useNavigate();
	const { page } = useParams();

	let diaryEntries = <></>

	useEffect(() => {
		if (props.entries.length === 0) {
			if (page !== 1) {
				navigate("/diary/1" + window.location.search);
			}
		}
	}, [props.entries]);
	diaryEntries = props.entries.map((entry, index) => <DiaryEntry key={index} entry={entry} deleteEntry={props.deleteEntry} />);
	return (
		<table className="table table-striped table-hover">
			<thead>
				<tr>
					<th>Date</th>
					<th className="text-end">Blood Sugar</th>
				</tr>
			</thead>
			<tbody>
				{diaryEntries}
			</tbody>
		</table >
	);
}

export default DiaryTable;