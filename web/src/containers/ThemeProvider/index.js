import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';

const ThemeProvider = ({ color = {}, ...rest }) => {
    useEffect(() => {
        // const theme = {
        //     'app-background-color': '#ba68c8',
        //     'app-light-background': '#ce93d8',
        //     'app-sidebar-background': '#e1bee7',
        //     'auth-container-background': '#f3e5f5',

        //     'dark-app-background-color': '#42a5f5',
        //     'dark-app-light-background': '#64b5f6',
        //     'dark-app-sidebar-background': '#90caf9',
        //     'dark-auth-container-background': '#bbdefb'
        // };

        // setTimeout(() => {
        //     const element = document.documentElement;
    
        //     Object.keys(theme).forEach((key) => {
        //         if (element == null) return;
        //         element.style.setProperty(`--${key}`, theme[key])
        //     });
        // }, 60000);
        const element = document.documentElement;
        if (element) {
            Object.keys(color).forEach((key) => {
                let themeData = color[key];
                if (themeData && Object.keys(themeData)) {
                    Object.keys(themeData).forEach((name) => {
                        element.style.setProperty(`--${name}`, themeData[name])
                    });
                }
            });
        }
    }, [color]);
    return (
        <Fragment>
            {rest.children}
        </Fragment>
    );
}

const mapStateToProps = (state) => ({
    color: state.app.constants.color
});

export default connect(mapStateToProps)(ThemeProvider);
