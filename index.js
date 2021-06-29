// BiAmp Audia

var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
const { slice } = require('lodash');
var debug;
var log;

function instance(system, id, config) {
	let self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

//instance.prototype.DATA_BUFFER = null;

//instance.prototype.LAST_LINE_RECEIVED = null;

instance.prototype.TIMER_FADER = null;

//instance.prototype.VAR_POLL_INTERVAL = null;

instance.prototype.updateConfig = function(config) {
	let self = this;

	self.config = config;

	// Variables and feedbacks coming to a future release

	//self.initVariables();
	//self.initFeedbacks();
	self.initPresets();
	self.init_tcp();
};

instance.prototype.init = function() {
	let self = this;

	debug = self.debug;
	log = self.log;

	// Variables and feedbacks coming to a future release.

	//self.initVariables();
	//self.initFeedbacks();
	self.initPresets();
	self.init_tcp();
};

/*instance.prototype.initVariables = function() {
	
	let self = this;

	let variables = [
		{
			label: 'Variable 1',
			name: 'variable1'
		},
		{
			label: 'Variable 2',
			name: 'variable2'
		},
		{
			label: 'Variable 3',
			name: 'variable3'
		},
		{
			label: 'Variable 4',
			name: 'variable4'
		},
		{
			label: 'Variable 5',
			name: 'variable5'
		},
		{
			label: 'Variable 6',
			name: 'variable6'
		},
		{
			label: 'Variable 7',
			name: 'variable7'
		},
		{
			label: 'Variable 8',
			name: 'variable8'
		},
		{
			label: 'Variable 9',
			name: 'variable9'
		},
		{
			label: 'Variable 10',
			name: 'variable10'
		}
	];

	self.setVariableDefinitions(variables);
	self.initVariablePolling();

}; */

instance.prototype.init_tcp = function() {
	let self = this;
	let cmd;
	let receivebuffer;

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	self.config.port = 23;

	if (self.config.host && self.config.port) {
		self.socket = new tcp(self.config.host, self.config.port);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug('Network error', err);
			self.log('error','Network error: ' + err.message);
		});

		self.socket.on('connect', function () {
			debug('Connected');
		});

		// if we get any data, display it to stdout

		this.socket.on('data', (chunk) => {
			/*var i = 0, line = '', offset = 0;
			receivebuffer += chunk;

			while ( (i = receivebuffer.indexOf('\n', offset)) !== -1) {
				line = receivebuffer.substr(offset, i - offset);
				offset = i + 1;
				this.socket.emit('receiveline', line.toString());
			}

			receivebuffer = receivebuffer.substr(offset);
			*/
		});

		/*this.socket.on('receiveline', (line) => {

			self.processFeedback(line);

		});
		*/

	}
	else {
		self.log('error', 'Please specify host in config.');
	}
};

