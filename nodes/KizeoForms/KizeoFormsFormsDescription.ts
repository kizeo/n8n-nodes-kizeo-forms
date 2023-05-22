import { INodeProperties } from 'n8n-workflow';

export const kizeoFormsFormsOperations: INodeProperties[] = [

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['forms'],
			},
		},
		options: [
			{
				name: 'GetAllForms',
				value: 'getAllForms',
				action: 'List all forms',
			},
		],
		default: 'getAllForms',
	},

];


export const kizeoFormsFormsFields: INodeProperties[] = [

];
