import { INodeProperties } from 'n8n-workflow';

// When the resource `httpVerb` is selected, this `operation` parameter will be shown.
export const kizeoFormsDataOperations: INodeProperties[] = [

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['data'],
			},
		},
		options: [
			{
				name: 'GetDataDefinition',
				value: 'getDataDefinition',
				action: 'Get the definition of a data',
			},
			{
				name: 'PushData',
				value: 'pushData',
				action: 'Push a data to a form',
			},
		],
		default: 'getDataDefinition',
	},

];

// Here we define what to show when the `get` operation is selected.
// We do that by adding `operation: ["get"]` to `displayOptions.show`
const pushDataOperation: INodeProperties[] = [
	{
		displayName: 'Form Name or ID',
		name: 'form',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getForms',
		},
		displayOptions: {
			show: {
				resource: ['data'],
				operation: ['pushData'],
			},
		},
	},
	{
		displayName: 'User Name or ID',
		name: 'user',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getUsers',
		},
		displayOptions: {
			show: {
				resource: ['data'],
				operation: ['pushData'],
			},
		},
	},
	{
		displayName: 'Fields',
		name: 'fields',
		placeholder: 'Add fields to push',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: 'fields',
				displayName: 'Fields',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'field',
						type: 'options',
						typeOptions: {
							loadOptionsDependsOn: ['form'],
							loadOptionsMethod: 'getFields',
						},
						required: true,
						default: '',
						description: 'Field to be pushed. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.'
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						required: true,
						default: '',
						description: 'Value to push field with'
					}
				]
			}
		],
		displayOptions: {
			show: {
				resource: ['data'],
				operation: ['pushData'],
			},
		},
	},
];

const getDataDefinitionOperation: INodeProperties[] = [
	{
		displayName: 'Form Name or ID',
		name: 'form',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getForms',
		},
		displayOptions: {
			show: {
				resource: ['data'],
				operation: ['getDataDefinition'],
			},
		},
	},
	{
		displayName: 'Data',
		name: 'data',
		type: 'string',
		required: true,
		default: '',
		description: 'Data ID',
		displayOptions: {
			show: {
				resource: ['data'],
				operation: ['getDataDefinition'],
			},
		},
	},
];



export const kizeoFormsDataFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                httpVerb:get                                */
	/* -------------------------------------------------------------------------- */
	...getDataDefinitionOperation,
	...pushDataOperation,
];
