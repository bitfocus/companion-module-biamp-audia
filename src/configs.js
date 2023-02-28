import { Regex } from '@companion-module/base';

export function getConfigFields() {
	let fields = [
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
			value: 'This module will connect to a Biamp Audia or Nexia Processor.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'IP Address',
			width: 6,
			default: '192.168.0.1',
			regex: Regex.IP,
		},
		{
			type: 'checkbox',
			id: 'polling',
			label: 'Enable Polling',
			default: false
		},
		{
			type: 'number',
			id: 'variableCount',
			label: 'Variable Count',
			min: 1,
			max: this.MAX_VARIABLES,
			width: 6,
			default: 1,
			regex: Regex.NUMBER,
			isVisible: function(options) {
				if (options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable1`,
			label: `Variable 1`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 1 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable2`,
			label: `Variable 2`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 2 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable3`,
			label: `Variable 3`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 3 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable4`,
			label: `Variable 4`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 4 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable5`,
			label: `Variable 5`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 5 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable6`,
			label: `Variable 6`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 6 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable7`,
			label: `Variable 7`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 7 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable8`,
			label: `Variable 8`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 8 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable9`,
			label: `Variable 9`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 9 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable10`,
			label: `Variable 10`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 10 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable11`,
			label: `Variable 11`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 11 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable12`,
			label: `Variable 12`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 12 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable13`,
			label: `Variable 13`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 13 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable14`,
			label: `Variable 14`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 14 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable15`,
			label: `Variable 15`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 15 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable16`,
			label: `Variable 16`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 16 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable17`,
			label: `Variable 17`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 17 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable18`,
			label: `Variable 18`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 18 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable19`,
			label: `Variable 19`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 19 && options.polling == true) {
					return true
				} else return false;
			}
		},
		{
			type: 'textinput',
			id: `variable20`,
			label: `Variable 20`,
			width: 6,
			isVisible: function(options) {
				if (options.variableCount >= 20 && options.polling == true) {
					return true
				} else return false;
			}
		},

	];

	return fields;
	
}
