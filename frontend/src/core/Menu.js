import React, { Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { signout, isAuthenticated } from '../auth'

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { color: '#ff9900' }
    } else {
        return { color: '#fff' }
    }
}

const Menu = ({ history }) => {
    return (
        <div>
            <ul className="nav nav-tabs bg-dark">
                <li className="nav-item nav">
                    <Link
                        className="nav-link"
                        style={isActive(history, '/')}
                        to="/"
                    >
                        Home
                    </Link>

                    <Link
                        className="nav-link"
                        style={isActive(history, '/user/dashboard')}
                        to="/user/dashboard"
                    >
                        Dashboard
                    </Link>

                    {!isAuthenticated() && (
                        <Fragment>
                            <Link
                                className="nav-link"
                                style={isActive(history, '/signin')}
                                to="/signin"
                            >
                                Signin
                            </Link>

                            <Link
                                className="nav-link"
                                style={isActive(history, '/signup')}
                                to="/signup"
                            >
                                Signup
                            </Link>
                        </Fragment>
                    )}

                    {isAuthenticated() && (
                        <span
                            className="nav-link"
                            style={{ cursor: 'pointer', color: '#fff' }}
                            onClick={() =>
                                signout(() => {
                                    history.push('/')
                                })
                            }
                        >
                            Signout
                        </span>
                    )}
                </li>
            </ul>
        </div>
    )
}

export default withRouter(Menu)
