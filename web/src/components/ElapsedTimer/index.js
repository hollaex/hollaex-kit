import React, { Component } from 'react';
import ReactSVG from 'react-svg';

import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

let timerInterval = '';

class ElapsedTimer extends Component {
    state = {
        seconds: this.props.timeoutSeconds - 1
    }

    componentDidMount() {
        if (this.props.isLoading) {
            this.startTimer();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isLoading !== this.props.isLoading) {
            if (this.props.isLoading) {
                this.startTimer();
            } else {
                this.endTimer();
            }
        }
        if (this.state.seconds === 0) {
            this.props.timeoutCallback();
            this.endTimer();
        }
    }
    
    componentWillUnmount() {
        this.endTimer();
    }

    startTimer = () => {
        timerInterval = setInterval(() => {
            this.setState({ seconds: this.state.seconds - 1 });
        }, this.props.intervalSeconds * 1000);
    };

    endTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        this.setState({ seconds: this.props.timeoutSeconds })
    };

    render() {
        const { isLoading, timerText } = this.props;
        if (!isLoading) {
            return null;
        }
        return (
            <div className="elapsed-timer-wrapper mb-4 d-flex align-items-center">
                <div className="timer-text">
                    {timerText}
                    <span className="timer-time mx-1">{this.state.seconds} {STRINGS.SECONDS}</span>
                </div>
                <div>
                    <ReactSVG path={ICONS.PENDING_TIMER} wrapperClassName="timer-svg" />
                </div>
            </div>
        );
    }
}

ElapsedTimer.defaultProps = {
    isLoading: false,
    timeoutSeconds: 60,
    timerText: '',
    intervalSeconds: 1
}

export default ElapsedTimer;