export function fetchData(variable) {

	if (this.config[`variable${variable}`] != undefined || null) {
		let cmd = this.config[`variable${variable}`];

		this.LAST_LINE_SENT = cmd;

		this.sendCommand(cmd);
	}

}

export function processData(data) {

	if (this.LAST_LINE_SENT !== undefined && this.LAST_LINE_RECEIVED !== undefined) {
		//console.log('LLR', this.LAST_LINE_RECEIVED);
		//console.log('LLS', this.LAST_LINE_SENT);
	
		//console.log('data', data);
	
		if (this.LAST_LINE_RECEIVED.includes(this.LAST_LINE_SENT) && data.length > 0 && !data.includes('\n')) {
			console.log('here')
			for (let i = 1; i <= this.config.variableCount; i++) {
				let name = 'variable' + i;

				console.log('i', i)
				//console.log(name)
				//console.log(this.config[name])
				if(this.LAST_LINE_RECEIVED.includes(this.config[name])) {
					console.log('HERE @')
					this.DEVICE_INFO[`variable${i}`] = data.replace(' \r', '');
					console.log(this.DEVICE_INFO)
					break;
					//console.log(JSON.stringify(this.DEVICE_INFO))
				}
			}
		}
	
		//this.updateVariables();
	}

	if(data.length > 1) {
		this.LAST_LINE_RECEIVED = data;
	}
}

export function sendCommand(cmd) {
	if (cmd !== undefined) {
		if (this.socket !== undefined && this.CONNECTED) {
			this.socket.send(cmd + '\r\n')
			this.LAST_LINE_SENT = cmd;
		} else {
			this.log('error', 'Socket not connected :(')
		}
	} else {
		this.log('error', 'Invalid command: ' + cmd)
	}
}
