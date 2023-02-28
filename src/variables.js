export function getVariables() {
	const variables = [];

	variables.push({ variableId: 'connection', name: 'Connection' });

	for (let i = 1; i <= this.config.variableCount; i++) {
		variables.push({ variableId: `variable` + i, name: `Variable ` + i });
	}

	return variables;
}

export function updateVariables() {
	try {
		let variableObj = {
			connection: this.DEVICEINFO.connection,
		};

		for (let i = 1; i <= this.OUTPUTS; i++) {
			variableObj[`variable${i}`] = this.DEVICEINFO[i];
		}

		this.setVariableValues(variableObj);
	} catch (error) {}
}
