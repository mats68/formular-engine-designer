import { environment } from "src/environments/environment";

export function log_trace(condition: boolean, identifier: string, mode: boolean = null, ...optionalParams: any[]): void
{
	if(environment.production === false && true === condition)
	{
		if(mode === null)
			identifier = `TRACE: ${identifier}`;
		else if(mode === true)
			identifier = `TRACE: Entering ${identifier}`;
		else if(mode === false)
			identifier = `TRACE: Leaving ${identifier}`;

		console.debug(identifier, ...optionalParams);
	}

	return;
}

export function log_debug(condition: boolean, message: any, ...optionalParams: any[]): void
{
	if(environment.production === false && true === condition)
	{
		console.debug(`DEBUG: ${message}`, ...optionalParams);
	}

	return;
}
