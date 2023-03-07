export function getActions() {
	let actions = {
		setFaderLevel: {
			name: 'Set Fader Level',
			options: [
				{
					type: 'textinput',
					id: 'deviceID',
					label: 'Device ID',
					tooltip: 'Insert device ID',
					default: '1',
					width: 6,
				},
				{
					type: 'textinput',
					id: 'instanceID',
					label: 'Instance ID',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6,
				},
				{
					type: 'textinput',
					id: 'channel',
					label: 'Channel',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6,
				},
				{
					type: 'number',
					label: 'Level',
					id: 'level',
					min: -100,
					max: 12,
					default: 0,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				let opt = action.options;

				this.setFaderLevel(opt.deviceID, opt.instanceID, opt.channel, opt.level);
			},
		},

		incFaderLevel: {
			name: 'Increment/Decrement Fader Level',
			options: [
				{
					type: 'dropdown',
					label: 'Command',
					id: 'command',
					choices: [
						{ id: 'INC', label: 'Increment' },
						{ id: 'DEC', label: 'Decrement' },
					],
					default: 'INC',
				},
				{
					type: 'textinput',
					id: 'deviceID',
					label: 'Device ID',
					tooltip: 'Insert device ID',
					default: '1',
					width: 6,
				},
				{
					type: 'textinput',
					id: 'instanceID',
					label: 'Instance ID',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6,
				},
				{
					type: 'textinput',
					id: 'channel',
					label: 'Channel',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6,
				},
				{
					type: 'textinput',
					label: 'Increment/Decrement Amount',
					id: 'amount',
					default: 1,
					required: true,
				},
			],
			callback: (action) => {
				let opt = action.options;

				this.faderChange(opt.command, opt.deviceID, opt.instanceID, opt.channel, opt.amount);
			},
		},

		incFaderLevelTimer: {
			name: 'Increase Fader Level 1 Point Continuously',
			options: [
				{
					type: 'number',
					label: 'Rate',
					id: 'rate',
					default: '500',
					tooltip: 'Time in milliseconds between increases',
				},
				{
					type: 'dropdown',
					label: 'Command',
					id: 'command',
					choices: [
						{ id: 'INC', label: 'Increment' },
						{ id: 'DEC', label: 'Decrement' },
					],
					default: 'INC',
				},
				{
					type: 'textinput',
					id: 'deviceID',
					label: 'Device ID',
					tooltip: 'Insert device ID',
					default: '1',
					width: 6,
				},
				{
					type: 'textinput',
					id: 'instanceID',
					label: 'Instance ID',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6,
				},
				{
					type: 'textinput',
					id: 'channel',
					label: 'Channel',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6,
				},
				{
					type: 'textinput',
					label: 'Increment/Decrement Amount',
					id: 'amount',
					default: 1,
					required: true,
				},
			],
			callback: (action) => {
				let opt = action.options;

				this.incrementFaderLevelTimer(
					'start',
					opt.rate,
					opt.command,
					opt.deviceID,
					opt.instanceID,
					opt.channel,
					opt.amount
				);
			},
		},

		incFaderLevelStop: {
			name: 'Stop Increasing Fader Level',
			options: [],
			callback: (action) => {
				this.incrementFaderLevelTimer('stop');
			},
		},

		faderMute: {
			name: 'Fader Mute',
			options: [
				{
					type: 'textinput',
					id: 'deviceID',
					label: 'Device ID',
					tooltip: 'Insert device ID',
					default: '1',
					width: 6,
				},
				{
					type: 'textinput',
					id: 'instanceID',
					label: 'Instance ID',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6,
				},
				{
					type: 'textinput',
					id: 'channel',
					label: 'Channel',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6,
				},
				{
					type: 'dropdown',
					label: 'Status',
					id: 'muteStatus',
					choices: [
						{ id: '1', label: 'Mute' },
						{ id: '0', label: 'Unmute' },
					],
					default: '1',
				},
			],
			callback: (action) => {
				let opt = action.options;

				this.setFaderMute(opt.deviceID, opt.instanceID, opt.channel, opt.muteStatus);
			},
		},

		customCommand: {
			name: 'Custom Command',
			options: [
				{
					type: 'textinput',
					id: 'command',
					label: 'Command',
					tooltip: 'Insert Command String',
					default: '',
					width: 6,
				},
			],
			callback: (action) => {
				let opt = action.options;

				cmd = options.command;

				this.sendCommand(cmd);
			},
		},
	};
	return actions;
}
