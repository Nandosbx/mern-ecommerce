import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const Menu = () => {
    ;<div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link className="nav-link" to="/">
                    Home
                </Link>

                <Link className="nav-link" to="/signin">
                    Signin
                </Link>

                <Link className="nav-link" to="/signup">
                    Signup
                </Link>
            </li>
        </ul>
    </div>
}

export default Menu