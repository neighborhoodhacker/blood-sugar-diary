import '../css/App.css'
import DiaryTable from '../components/DiaryTable'
import CreateEntry from '../components/CreateEntry'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useJwt } from 'react-jwt'
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import SearchEntries from '../components/SearchEntries'

function Diary() {
	const [entries, setEntries] = useState([]);
	const [entryCount, setEntryCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [viewPerPage, setViewPerPage] = useState(10);
	const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
	const { page } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const { decodedToken, isExpired } = useJwt(cookies['jwt']);
	const navigate = useNavigate();

	const updateEntries = () => {
		setLoading(true);
		axios.get("http://localhost:1337/api/diary-entries/for-current-user/"
			+ page + "/" + viewPerPage + (searchParams.toString()
				? '?' + searchParams.toString() : ''), {
			headers: {
				Authorization: `Bearer ${cookies['jwt']}`
			}
		}).then(response => {
			setEntries(response.data);
			setLoading(false);
		});
		axios.get("http://localhost:1337/api/diary-entries/for-current-user-count"
			+ (searchParams.toString() ? '?' + searchParams.toString() : ''), {
			headers: {
				Authorization: `Bearer ${cookies['jwt']}`
			}
		}).then(response => {
			setEntryCount(response.data);
		});
	}

	const deleteEntry = (id) => {
		axios.delete('http://localhost:1337/api/diary-entries/delete-for-user/' + id, {
			headers: {
				Authorization: `Bearer ${cookies['jwt']}`,
				'Content-Type': 'application/json'
			},
		}).then(() => {
			updateEntries();
		});
	}



	if (isExpired || cookies['user'] === '') {
		navigate('/login');
	}

	useEffect(() => {
		updateEntries();
	}, [page, searchParams, viewPerPage]);

	return (
		<>
			<header className="App-header"><h1>Diary</h1></header>
			<main className="container-lg">
				<CreateEntry updateEntries={updateEntries} />
				<SearchEntries />
				{loading
					?
					<div className="row">
						<div className="col text-center">
							<FontAwesomeIcon className="my-2" icon={icon({ name: 'spinner' })} spin />
						</div>
					</div>
					: <DiaryTable jwt={cookies['jwt']} entries={entries} entryCount={entryCount} deleteEntry={deleteEntry} />
				}
				<div className="row mb-2">
					<div className="col">
						<select id="viewPerPage" value={viewPerPage} onChange={e => {
							setViewPerPage(e.target.value)
						}}>
							<option value="10">10</option>
							<option value="50">50</option>
							<option value="100">100</option>
						</select>
						<label htmlFor="viewPerPage">&nbsp;Show Per Page</label>
					</div>
					<div className="col text-end">

						{page > 1 ? <>
							<NavLink className="link-dark" to={"/diary/1" + window.location.search}>
								<FontAwesomeIcon icon={icon({ name: 'angles-left' })} />
							</NavLink>
							<NavLink className="link-dark" to={"/diary/" + (page - 1) + window.location.search}>
								<FontAwesomeIcon icon={icon({ name: 'angle-left' })} />
							</NavLink>&nbsp;
							<NavLink to={"/diary/" + (page - 1) + window.location.search}>
								{(page - 1)}
							</NavLink>
						</> : <>
							<FontAwesomeIcon className="text-secondary" icon={icon({ name: 'angles-left' })} />
							<FontAwesomeIcon className="text-secondary" icon={icon({ name: 'angle-left' })} />
						</>}
						&nbsp;
						{page}
						&nbsp;
						{entryCount > (page * viewPerPage) ? <>
							<NavLink to={"/diary/" + (+page + 1) + window.location.search}>
								{(+page + 1)}
							</NavLink>&nbsp;
							<NavLink className="link-dark" to={"/diary/" + (+page + 1) + window.location.search}>
								<FontAwesomeIcon icon={icon({ name: 'angle-right' })} />
							</NavLink>
							<NavLink className="link-dark" to={"/diary/" + (Math.ceil(entryCount / viewPerPage)) + window.location.search}>
								<FontAwesomeIcon icon={icon({ name: 'angles-right' })} />
							</NavLink>
						</> : <>
							<FontAwesomeIcon className="text-secondary" icon={icon({ name: 'angle-right' })} />
							<FontAwesomeIcon className="text-secondary" icon={icon({ name: 'angles-right' })} />
						</>}
					</div>
				</div>
			</main>
		</>
	);
}

export default Diary;