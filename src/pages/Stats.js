import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, FormCheck, FormControl, FormLabel, Row } from "react-bootstrap";
import { useCookies } from "react-cookie"
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import '../css/Stats.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

function Stats() {
	const [cookies, setCookie, removeCookie] = useCookies(['jwt', 'user']);

	const [afterMealActive, setAfterMealActive] = useState(false);
	const [afterMealColor, setAfterMealColor] = useState('#6CFF38');
	const [beforeMealActive, setBeforeMealActive] = useState(false);
	const [beforeMealColor, setBeforeMealColor] = useState('#FFCB4A');
	const [bloodSugarActive, setBloodSugarActive] = useState(true);
	const [bloodSugarColor, setBloodSugarColor] = useState('#FF5552');
	const [chartData, setChartData] = useState([{}]);
	const [dailyAverage, setDailyAverage] = useState(false);
	const [endDate, setEndDate] = useState('');
	const [feelActive, setFeelActive] = useState(false);
	const [feelColor, setFeelColor] = useState('#EB5FFF');
	const [startDate, setStartDate] = useState('');
	const [weightActive, setWeightActive] = useState(false);
	const [weightColor, setWeightColor] = useState('#61AAFF');

	const addDailyAverage = (
		newData, data, currentDayEntryCount,
		currentDayAfterMeal, currentDayBeforeMeal, currentDayFeel
	) => {

		newData['bloodSugar'] = newData['bloodSugar'] / currentDayEntryCount;
		newData['weight'] = newData['weight'] / currentDayEntryCount;

		if (currentDayAfterMeal === 0 && data.length > 0) {
			newData['afterMeal'] = data[data.length - 1]['afterMeal'];
		} else {
			newData['afterMeal'] = newData['afterMeal'] / currentDayAfterMeal;
		}

		if (currentDayBeforeMeal === 0 && data.length > 0) {
			newData['beforeMeal'] = data[data.length - 1]['beforeMeal'];
		} else {
			newData['beforeMeal'] = newData['beforeMeal'] / currentDayBeforeMeal;
		}

		if (currentDayFeel === 0 && data.length > 0) {
			newData['feel'] = data[data.length - 1]['feel'];
		} else {
			newData['feel'] = newData['feel'] / currentDayFeel;
		}

		return newData;
	}

	useEffect(() => {
		let params = {};

		if (startDate) {
			params['startDate'] = (new Date(startDate + " 00:00:00"))
		}

		if (endDate) {
			params['endDate'] = (new Date(endDate + " 23:59:59"))
		}

		axios.get('http://localhost:1337/api/diary-entries/get-chart-data' + (
			Object.keys(params).length !== 0
				? '?' + Object.keys(params).map((key, index) =>
					key + '=' + params[key] + (
						index < (Object.keys(params).length - 1) ? '&' : ''
					)
				).join('')
				: ''
		), {
			headers: {
				Authorization: `Bearer ${cookies['jwt']}`
			}
		}).then(response => {
			let data = []
			if (dailyAverage) {
				let currentDate;
				let currentDay = {};
				let currentDayEntryCount = 0;
				let currentDayAfterMeal = 0;
				let currentDayBeforeMeal = 0;
				let currentDayFeel = 0;
				for (let i = 0; i < response.data.length; i++) {
					if (currentDate && currentDate === (new Date(response.data[i].date)).toLocaleDateString()) {
						currentDay['bloodSugar'] += response.data[i]['bloodSugar'];
						currentDay['weight'] += response.data[i]['weight'];
						currentDayEntryCount++;

						if (response.data[i]['beforeAfter']) {
							currentDay['afterMeal'] += response.data[i]['bloodSugar'];
							currentDayAfterMeal++;
						} else {
							currentDay['beforeMeal'] += response.data[i]['bloodSugar'];
							currentDayBeforeMeal++;
						}

						if (response.data[i]['feel']) {
							currentDay['feel'] += response.data[i]['feel'];
							currentDayFeel++;
						}

						if (i === response.data.length - 1) {
							data.push({
								...addDailyAverage(currentDay, data,
									currentDayEntryCount, currentDayAfterMeal,
									currentDayBeforeMeal, currentDayFeel),
								date: (new Date(response.data[i].date)).toLocaleDateString()
							});
						}
					} else {
						if (currentDayEntryCount > 0) {
							data.push({
								...addDailyAverage(currentDay, data,
									currentDayEntryCount, currentDayAfterMeal,
									currentDayBeforeMeal, currentDayFeel),
								date: (new Date(response.data[i - 1].date)).toLocaleDateString()
							})
						}
						currentDate = (new Date(response.data[i].date)).toLocaleDateString();
						currentDayEntryCount = 1;

						currentDay = { ...response.data[i] };

						if (response.data[i]['beforeAfter']) {
							currentDay['afterMeal'] = currentDay['bloodSugar']
							currentDay['beforeMeal'] = 0;
							currentDayAfterMeal = 1;
							currentDayBeforeMeal = 0;
						} else {
							currentDay['beforeMeal'] = currentDay['bloodSugar']
							currentDay['afterMeal'] = 0;
							currentDayAfterMeal = 0;
							currentDayBeforeMeal = 1;
						}

						if (response.data[i]['feel']) {
							currentDay['feel'] = response.data[i]['feel'];
							currentDayFeel = 1;
						} else {
							currentDayFeel = 0;
						}
						if (i === response.data.length - 1) {
							data.push({
								...addDailyAverage(currentDay, data,
									currentDayEntryCount, currentDayAfterMeal,
									currentDayBeforeMeal, currentDayFeel),
								date: (new Date(response.data[i].date)).toLocaleDateString()
							})
						}
					}
				}
			} else {
				for (let i = 0; i < response.data.length; i++) {
					data.push({
						...response.data[i], date: (new Date(response.data[i].date)).toLocaleString(), weight: (
							response.data[i].weight
								? response.data[i].weight
								: i > 0
									? data[i - 1].weight
									: null
						), beforeMeal: (
							!response.data[i].beforeAfter
								? response.data[i].bloodSugar
								: i > 0
									? data[i - 1].beforeMeal
									: null
						), afterMeal: (
							response.data[i].beforeAfter
								? response.data[i].bloodSugar
								: i > 0
									? data[i - 1].afterMeal
									: null
						), feel: (
							response.data[i].feel
								? response.data[i].feel
								: i > 0
									? data[i - 1].feel
									: null
						),
					});
				}
			}
			setChartData(data);
		});
	}, [startDate, endDate, dailyAverage]);
	return (
		<Container fluid='lg'>
			<ResponsiveContainer width='100%' height={500}>
				<AreaChart
					data={chartData}
					margin={{
						top: 50,
						bottom: 5,
					}}
				>
					<defs>
						<linearGradient id="colorBloodSugar" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={bloodSugarColor} stopOpacity={0.8} />
							<stop offset="95%" stopColor={bloodSugarColor} stopOpacity={0} />
						</linearGradient>
						<linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={weightColor} stopOpacity={0.8} />
							<stop offset="95%" stopColor={weightColor} stopOpacity={0} />
						</linearGradient>
						<linearGradient id="colorBeforeMeal" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={beforeMealColor} stopOpacity={0.8} />
							<stop offset="95%" stopColor={beforeMealColor} stopOpacity={0} />
						</linearGradient>
						<linearGradient id="colorAfterMeal" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={afterMealColor} stopOpacity={0.8} />
							<stop offset="95%" stopColor={afterMealColor} stopOpacity={0} />
						</linearGradient>
						<linearGradient id="colorFeel" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={feelColor} stopOpacity={0.8} />
							<stop offset="95%" stopColor={feelColor} stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="5 5" />
					<XAxis dataKey="date" tick={<CustomAxisTick />} />
					<YAxis yAxisId="left" />
					<YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
					<Tooltip />
					<Legend />
					{
						bloodSugarActive
							? (<Area yAxisId="left" type="monotone" dataKey="bloodSugar" name="Blood Sugar" stroke={bloodSugarColor} activeDot={{ r: 8 }} fillOpacity={1} fill="url(#colorBloodSugar)" />)
							: (<></>)
					}
					{
						weightActive
							? (<Area yAxisId="left" type="monotone" dataKey="weight" name="Weight" stroke={weightColor} activeDot={{ r: 8 }} fillOpacity={1} fill="url(#colorWeight)" />)
							: (<></>)
					}
					{
						beforeMealActive
							? (<Area yAxisId="left" type="monotone" dataKey="beforeMeal" name="Before Meal BS." stroke={beforeMealColor} activeDot={{ r: 8 }} fillOpacity={1} fill="url(#colorBeforeMeal)" />)
							: (<></>)
					}
					{
						afterMealActive
							? (<Area yAxisId="left" type="monotone" dataKey="afterMeal" name="After Meal BS." stroke={afterMealColor} activeDot={{ r: 8 }} fillOpacity={1} fill="url(#colorAfterMeal)" />)
							: (<></>)
					}
					{
						feelActive
							? (<Area yAxisId="right" type="monotone" dataKey="feel" name="How You Felt" stroke={feelColor} activeDot={{ r: 8 }} fillOpacity={1} fill="url(#colorFeel)" />)
							: (<></>)
					}
				</AreaChart>
			</ResponsiveContainer>
			<Row>
				<Col sm={4}>
					<Row className="my-1">
						<Col xs={7}><FormLabel htmlFor="bloodSugarCheck">Blood Sugar</FormLabel></Col>
						<Col xs='auto'><FormCheck id="bloodSugarCheck" checked={bloodSugarActive} onChange={e => setBloodSugarActive(e.target.checked)} /></Col>
						<Col xs='auto'><FormControl type="color" id="bloodSugarColor" value={bloodSugarColor} onChange={e => setBloodSugarColor(e.target.value)} /></Col>
					</Row>
					<Row className="my-1">
						<Col xs={7}><FormLabel htmlFor="weightCheck">Weight</FormLabel></Col>
						<Col xs='auto'><FormCheck id="weightCheck" checked={weightActive} onChange={e => setWeightActive(e.target.checked)} /></Col>
						<Col xs='auto'><FormControl type="color" id="weightColor" value={weightColor} onChange={e => setWeightColor(e.target.value)} /></Col>
					</Row>
					<Row className="my-1">
						<Col xs={7}><FormLabel htmlFor="beforeMealCheck">Before Meal Blood Sugar</FormLabel></Col>
						<Col xs='auto'><FormCheck id="beforeMealCheck" checked={beforeMealActive} onChange={e => setBeforeMealActive(e.target.checked)} /></Col>
						<Col xs='auto'><FormControl type="color" id="beforeMealColor" value={beforeMealColor} onChange={e => setBeforeMealColor(e.target.value)} /></Col>
					</Row >
					<Row className="my-1">
						<Col xs={7}><FormLabel htmlFor="afterMealCheck">After Meal Blood Sugar</FormLabel></Col>
						<Col xs='auto'><FormCheck id="afterMealCheck" checked={afterMealActive} onChange={e => setAfterMealActive(e.target.checked)} /></Col>
						<Col xs='auto'><FormControl type="color" id="afterMealColor" value={afterMealColor} onChange={e => setAfterMealColor(e.target.value)} /></Col>
					</Row >
					<Row className="my-1">
						<Col xs={7}><FormLabel htmlFor="feelCheck">How You Felt</FormLabel></Col>
						<Col xs='auto'><FormCheck id="feelCheck" checked={feelActive} onChange={e => setFeelActive(e.target.checked)} /></Col>
						<Col xs='auto'><FormControl type="color" id="feelColor" value={feelColor} onChange={e => setFeelColor(e.target.value)} /></Col>
					</Row >
				</Col>
				<Col sm={8}>
					<Row className="my-1">
						<Col sm='auto'><FormLabel htmlFor="startDate">Start Date</FormLabel></Col>
						<Col><FormControl type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} /></Col>
						<Col sm='auto'><FormLabel htmlFor="endDate">End Date</FormLabel></Col>
						<Col><FormControl type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} /></Col>
					</Row>
					<Row>
						<Col sm='auto'><FormLabel htmlFor="dailyAverage">Daily Average</FormLabel></Col>
						<Col><FormCheck id="dailyAverage" checked={dailyAverage} onChange={e => setDailyAverage(e.target.checked)} /></Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
}

function CustomAxisTick(props) {
	const { x, y, stroke, payload } = props;

	return (
		<g transform={`translate(${x},${y})`}>
			<text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
				{payload.value.split(',')[0]}
			</text>
		</g>
	);
}

export default Stats;