instance.prototype.initPresets = function () {
	var self = this;
	var presets = [];

	presets.push({
		category: 'Fader Level',
		label: 'Inc Fader',
		bank: {
			style: 'text',
			text: 'Fader +',
			size: '14',
			color: '16777215',
			bgcolor: self.rgb(0, 0, 0)
		},
		actions: [{
			action: 'incFaderLevelTimer',
			options: {
				rate: '200',
				command: 'INC',
				deviceID: 1,
				instanceID: 1,
				amount: 1
			}
		}],
		release_actions: [
			{
				action: 'incFaderLevelStop'
			}
		]
	});

	presets.push({
		category: 'Fader Level',
		label: 'Dec Fader',
		bank: {
			style: 'text',
			text: 'Fader -',
			size: '14',
			color: '16777215',
			bgcolor: self.rgb(0, 0, 0)
		},
		actions: [{
			action: 'incFaderLevelTimer',
			options: {
				rate: '200',
				command: 'DEC',
				deviceID: 1,
				instanceID: 1,
				amount: 1
			}
		}],
		release_actions: [
			{
				action: 'incFaderLevelStop'
			}
		]
	});

	self.setPresetDefinitions(presets);
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	let self = this;

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
			`
		},
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module will connect to a BiAmp Audia of Nexia Processor.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'IP Address',
			width: 6,
			default: '192.168.0.1',
			regex: self.REGEX_IP
		},
		/*{
			type: 'textinput',
			id: 'rate',
			label: 'Poll Rate',
			width: 6,
			default: '500',
		},
		{
			type: 'text',
			id: 'info',
			label: 'Information',
			width: 12,
			value: `
				<div class="alert alert-danger">
					<h3>IMPORTANT MESSAGE</h3>
					<div>
						<strong>Please read and understand the following before using variables</strong>
						<br>
						In order to use variables, you must generate the poll command using BiAmp's command generation tool.
						<ul>
							<li>When you generate the command, make sure you use the get action.</li>
							<li>If you do not use the get action, then variables will not work.</li>
							<li>Click the button below to access the command calculator.</li>
							<li> Once you generate the command, enter the command and variable name below.</li>
						</ul>
						<a href="https://support.biamp.com/Audia-Nexia/Control/Audia-Nexia_command_string_calculator" target="_new" class="btn btn-warning mr-1">Audia/Nexia Command Calculator</a>
					</div>
				</div>
			`
		},
		{
			type: 'textinput',
			id: 'var1Command',
			label: 'Variable 1 Command',
			width: 6,
			default: '',
		},
		{
			type: 'textinput',
			id: 'var2Command',
			label: 'Variable 2 Command',
			width: 6,
			default: '',
		},
		{
			type: 'textinput',
			id: 'var3Command',
			label: 'Variable 3 Command',
			width: 6,
			default: '',
		},
		{
			type: 'textinput',
			id: 'var4Command',
			label: 'Variable 4 Command',
			width: 6,
			default: '',
		},
		{
			type: 'textinput',
			id: 'var5Command',
			label: 'Variable 5 Command',
			width: 6,
			default: '',
		},
		{
			type: 'textinput',
			id: 'var6Command',
			label: 'Variable 6 Command',
			width: 6,
			default: '',
		},
		{
			type: 'textinput',
			id: 'var7Command',
			label: 'Variable 7 Command',
			width: 6,
			default: '',
		},
		{
			type: 'textinput',
			id: 'var8Command',
			label: 'Variable 8 Command',
			width: 6,
			default: '',
		},
		{
			type: 'textinput',
			id: 'var9Command',
			label: 'Variable 9 Command',
			width: 6,
			default: '',
		},
		{
			type: 'textinput',
			id: 'var10Command',
			label: 'Variable 10 Command',
			width: 6,
			default: '',
		}, */
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	let self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	//destroy timers
	if (self.TIMER_FADER !== null) {
		clearInterval(this.TIMER_FADER);
		self.TIMER_FADER = null;
	}

	debug('destroy', self.id);
}

instance.prototype.actions = function() {
	let self = this;

	self.system.emit('instance_actions', self.id, {
		'setFaderLevel': {
			label: 'Set Fader Level',
			options: [
				{
					type: 'textinput',
					id: 'deviceID',
					label: 'Device ID',
					tooltip: 'Insert device ID',
					default: '1',
					width: 6
				},
				{
					type: 'textinput',
					id: 'instanceID',
					label: 'Instance ID',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6
				},
				{
					type: 'textinput',
					id: 'channel',
					label: 'Channel',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6
				},
				{
					type: 'number',
					label: 'Level',
					id: 'level',
					min: -100,
					max: 12,
					default: 0,
					required: true,
					range: true
		   		}
			]
		},
		'incFaderLevel': {
			label: 'Increment/Decrement Fader Level',
			options: [
				{
					type: 'dropdown',
					label: 'Command',
					id: 'command',
					choices: [
						{ id: 'INC', label: 'Increment' },
						{ id: 'DEC', label: 'Decrement' }
					],
					default: 'INC'
				},
				{
					type: 'textinput',
					id: 'deviceID',
					label: 'Device ID',
					tooltip: 'Insert device ID',
					default: '1',
					width: 6
				},
				{
					type: 'textinput',
					id: 'instanceID',
					label: 'Instance ID',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6
				},
				{
					type: 'textinput',
					id: 'channel',
					label: 'Channel',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6
				},
				{
					type: 'textinput',
					label: 'Increment/Decrement Amount',
					id: 'amount',
					default: 1,
					required: true
		   		}
			]
		},
		'incFaderLevelTimer': {
			label: 'Increase Fader Level 1 Point Continuously',
			options: [
				{
					type: 'number',
					label: 'Rate',
					id: 'rate',
					default: '500',
					tooltip: 'Time in milliseconds between increases'
				},{
					type: 'dropdown',
					label: 'Command',
					id: 'command',
					choices: [
						{ id: 'INC', label: 'Increment' },
						{ id: 'DEC', label: 'Decrement' }
					],
					default: 'INC'
				},
				{
					type: 'textinput',
					id: 'deviceID',
					label: 'Device ID',
					tooltip: 'Insert device ID',
					default: '1',
					width: 6
				},
				{
					type: 'textinput',
					id: 'instanceID',
					label: 'Instance ID',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6
				},
				{
					type: 'textinput',
					id: 'channel',
					label: 'Channel',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6
				},
				{
					type: 'textinput',
					label: 'Increment/Decrement Amount',
					id: 'amount',
					default: 1,
					required: true
		   		}
			]
		},
		'incFaderLevelStop': {
			label: 'Stop Increasing Fader Level',
		},
		'faderMute': {
			label: 'Fader Mute',
			options: [
				{
					type: 'textinput',
					id: 'deviceID',
					label: 'Device ID',
					tooltip: 'Insert device ID',
					default: '1',
					width: 6
				},
				{
					type: 'textinput',
					id: 'instanceID',
					label: 'Instance ID',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6
				},
				{
					type: 'textinput',
					id: 'channel',
					label: 'Channel',
					tooltip: 'Insert instance ID',
					default: '1',
					width: 6
				},
				{
					type: 'dropdown',
					label: 'Status',
					id: 'muteStatus',
					choices: [
						{ id: '1', label: 'Mute' },
						{ id: '0', label: 'Unmute' }
					],
					default: '1'
				},
			]
		},
		'customCommand': {
			label: 'Custom Command',
			options: [
				{
					type: 'text',
					id: 'info',
					width: 12,
					label: 'BiAmp has created a command calculator to create custom command strings for the Audia and Nexia controllers. Unless you know what you are doing, it is strongly recommended that you use the calculator to create your command.',
					value: ''
				},
				{
					type: 'text',
					id: 'info',
					width: 12,
					label: 'The calculator can be found here: https://support.biamp.com/Audia-Nexia/Control/Audia-Nexia_command_string_calculator',
					value: ''
				},
				{
					type: 'textinput',
					id: 'command',
					label: 'Command',
					tooltip: 'Insert device ID',
					default: '1',
					width: 6
				},
			]
		}
	});
};

instance.prototype.action = function(action) {

	let self = this;
	let cmd;
	let options = action.options;
	let muteInt;

	console.log('here');
	
	switch(action.action) {
		case 'setFaderLevel':
			cmd = 'SET' + ' ' + options.deviceID + ' '  + 'FDRLVL' + ' '  + options.instanceID + ' '  + options.channel + ' '  + options.level;
			console.log(cmd);
			break;
		case 'faderMute':
			cmd = 'SET' + ' ' + options.deviceID + ' '  + 'FDRMUTE' + ' '  + options.instanceID + ' '  + options.channel + ' '  + options.muteStatus;
			console.log(cmd);
			break;
		case 'incFaderLevelTimer':
			self.Fader_Timer('start', options.rate, options.command, options.deviceID, options.instanceID, options.channel, options.amount);
			break;
		case 'incFaderLevelStop':
			self.Fader_Timer('increase', 'stop', null);
		case 'customCommand':
			cmd = options.command;
			break;
	}

	if (cmd !== undefined) {
		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd + '\r\n');
		} else {
			debug('Socket not connected :(');
		}
	}
	else {
		self.log('error', 'Invalid command: ' + cmd);
	}
};

instance.prototype.Fader_Change = function(command, deviceID, instanceID, channel, amount) {
	let self = this;

	cmd = command + ' ' + deviceID + ' '  + 'FDRLVL' + ' '  + instanceID + ' '  + channel + ' '  + amount;

	if (cmd !== undefined) {
		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd + '\r\n');
		} else {
			debug('Socket not connected :(');
		}
	}
	else {
		self.log('error', 'Invalid command: ' + cmd);
	}

};

//Implementing variables in a future release.

/*
instance.prototype.initVariablePolling = function() {
	let self = this;

	if (self.VAR_POLL_INTERVAL != null) {
		clearInterval(self.VAR_POLL_INTERVAL);
		self.VAR_POLL_INTERVAL = null;
	}

	rate = self.config.rate;

	self.VAR_POLL_INTERVAL = setInterval(self.PollVariable.bind(self), rate)


}*/

// Implementing variables in a future release.

/*instance.prototype.PollVariable = function() {

	let self = this;

	let cmd = null;

	console.log('start data send');

	//cmd = self.config['var' + i + 'Command']

	cmd = self.config.var1Command

	console.log('Get command: ' + cmd);
	
	if (cmd !== undefined || '') {
		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd + '\n');
		} else {
			debug('Socket not connected :(');
		}
	}
	else {
		self.log('error', 'Invalid command: ' + cmd);
	}

	console.log('End Data Send');

	/*var i = 1;                  //  set your counter to 1

	function myLoop() {         //  create a loop function
	  setTimeout(function() {   //  call a 3s setTimeout when the loop is called


		i++;                    //  increment the counter
		if (i <= 10) {           //  if the counter < 10, call the loop function
		  myLoop();             //  ..  again which will trigger another 
		}                       //  ..  setTimeout()
	  }, 3000)
	}
	
	myLoop();    

} */

instance.prototype.Fader_Timer = function(mode, rate, command, deviceID, instanceID, channel, amount) {
	let self = this;

	if (self.TIMER_FADER !== null) {
		clearInterval(self.TIMER_FADER);
		self.TIMER_FADER = null;
	}

	if (mode === 'start') {
		self.TIMER_FADER = setInterval(self.Fader_Change.bind(self), parseInt(rate), command, deviceID, instanceID, channel, amount);
	}
};

//Feedbacks will be implemented in a future release.

/*instance.prototype.processFeedback = function(data) {
	let self = this;
	let LLRc;

	//data = data.replace('\n', '');

	console.log('Last Line: ' + self.LAST_LINE_RECEIVED);
	console.log('Current Line: ' + data);
	console.log('\n');
	

	for (let i = 1; i <= 10; i++) {

		LLRc = self.LAST_LINE_RECEIVED;

		cmd = self.config['var' + i + 'Command']

		console.log('Generated Loop Checked Command: ' + cmd)
		//console.log('\n')

		//self.setVariable('Variable' + i, data);

		//data = data.replace('\n', '');
		
		if (LLRc != null) {
			LLRc = LLRc.replace('\n', '');
		} else {
			return;
		}

		
		
		console.log('data: ' + data);
		console.log('LLRc: ' + LLRc);

		if (LLRc == null) {
			console.log('LLRc is NULL setting to \'\'');
			LLRc = '';
		} else {
			return;
		}

		console.log('index of cmd test: ' + LLRc.indexOf(cmd));

		if(cmd !=  '') {
			console.log('Command Not Blank');
			if (LLRc.indexOf(cmd) == 0) {
				console.log("Last line and generated command match.");
				if(data.indexOf('-ERR:SYNTAX') == -1) {
					console.log('Set Variable: ' + 'variable' + i);
					self.setVariable('variable' + i, data);
				} else {
					return;
				}
			} else {
				return;
			}
		} else {
			return;
		}
	}

	console.log('Data Index Of Result: ' + data.indexOf('-ERR:SYNTAX'));

	if (data.indexOf('-ERR:SYNTAX') == -1) {
		self.LAST_LINE_RECEIVED = data;
	}

};

instance.prototype.initFeedbacks = function () {
	let self = this;

	// feedbacks
	let feedbacks = {};

	self.setFeedbackDefinitions(feedbacks);
}
*/


instance_skel.extendedBy(instance);
exports = module.exports = instance;