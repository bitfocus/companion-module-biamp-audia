export function fetchData(variable) {
	if (this.config[`variable${variable}`] !== undefined && this.config[`variable${variable}`] !== null) {
		let cmd = this.config[`variable${variable}`];
		this.sendCommand(cmd);
	}
}

export function processData(data) {
	if (this.LAST_LINE_SENT !== undefined && this.LAST_LINE_RECEIVED !== undefined) {
		if (this.LAST_LINE_RECEIVED.includes(this.LAST_LINE_SENT) && data.length > 0 && !data.includes('\n')) {
			for (let i = 1; i <= this.config.variableCount; i++) {
				let name = 'variable' + i;

				if (this.LAST_LINE_RECEIVED.includes(this.config[name])) {
					if (this.LAST_LINE_RECEIVED.includes('FDRLVL')) {
						let num = Number(data);
						num = num.toFixed(2);
						this.DEVICE_INFO[`variable${i}`] = num;
						break;
					} else {
						this.DEVICE_INFO[`variable${i}`] = data.replace(' \r', '');
						this.updateVariables();
						break;
					}
				}
			}
		}
	}

	if (data.length > 1) {
		this.LAST_LINE_RECEIVED = data;
	}

	this.completeCommand(data.trim());
}

export function sendCommand(cmd) {
	if (cmd === undefined || cmd === null || String(cmd).trim() === '') {
		this.log('error', 'Invalid command: ' + cmd);
		return;
	}

	if (this.COMMAND_QUEUE.length >= this.MAX_COMMAND_QUEUE) {
		this.log('error', `Biamp command queue is full; dropping command: ${cmd}`);
		return;
	}

	this.COMMAND_QUEUE.push(String(cmd));
	this.sendNextCommand();
}

export function sendNextCommand() {
	if (this.COMMAND_IN_FLIGHT || this.COMMAND_QUEUE_PAUSED || !this.CONNECTED || this.socket === undefined) {
		return;
	}

	let command = this.COMMAND_QUEUE.shift();
	if (command === undefined) {
		return;
	}

	this.COMMAND_IN_FLIGHT = command;
	this.LAST_LINE_SENT = command;
	let sent = this.socket.send(command + '\r\n');
	if (sent && typeof sent.catch === 'function') {
		sent.catch(() => this.pauseCommandQueue('failed command write'));
	}
	this.COMMAND_RESPONSE_TIMEOUT = setTimeout(() => {
		if (this.COMMAND_IN_FLIGHT === command) {
			this.log('error', `Timed out waiting for Biamp response to: ${command}. Command queue paused.`);
			this.COMMAND_IN_FLIGHT = undefined;
			this.COMMAND_QUEUE_PAUSED = true;
		}
	}, this.COMMAND_RESPONSE_TIMEOUT_MS);
}

export function completeCommand(response) {
	if (!this.COMMAND_IN_FLIGHT || response.length === 0) {
		return;
	}

	let waitingForGetValue = /^(GET|GETD|GETLD)\s/i.test(this.COMMAND_IN_FLIGHT);
	let responseCompletesCommand = waitingForGetValue || response.startsWith('+OK') || response.startsWith('-ERR');
	if (!responseCompletesCommand) {
		return;
	}

	if (response.startsWith('-ERR')) {
		if (this.COMMAND_ERROR_SETTLE_TIMEOUT) {
			clearTimeout(this.COMMAND_ERROR_SETTLE_TIMEOUT);
		}
		this.COMMAND_ERROR_SETTLE_TIMEOUT = setTimeout(() => this.finishCommand(), this.COMMAND_ERROR_SETTLE_MS);
		return;
	}

	this.finishCommand();
}

export function finishCommand() {
	clearTimeout(this.COMMAND_RESPONSE_TIMEOUT);
	this.COMMAND_RESPONSE_TIMEOUT = null;
	if (this.COMMAND_ERROR_SETTLE_TIMEOUT) {
		clearTimeout(this.COMMAND_ERROR_SETTLE_TIMEOUT);
		this.COMMAND_ERROR_SETTLE_TIMEOUT = null;
	}
	this.COMMAND_IN_FLIGHT = undefined;
	this.sendNextCommand();
}

export function pauseCommandQueue(reason) {
	if (this.COMMAND_RESPONSE_TIMEOUT) {
		clearTimeout(this.COMMAND_RESPONSE_TIMEOUT);
		this.COMMAND_RESPONSE_TIMEOUT = null;
	}
	if (this.COMMAND_ERROR_SETTLE_TIMEOUT) {
		clearTimeout(this.COMMAND_ERROR_SETTLE_TIMEOUT);
		this.COMMAND_ERROR_SETTLE_TIMEOUT = null;
	}

	if (this.COMMAND_IN_FLIGHT) {
		this.log('error', `Biamp connection lost while waiting for: ${this.COMMAND_IN_FLIGHT}. Command queue paused.`);
	} else {
		this.log('error', `Biamp command queue paused: ${reason}.`);
	}
	this.COMMAND_IN_FLIGHT = undefined;
	this.COMMAND_QUEUE_PAUSED = true;
}
