import React, {Component} from 'react';
import {Link} from 'react-router';
import strings from '../../utils/string'


class ToolbarNav extends Component {
    render(){
        return (
                <div className="col-lg-10 offset-lg-1 col-md-10 offset-md-1 col-sm-10 offset-sm-1 col-xs-10 offset-xs-1">
                    <nav className="navbar navbar-toggleable-md" id="about_Nav">
                        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#about_navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" id="about_navButton">
                            <span className="navbar-toggler-icon">
                            </span>
                        </button>
                        <Link className="navbar-brand" to='/'><img src="/assets/logo/logo-holla-black.svg" width="auto" height="30" alt=""/></Link>
                        <div className="collapse navbar-collapse justify-content-end" id="about_navbarNav">
                            <ul className="navbar-nav row text-center">
                                <li className="nav-item">
                                    <Link className="nav-link" to='/About'>{strings.NAV_ABOUT}</Link>
                                </li>
                                <li className="nav-item ">
                                    <Link className="nav-link" to="/Products">{strings.NAV_PRODUCTS}</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
        )
    }
}

export default ToolbarNav;