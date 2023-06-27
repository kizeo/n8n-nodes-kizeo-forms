import { INodeProperties } from 'n8n-workflow';

export const kizeoFormsAdvancedListsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['advancedLists'],
			},
		},
		options: [
			{
				name: 'CreateListItem',
				value: 'createListItem',
				action: 'Create list item',
			},
			{
				name: 'DeleteListItem',
				value: 'deleteListItem',
				action: 'Delete an item from a list',
			},
			{
				name: 'EditListItem',
				value: 'editListItem',
				action: 'Edit an item from a list',
			},
			{
				name: 'GetAllListItems',
				value: 'getAllListItems',
				action: 'List all items of given list',
			},
			{
				name: 'GetItem',
				value: 'getItem',
				action: 'Get an item from a list',
			},
			{
				name: 'GetListDefinition',
				value: 'getListDefinition',
				action: 'Get the definition of a list',
			},
		],
		default: 'getListDefinition',
	},
];

const getListDefinitionOperation: INodeProperties[] = [
	{
		displayName: 'List Name or ID',
		name: 'list',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getList',
		},
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['getListDefinition'],
			},
		},
	},
];

const getItemOperation: INodeProperties[] = [
	{
		displayName: 'List Name or ID',
		name: 'list',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getList',
		},
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['getItem'],
			},
		},
	},
	{
		displayName: 'Item ID',
		name: 'item',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['getItem'],
			},
		},
	},
];

const createListItemOperation: INodeProperties[] = [
	{
		displayName: 'List Name or ID',
		name: 'list',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getList',
		},
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['createListItem'],
			},
		},
	},
	{
		displayName: 'Item Label',
		name: 'itemLabel',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['createListItem'],
			},
		},
	},
	{
		displayName: 'Properties',
		name: 'properties',
		placeholder: 'Add properties',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: 'properties',
				displayName: 'Properties',
				values: [
					{
						displayName: 'Property Name or ID',
						name: 'property',
						type: 'options',
						typeOptions: {
							loadOptionsDependsOn: ['list'],
							loadOptionsMethod: 'getListProperties',
						},
						required: true,
						default: '',
						description:
							'Property Name or ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						required: true,
						default: '',
						description: 'Item property value',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['createListItem'],
			},
		},
	},
];

const getAllListItemsOperation: INodeProperties[] = [
	{
		displayName: 'List Name or ID',
		name: 'list',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getList',
		},
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['getAllListItems'],
			},
		},
	},
	{
		displayName: 'Search',
		name: 'search',
		type: 'string',
		description: 'Pattern to search',
		default: '',
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['getAllListItems'],
			},
		},
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['getAllListItems'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		description: 'Max number of results to return',
		default: 50,
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['getAllListItems'],
			},
		},
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'string',
		description: 'Target for sorting',
		default: '',
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['getAllListItems'],
			},
		},
	},
	{
		displayName: 'Direction',
		name: 'direction',
		type: 'string',
		description: 'Sorting: asc or desc',
		default: '',
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['getAllListItems'],
			},
		},
	},
];

const editListItemOperation: INodeProperties[] = [
	{
		displayName: 'List Name or ID',
		name: 'list',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getList',
		},
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['editListItem'],
			},
		},
	},
	{
		displayName: 'Item ID',
		name: 'item',
		type: 'string',
		description: 'ID of the item',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['editListItem'],
			},
		},
	},
	{
		displayName: 'Item Label',
		name: 'itemLabel',
		type: 'string',
		required: true,
		default: '',
		description: 'Label of the item',
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['editListItem'],
			},
		},
	},
	{
		displayName: 'Properties',
		name: 'properties',
		placeholder: 'Add properties',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: 'properties',
				displayName: 'Properties',
				values: [
					{
						displayName: 'Property Name or ID',
						name: 'property',
						type: 'options',
						typeOptions: {
							loadOptionsDependsOn: ['list'],
							loadOptionsMethod: 'getListProperties',
						},
						required: true,
						default: '',
						description:
							'Property Name or ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						required: true,
						default: '',
						description: 'Item property value',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['editListItem'],
			},
		},
	},
];

const deleteListItemOperation: INodeProperties[] = [
	{
		displayName: 'List Name or ID',
		name: 'list',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getList',
		},
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['deleteListItem'],
			},
		},
	},
	{
		displayName: 'Item ID',
		name: 'item',
		type: 'string',
		description: 'ID of the item',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['advancedLists'],
				operation: ['deleteListItem'],
			},
		},
	},
];

export const kizeoFormsAdvancedListsFields: INodeProperties[] = [
	...getListDefinitionOperation,
	...getItemOperation,
	...createListItemOperation,
	...getAllListItemsOperation,
	...editListItemOperation,
	...deleteListItemOperation,
];