// BiAmp Audia

var tcp = require('../../tcp')
var instance_skel = require('../../instance_skel')
const { slice } = require('lodash')
var debug
var log

function instance(system, id, config) {
	let self = this

	// super-constructor
	instance_skel.apply(this, arguments)

	self.actions() // export actions

	return self
}

instance.prototype.TIMER_FADER = null

instance.prototype.updateConfig = function (config) {
	let self = this

	self.config = config
	self.initPresets()
	self.init_tcp()
}

instance.prototype.init = function () {
	let self = this

	debug = self.debug
	log = self.log
	self.initPresets()
	self.init_tcp()
}

instance.prototype.init_tcp = function () {
	let self = this

	if (self.socket !== undefined) {
		self.socket.destroy()
		delete self.socket
	}

	self.config.port = 23

	if (self.config.host && self.config.port) {
		self.socket = new tcp(self.config.host, self.config.port)

		self.socket.on('status_change', function (status, message) {
			self.status(status, message)
		})

		self.socket.on('error', function (err) {
			debug('Network error', err)
			self.log('error', 'Network error: ' + err.message)
		})

		self.socket.on('connect', function () {
			debug('Connected')
		})

	} else {
		self.log('error', 'Please specify host in config.')
	}
}

instance.prototype.initPresets = function () {
	var self = this
	var presets = []

	presets.push({
		category: 'Fader Level',
		label: 'Inc Fader',
		bank: {
			style: 'text',
			text: 'Fader +',
			size: '14',
			color: '16777215',
			bgcolor: self.rgb(0, 0, 0),
		},
		actions: [
			{
				action: 'incFaderLevelTimer',
				options: {
					rate: '200',
					command: 'INC',
					deviceID: 1,
					instanceID: 1,
					amount: 1,
				},
			},
		],
		release_actions: [
			{
				action: 'incFaderLevelStop',
			},
		],
	})

	presets.push({
		category: 'Fader Level',
		label: 'Dec Fader',
		bank: {
			style: 'text',
			text: 'Fader -',
			size: '14',
			color: '16777215',
			bgcolor: self.rgb(0, 0, 0),
		},
		actions: [
			{
				action: 'incFaderLevelTimer',
				options: {
					rate: '200',
					command: 'DEC',
					deviceID: 1,
					instanceID: 1,
					amount: 1,
				},
			},
		],
		release_actions: [
			{
				action: 'incFaderLevelStop',
			},
		],
	})

	self.setPresetDefinitions(presets)
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	let self = this

	return [
		{
			type: 'text',
			id: 'info',
			label: '',
			width: 12,
			value: `
				<div class="alert alert-danger">
					<h4>ACTION REQUESTS</h4>
					<div>
						<strong>If you want to use an action that requires the use of a custom command, please submit a issue request to the module repo with the action that you would like added to the module.</strong>
						<a href="https://github.com/bitfocus/companion-module-biamp-audia/issues" target="_new" class="btn btn-success">Module Issues Page</a>
					</div>
				</div>
			`,
		},
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module will connect to a BiAmp Audia of Nexia Processor.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'IP Address',
			width: 6,
			default: '192.168.0.1',
			regex: self.REGEX_IP,
		},
	]
}

// When module gets deleted
instance.prototype.destroy = function () {
	let self = this

	if (self.socket !== undefined) {
		self.socket.destroy()
	}

	//destroy timers
	if (self.TIMER_FADER !== null) {
		clearInterval(this.TIMER_FADER)
		self.TIMER_FADER = null
	}

	debug('destroy', self.id)
}

instance.prototype.actions = function () {
	let self = this

	self.system.emit('instance_actions', self.id, {
		setFaderLevel: {
			label: 'Set Fader Level',
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
		},
		incFaderLevel: {
			label: 'Increment/Decrement Fader Level',
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
		},
		incFaderLevelTimer: {
			label: 'Increase Fader Level 1 Point Continuously',
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
		},
		incFaderLevelStop: {
			label: 'Stop Increasing Fader Level',
		},
		faderMute: {
			label: 'Fader Mute',
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
		},
		customCommand: {
			label: 'Custom Command',
			options: [
				{
					type: 'text',
					id: 'info',
					width: 12,
					label:
						'BiAmp has created a command calculator to create custom command strings for the Audia and Nexia controllers. Unless you know what you are doing, it is strongly recommended that you use the calculator to create your command.',
					value: '',
				},
				{
					type: 'text',
					id: 'info',
					width: 12,
					label:
						'The calculator can be found here: https://support.biamp.com/Audia-Nexia/Control/Audia-Nexia_command_string_calculator',
					value: '',
				},
				{
					type: 'textinput',
					id: 'command',
					label: 'Command',
					tooltip: 'Insert device ID',
					default: '1',
					width: 6,
				},
			],
		},
	})
}

instance.prototype.action = function (action) {
	let self = this
	let cmd
	let options = action.options
	let muteInt

	console.log('here')

	switch (action.action) {
		case 'setFaderLevel':
			cmd =
				'SET' +
				' ' +
				options.deviceID +
				' ' +
				'FDRLVL' +
				' ' +
				options.instanceID +
				' ' +
				options.channel +
				' ' +
				options.level
			console.log(cmd)
			break
		case 'faderMute':
			cmd =
				'SET' +
				' ' +
				options.deviceID +
				' ' +
				'FDRMUTE' +
				' ' +
				options.instanceID +
				' ' +
				options.channel +
				' ' +
				options.muteStatus
			console.log(cmd)
			break
		case 'incFaderLevelTimer':
			self.Fader_Timer(
				'start',
				options.rate,
				options.command,
				options.deviceID,
				options.instanceID,
				options.channel,
				options.amount
			)
			break
		case 'incFaderLevelStop':
			self.Fader_Timer('increase', 'stop', null)
		case 'customCommand':
			cmd = options.command
			break
	}

	if (cmd !== undefined) {
		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd + '\r\n')
		} else {
			debug('Socket not connected :(')
		}
	} else {
		self.log('error', 'Invalid command: ' + cmd)
	}
}

instance.prototype.Fader_Change = function (command, deviceID, instanceID, channel, amount) {
	let self = this

	cmd = command + ' ' + deviceID + ' ' + 'FDRLVL' + ' ' + instanceID + ' ' + channel + ' ' + amount

	if (cmd !== undefined) {
		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd + '\r\n')
		} else {
			debug('Socket not connected :(')
		}
	} else {
		self.log('error', 'Invalid command: ' + cmd)
	}
}

instance.prototype.Fader_Timer = function (mode, rate, command, deviceID, instanceID, channel, amount) {
	let self = this

	if (self.TIMER_FADER !== null) {
		clearInterval(self.TIMER_FADER)
		self.TIMER_FADER = null
	}

	if (mode === 'start') {
		self.TIMER_FADER = setInterval(
			self.Fader_Change.bind(self),
			parseInt(rate),
			command,
			deviceID,
			instanceID,
			channel,
			amount
		)
	}
}

instance_skel.extendedBy(instance)
exports = module.exports = instance
