export function getVariables() {
	var variables = [];

	variables.push({ variableId: 'connection', name: 'Connection' });

	for (let i = 1; i <= this.config.variableCount; i++) {
		variables.push({ variableId: `variable` + i, name: `Variable ` + i });
	}

	return variables;
}

export function updateVariables() {
	try {
		let variableObj = {
			connection: this.CONNECTED,
		};

		for (let i = 1; i <= this.config.variableCount; i++) {
			variableObj[`variable${i}`] = this.DEVICE_INFO[`variable${i}`];
		}

		this.setVariableValues(variableObj);
	} catch (error) {
		console.log(error)
	}
}
