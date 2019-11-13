import React, { Component } from 'react';
import styles from './TimerCountdown.module.css';

// can only take whole numbers
const MINUTES = 20;
const COLOR_START = '#9BBC41';
const COLOR_END = '#E53F27';

const bgStyles = {
	backgroundColor: COLOR_START,
	transition: `background-color ${MINUTES*60}s`,
}
let count = 0; // will continue as neg numbers below 0
let intervalHandle = 0;

class TimerCountdown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timeDisplay: this.formatTime(MINUTES * 60),
		}
	}

	componentDidMount() {
		this.startCountDown();
		const background = document.getElementById('background');
		background.style.backgroundColor = COLOR_END;
	}

	componentWillUnmount() {
		clearInterval(intervalHandle);
		this.props.getTimeSpent(this.getTimeSpent());
	}

	getTimeSpent = () => {
		const totalSeconds = (MINUTES * 60) - count - 1;
		return {
			totalSeconds,
			minutes: Math.floor(totalSeconds/60),
			seconds: totalSeconds % 60,
		};
	}

	formatTime = (_count) => {
		// minutes
		let min = 0;
		if (_count >= 0) {
			min = Math.floor(_count/60);
		} else {
			min = Math.ceil(_count/60);
		}
		let minFormat = String(Math.abs(min));
		if (min < 10 && min > -10) minFormat = '0' + minFormat;

		// seconds
		let sec = _count - (min * 60);
		let secFormat = String(Math.abs(sec));
		if (sec < 10 && sec > -10) secFormat = '0' + secFormat;

		let displayTime = minFormat + ':' + secFormat;
		if (_count < 0) displayTime = '-' + displayTime;
		return displayTime;
	}

	tick = () => {
		count--
		this.setState({
			timeDisplay: this.formatTime(count),
		})
	}

	startCountDown = () => {
		intervalHandle = setInterval(this.tick, 1000);
		count = MINUTES * 60;
	}

	render() {
		return (
			<div id="background" className={styles.background} style={bgStyles}>
				<div className={styles.timerText}>
					{this.state.timeDisplay}
				</div>
			</div>
		);
	}

}

export default TimerCountdown;
