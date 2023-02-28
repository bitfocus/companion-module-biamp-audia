export function setFaderLevel(deviceID, instanceID, channel, level) {
	let cmd =
		'SET' +
		' ' +
		deviceID +
		' ' +
		'FDRLVL' +
		' ' +
		instanceID +
		' ' +
		channel +
		' ' +
		level;
	console.log(cmd)

	sendCommand(cmd);
}

export function setFaderMute(deviceID, instanceID, channel, state) {
	let cmd =
		'SET' +
		' ' +
		deviceID +
		' ' +
		'FDRMUTE' +
		' ' +
		instanceID +
		' ' +
		channel +
		' ' +
		state;
	console.log(cmd)

	this.sendCommand(cmd);
}

export function incrementFaderLevelTimer(mode, rate, command, deviceID, instanceID, channel, amount) {
	if (this.TIMER_FADER !== null) {
		clearInterval(this.TIMER_FADER)
		this.TIMER_FADER = null
	}

	if (mode === 'start') {
		this.TIMER_FADER = setInterval(
			this.faderChange.bind(this),
			parseInt(rate),
			command,
			deviceID,
			instanceID,
			channel,
			amount
		)
	}
}

export function faderChange(command, deviceID, instanceID, channel, amount) {

	let cmd = command + ' ' + deviceID + ' ' + 'FDRLVL' + ' ' + instanceID + ' ' + channel + ' ' + amount;

	this.sendCommand(cmd);
}