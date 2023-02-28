import { InstanceBase, runEntrypoint, TCPHelper, Regex } from '@companion-module/base';

import * as actions from './actions.js';
import * as presets from './presets.js';
import * as variables from './variables.js';
import * as configs from './configs.js';
import * as actionFunctions from './actionsFunctions.js';
import * as utils from './utils.js';

class BiampAudiaInstance extends InstanceBase {
	constructor(internal) {
		super(internal);

		Object.assign(this, {
			...configs,
			...actions,
			...actionFunctions,
			...presets,
			...variables,
			...utils,
		});

		//this.updateVariables = updateVariables

		this.init(this.getConfigFields());
	}

	async init(config) {
		this.config = config;
		this.updateStatus('connecting');

		this.POLLING_INTERVAL = null; //used to poll the device every second
		this.CONNECTED = false; //used for friendly notifying of the user that we have not received data yet
		this.MAX_VARIABLES = 20;
		this.GETTING_INFO = false;

		this.LAST_LINE_SEND;
		this.LAST_LINE_RECEIVED;

		this.DEVICE_INFO = {};

		this.initConnection();

		this.initActions();
		this.initVariables();
		this.initPresets();

		this.updateVariables();
	}

	async destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy();
			delete this.socket;
		}

		if (this.POLLING_INTERVAL) {
			clearInterval(this.POLLING_INTERVAL);
			this.POLLING_INTERVAL = null;
		}
	}

	async configUpdated(config) {
		this.config = config;

		this.updateStatus('connecting');

		if (this.POLLING_INTERVAL) {
			clearInterval(this.POLLING_INTERVAL);
			this.POLLING_INTERVAL = null;
		}

		this.initConnection();

		this.initActions();
		this.initVariables();
		this.initPresets();

		this.updateVariables();
	}

	initVariables() {
		const variables = this.getVariables();
		this.setVariableDefinitions(variables);
	}

	initPresets() {
		const presets = this.getPresets();
		this.setPresetDefinitions(presets);
	}

	initActions() {
		const actions = this.getActions();
		this.setActionDefinitions(actions);
	}

	initConnection() {
		if (this.config.host !== undefined) {
			this.socket = new TCPHelper(this.config.host, 23);

			setTimeout(this.checkConnection.bind(this), 10000);

			let line = '';

			this.socket.on('data', (data) => {
				this.updateStatus('ok');

				let str = data.toString();

				for (let i = 0, len = str.length; i < len; i++) {
					let chr = str[i];
					line += chr;
			
					if (/[\r\n]$/.test(chr)) {
						this.processData(line);
						line = '';
					}
				}

				this.CONNECTED = true;
				this.setVariableValues({ connection: 'Connected' });
				if (!this.POLLING_INTERVAL && this.config.polling) {
					this.setupInterval();
				}

				//this.processData(data);
			});

			this.socket.on('error', (err) => {
				this.CONNECTED = false;
			});
		}
	}

	checkConnection() {
		if (!this.CONNECTED) {
			this.updateStatus('connection_failure');
			this.setVariableValues({ connection: 'Error' });
		}
	}

	setupInterval() {
		this.stopInterval();

		if (this.config.polling) {
			//this.getInformation();
			this.POLLING_INTERVAL = setInterval(this.getInformation.bind(this), 2000);
		}
	}

	getInformation() {
		if(this.GETTING_INFO == false) {
			this.GETTING_INFO = true;

			let i = 1;
			let self = this;
	
			while (i <= self.MAX_VARIABLES) {
				loop(i);
				i++;
			}
	
			function loop(i) {
				setTimeout(function () {
					self.fetchData(i);
				}, 500 * i);
			}

			this.GETTING_INFO = false;
		}
	}

	stopInterval() {
		if (this.POLLING_INTERVAL !== null) {
			clearInterval(this.POLLING_INTERVAL);
			this.POLLING_INTERVAL = null;
		}
	}
}
runEntrypoint(BiampAudiaInstance, []);
