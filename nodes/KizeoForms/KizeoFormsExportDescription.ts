import { INodeProperties } from 'n8n-workflow';

// When the resource `httpVerb` is selected, this `operation` parameter will be shown.
export const kizeoFormsExportOperations: INodeProperties[] = [

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['export'],
			},
		},
		options: [
			{
				name: 'DownloadStandardPDF',
				value: 'downloadStandardPDF',
				action: 'Get PDF data of a form',
			},
			{
				name: 'DownloadCustomExportInPDF',
				value: 'downloadCustomExportInPDF',
				action: 'Download a custom export in PDF',
			},
			{
				name: 'DownloadCustomExportInItsOriginalFormat',
				value: 'downloadCustomExportInItsOriginalFormat',
				action: 'Download a custom export in its original format',
			},
		],
		default: 'downloadStandardPDF',
	},

];

// Here we define what to show when the DELETE Operation is selected.
// We do that by adding `operation: ["delete"]` to `displayOptions.show`
const downloadStandardPDFOperation: INodeProperties[] = [
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
				resource: ['export'],
				operation: ['downloadStandardPDF'],
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
				resource: ['export'],
				operation: ['downloadStandardPDF'],
			},
		},
	},
];

const downloadCustomExportInPDFOperation: INodeProperties[] = [
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
				resource: ['export'],
				operation: ['downloadCustomExportInPDF'],
			},
		},
	},
	{
		displayName: 'Export Name or ID',
		name: 'export',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsDependsOn: ['form'],
			loadOptionsMethod: 'getExports',
		},
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['downloadCustomExportInPDF'],
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
				resource: ['export'],
				operation: ['downloadCustomExportInPDF'],
			},
		},
	},
];

const downloadCustomExportInItsOriginalFormatOperation: INodeProperties[] = [
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
				resource: ['export'],
				operation: ['downloadCustomExportInItsOriginalFormat'],
			},
		},
	},
	{
		displayName: 'Export Name or ID',
		name: 'export',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsDependsOn: ['form'],
			loadOptionsMethod: 'getExports',
		},
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['downloadCustomExportInItsOriginalFormat'],
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
				resource: ['export'],
				operation: ['downloadCustomExportInItsOriginalFormat'],
			},
		},
	},
];




export const kizeoFormsExportFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                httpVerb:get                                */
	/* -------------------------------------------------------------------------- */
	/* -------------------------------------------------------------------------- */
	/*                              httpVerb:delete                               */
	/* -------------------------------------------------------------------------- */
	...downloadStandardPDFOperation,
	...downloadCustomExportInPDFOperation,
	...downloadCustomExportInItsOriginalFormatOperation,
];
