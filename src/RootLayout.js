import { useContext } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useCookies } from 'react-cookie'
import { useJwt } from 'react-jwt'
import { NavLink, Outlet } from 'react-router-dom'
import { Settings } from './components/SiteContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

function RootLayout() {
	const [cookies, setCookie, removeCookie] = useCookies(['jwt', 'user']);
	const { isExpired } = useJwt(cookies['jwt']);
	const settingsContext = useContext(Settings);

	return (
		<>
			<Navbar bg="dark" variant="dark" expand="lg">
				<Container fluid>
					<Navbar.Brand as={NavLink} to="/"><img style={{ height: "40px" }} id="blooddrop" src="/blooddropicon.png" alt="Blood Drop" />Blood Sugar Diary</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						{cookies['user'] ?
							<Nav className="me-auto">
								<Nav.Link as={NavLink} to="/diary/1">Diary</Nav.Link>
								<Nav.Link as={NavLink} to="/stats">Stats</Nav.Link>
							</Nav>
							: <Nav className="me-auto">
							</Nav>
						}

						{isExpired ? (
							<Nav>
								<Nav.Link as={NavLink} to="/login"><button className="btn btn-outline-success">Login</button></Nav.Link>
								<Nav.Link as={NavLink} to="/register"><button className="btn btn-outline-info">Register</button></Nav.Link>
							</Nav>
						) : (
							<Nav>
								<NavDropdown menuVariant="dark" title={
									<>
										{(() => {
											if (settingsContext.userPreferences && settingsContext.userPreferences.profilePic) {
												return (
													<>
														<img
															src={"http://localhost:1337" + settingsContext.userPreferences.profilePic.formats.thumbnail.url}
															alt="Profile Pic"
															style={{ height: '40px', width: '40px', borderRadius: '20px', objectFit: 'cover', objectPosition: '50%', }}
														/>
													</>
												)
											} else {
												return (
													<>
														<FontAwesomeIcon icon={icon({ name: 'user', style: 'regular' })} size='xl' />
													</>
												)
											}
										})()}&nbsp; &nbsp; Hello, {cookies['user'] ? cookies['user'].username : ''}</>} id="basic-nav-dropdown">
									<NavDropdown.Item as={NavLink} to="/user-preferences">User Preferences</NavDropdown.Item>
									<NavDropdown.Item as={NavLink} to="/logout">Logout</NavDropdown.Item>
								</NavDropdown>
							</Nav>
						)}
					</Navbar.Collapse>
				</Container>
			</Navbar >
			<div><Outlet /></div>
		</>
	)
}

export default RootLayout;