import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class KizeoFormsApi implements ICredentialType {
	name = 'kizeoFormsApi';
	displayName = 'Kizeo Forms API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
