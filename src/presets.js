import { combineRgb } from '@companion-module/base';

export function getPresets() {
	let presets = {};

	const ColorWhite = combineRgb(255, 255, 255);
	const ColorBlack = combineRgb(0, 0, 0);
	const ColorRed = combineRgb(200, 0, 0);
	const ColorGreen = combineRgb(0, 200, 0);

	presets['incFader'] = {
		type: 'button',
		category: 'Fader Level',
		name: 'Inc Fader',
		style: {
			style: 'text',
			text: '🔊',
			size: '20',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		steps: [
			{
				down: [
					{
						actionId: 'incFaderLevelTimer',
						options: {
							rate: '200',
							command: 'INC',
							deviceID: 1,
							instanceID: 1,
							channel: 1,
							amount: 1,
						},
					},
				],
				up: [
					{
						actionId: 'incFaderLevelStop',
					},
				],
			},
		],
		feedbacks: [],
	};

	presets['decFader'] = {
		type: 'button',
		category: 'Fader Level',
		name: 'Dec Fader',
		style: {
			style: 'text',
			text: '🔉',
			size: '20',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		steps: [
			{
				down: [
					{
						actionId: 'incFaderLevelTimer',
						options: {
							rate: '200',
							command: 'DEC',
							deviceID: 1,
							instanceID: 1,
							channel: 1,
							amount: 1,
						},
					},
				],
				up: [
					{
						actionId: 'incFaderLevelStop',
					},
				],
			},
		],
		feedbacks: [],
	};

	return presets;
}
