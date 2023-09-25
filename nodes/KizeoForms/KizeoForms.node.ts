import {
	IBinaryData,
	IBinaryKeyData,
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { OptionsWithUri } from 'request-promise-native';
import { kizeoFormsApiRequest } from './GenericFunctions';
import { kizeoFormsExportFields, kizeoFormsExportOperations } from './KizeoFormsExportDescription';
import {
	kizeoFormsFormDataFields as kizeoFormsFormDataFields,
	kizeoFormsFormDataOperations,
} from './KizeoFormsFormDataDescription';
// import {
// 	kizeoFormsAdvancedListsFields,
// 	kizeoFormsAdvancedListsOperations,
// } from './KizeoFormsAdvancedListsDescription';
import { kizeoFormsFormsFields, kizeoFormsFormsOperations } from './KizeoFormsFormsDescription';

export const endpoint = 'https://forms.kizeo.com/rest/';
export class KizeoForms implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kizeo Forms',
		name: 'kizeoForms',
		icon: 'file:KizeoForms.svg',
		group: ['transform'],
		version: 2,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Interact with KizoForms API',
		defaults: {
			name: 'KizeoForms',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'kizeoFormsApi',
				required: true,
			},
		],

		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Form Data',
						value: 'formData',
					},
					{
						name: 'Export',
						value: 'export',
					},
					// {
					// 	name: 'Advanced Lists',
					// 	value: 'advancedLists',
					// },
					{
						name: 'Forms',
						value: 'forms',
					},
				],
				default: 'formData',
			},
			...kizeoFormsExportOperations,
			...kizeoFormsExportFields,
			...kizeoFormsFormDataOperations,
			...kizeoFormsFormDataFields,
			// ...kizeoFormsAdvancedListsOperations,
			// ...kizeoFormsAdvancedListsFields,
			...kizeoFormsFormsOperations,
			...kizeoFormsFormsFields,
		],
	};

	methods = {
		loadOptions: {
			async getForms(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const { forms } = await kizeoFormsApiRequest.call(this, 'GET', 'v3/forms?used-with-n8n=');
				for (const form of forms) {
					const formName = form.name;
					const formId = form.id;
					returnData.push({
						name: formName,
						value: formId,
					});
				}
				return returnData;
			},
			async getExports(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const form = this.getNodeParameter('form', 0) as string;
				const { exports } = await kizeoFormsApiRequest.call(
					this,
					'GET',
					`v3/forms/${form}/exports?used-with-n8n=`,
				);
				for (const exp of exports) {
					const expName = exp.name;
					const expId = exp.id;
					returnData.push({
						name: expName,
						value: expId,
					});
				}
				return returnData;
			},
			async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const { data } = await kizeoFormsApiRequest.call(this, 'GET', 'v3/users?used-with-n8n=');

				for (const user of data.users) {
					const userName = user.first_name + ' ' + user.last_name;
					const userId = user.id;
					returnData.push({
						name: userName,
						value: userId,
					});
				}
				return returnData;
			},

			async getFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// const usedFields = this.getNodeParameter('fields', 0) as {
				// 	fields: {
				// 		field: string;
				// 		value: string;
				// 	}[];
				// };
				const formId = this.getNodeParameter('form', 0) as string;
				const { form } = await kizeoFormsApiRequest.call(
					this,
					'GET',
					`v3/forms/${formId}?used-with-n8n=`,
				);
				const fields = [];
				const results: Record<string, any> = form.fields;

				for (let i = 0; i < Object.keys(results).length; i++) {
					const fieldId = Object.keys(results)[i];

					// if (Object.values(results)[i].type === 'text' && !usedFields.fields.some(item => item.field === fieldId)) {
					if (Object.values(results)[i].type === 'text') {
						fields.push({
							name: Object.values(results)[i].caption,
							value: fieldId,
						});
					}
				}
				return fields;
			},
			async getList(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const { lists } = await kizeoFormsApiRequest.call(this, 'GET', 'v3/lists?used-with-n8n=');
				for (const list of lists) {
					const listName = list.name;
					const listId = list.id;
					returnData.push({
						name: listName,
						value: listId,
					});
				}
				return returnData;
			},
			async getListProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const listId = this.getNodeParameter('list', 0) as string;
				const { properties_definition } = await kizeoFormsApiRequest.call(
					this,
					'GET',
					`public/v4/lists/${listId}/definition?used-with-n8n=`,
				);
				const properties = [];
				const results: Record<string, any> = properties_definition;

				for (let i = 0; i < Object.keys(results).length; i++) {
					const propertyId = Object.keys(results)[i];
					properties.push({
						name: Object.values(results)[i].display_name,
						value: propertyId,
					});
				}
				return properties;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const returnData: IDataObject[] = [];
		for (let i = 0; i < items.length; i++) {
			if (resource === 'formData') {
				if (operation === 'getDataDefinition') {
					const formId = this.getNodeParameter('form', 0) as string;
					const dataId = this.getNodeParameter('data', 0) as string;

					const data = await kizeoFormsApiRequest.call(
						this,
						'GET',
						`v3/forms/${formId}/data/${dataId}?format=4&used-with-n8n=`,
					);

					return [this.helpers.returnJsonArray(data)];
				} else if (operation === 'pushData') {
					const formId = this.getNodeParameter('form', 0) as string;
					const userId = this.getNodeParameter('user', 0) as string;
					const fields = this.getNodeParameter('fields', 0) as {
						fields: {
							field: string;
							value: string;
						}[];
					};

					type Body = {
						recipient_user_id: string;
						fields: Record<string, { value: string }>;
					};

					const body: Body = {
						recipient_user_id: userId,
						fields: {},
					};

					for (const field of fields.fields) {
						const fieldId = field.field;
						const fieldValue = field.value;
						body.fields[fieldId] = { value: fieldValue };
					}

					const data = await kizeoFormsApiRequest.call(
						this,
						'POST',
						`v3/forms/${formId}/push?used-with-n8n=`,
						body,
					);

					return [this.helpers.returnJsonArray(data)];
				}
			}
			if (resource === 'export') {
				if (operation === 'downloadStandardPDF') {
					const formId = this.getNodeParameter('form', 0) as string;
					const dataId = this.getNodeParameter('data', 0) as string;
					const credentials = (await this.getCredentials('kizeoFormsApi')) as IDataObject;

					const apiKey = credentials.apiKey;

					const options: OptionsWithUri = {
						uri: endpoint + `v3/forms/${formId}/data/${dataId}/pdf?used-with-n8n=`,
						method: 'GET',
						headers: {
							Accept: 'application/pdf',
							Authorization: apiKey,
						},
						encoding: null,
						resolveWithFullResponse: true,
					};

					const response = await this.helpers.request!(options);
					const binaryData = Buffer.from(response.body, 'binary');

					const mimeType = 'application/pdf';
					const contentDisposition = response.headers['content-disposition'];
					const regex = /filename=(.+)/;
					const matches = regex.exec(contentDisposition);
					const fileName = matches ? matches[1] : 'file';

					const data = binaryData!.toString('base64');

					const binary = {
						['data']: { data, fileName, mimeType } as IBinaryData,
					} as IBinaryKeyData;

					return [
						[
							{
								json: {},
								binary,
							},
						],
					];
				} else if (operation === 'downloadCustomExportInItsOriginalFormat') {
					const formId = this.getNodeParameter('form', 0) as string;
					const exp = this.getNodeParameter('export', 0) as string;
					const format = this.getNodeParameter('exportInPDF', 0) as boolean;
					const dataId = this.getNodeParameter('data', 0) as string;
					const credentials = (await this.getCredentials('kizeoFormsApi')) as IDataObject;

					const apiKey = credentials.apiKey;
					let uri = '';
					let headers = {};

					if (format) {
						uri = endpoint + `v3/forms/${formId}/data/${dataId}/exports/${exp}/pdf?used-with-n8n=`;
						headers = {
							Accept: 'application/pdf',
							Authorization: apiKey,
						};
					} else {
						uri = endpoint + `v3/forms/${formId}/data/${dataId}/exports/${exp}?used-with-n8n=`;
						headers = {
							Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
							Authorization: apiKey,
						};
					}
					const options: OptionsWithUri = {
						uri: uri,
						method: 'GET',
						headers: headers,
						encoding: null,
						resolveWithFullResponse: true,
					};

					const response = await this.helpers.request!(options);
					const binaryData = Buffer.from(response.body, 'binary');

					const mimeType = response.headers['content-type'];

					const contentDisposition = response.headers['content-disposition'];
					const regex = /filename="(.+)"/;
					const matches = regex.exec(contentDisposition);
					const fileName = matches ? matches[1] : 'file';

					const data = binaryData!.toString('base64');
					const binary = {
						['data']: { data, fileName, mimeType } as IBinaryData,
					} as IBinaryKeyData;

					return [
						[
							{
								json: {},
								binary,
							},
						],
					];
				}
			}
			if (resource === 'advancedLists') {
				if (operation === 'getListDefinition') {
					const listId = this.getNodeParameter('list', 0) as string;

					const data = await kizeoFormsApiRequest.call(
						this,
						'GET',
						`public/v4/lists/${listId}/definition?used-with-n8n=`,
					);

					return [this.helpers.returnJsonArray(data)];
				} else if (operation === 'getItem') {
					const listId = this.getNodeParameter('list', 0) as string;
					const itemId = this.getNodeParameter('item', 0) as string;

					const data = await kizeoFormsApiRequest.call(
						this,
						'GET',
						`public/v4/lists/${listId}/items/${itemId}?used-with-n8n=`,
					);

					return [this.helpers.returnJsonArray(data)];
				} else if (operation === 'createListItem') {
					const listId = this.getNodeParameter('list', 0) as string;
					const itemLabel = this.getNodeParameter('itemLabel', 0) as string;
					const properties = this.getNodeParameter('properties', 0) as {
						properties: {
							property: string;
							value: string;
						}[];
					};

					type Body = {
						items: [
							{
								label: string;
								properties: Record<string, string | number>;
							},
						];
					};

					const body: Body = {
						items: [
							{
								label: itemLabel,
								properties: {},
							},
						],
					};

					for (const property of properties.properties) {
						const propertyId = property.property;
						const propertyValue = property.value;
						body.items[0].properties[propertyId] = parseFloat(propertyValue)
							? parseFloat(propertyValue)
							: propertyValue;
					}
					const data = await kizeoFormsApiRequest.call(
						this,
						'POST',
						`public/v4/lists/${listId}/items?used-with-n8n=`,
						body,
					);

					return [this.helpers.returnJsonArray(data)];
				} else if (operation === 'getAllListItems') {
					const listId = this.getNodeParameter('list', 0) as string;
					const search = this.getNodeParameter('search', 0) as string;
					const offset = this.getNodeParameter('offset', 0) as number;
					const limit = this.getNodeParameter('limit', 0) as number;
					const sort = this.getNodeParameter('sort', 0) as string;
					const direction = this.getNodeParameter('direction', 0) as string;

					let parameters = '';
					if (search) parameters += `search=${search}&`;
					if (offset) parameters += `offset=${offset}&`;
					if (limit) parameters += `limit=${limit}&`;
					if (sort) parameters += `sort=${sort}&`;
					if (direction) parameters += `direction=${direction}&`;

					const data = await kizeoFormsApiRequest.call(
						this,
						'GET',
						`public/v4/lists/${listId}/items?${parameters}used-with-n8n=`,
					);

					return [this.helpers.returnJsonArray(data)];
				} else if (operation === 'editListItem') {
					const listId = this.getNodeParameter('list', 0) as string;
					const itemId = this.getNodeParameter('item', 0) as string;
					const itemLabel = this.getNodeParameter('itemLabel', 0) as string;
					const properties = this.getNodeParameter('properties', 0) as {
						properties: {
							property: string;
							value: string;
						}[];
					};

					type Body = {
						items: [
							{
								item_id: string;
								label: string;
								properties: Record<string, string | number>;
							},
						];
					};

					const body: Body = {
						items: [
							{
								item_id: itemId,
								label: itemLabel,
								properties: {},
							},
						],
					};

					for (const property of properties.properties) {
						const propertyId = property.property;
						const propertyValue = property.value;
						body.items[0].properties[propertyId] = parseFloat(propertyValue)
							? parseFloat(propertyValue)
							: propertyValue;
					}
					const data = await kizeoFormsApiRequest.call(
						this,
						'PATCH',
						`public/v4/lists/${listId}/items?used-with-n8n=`,
						body,
					);

					return [this.helpers.returnJsonArray(data)];
				} else if (operation === 'deleteListItem') {
					const listId = this.getNodeParameter('list', 0) as string;
					const itemId = this.getNodeParameter('item', 0) as string;

					const data = await kizeoFormsApiRequest.call(
						this,
						'DELETE',
						`public/v4/lists/${listId}/items/${itemId}?used-with-n8n=`,
					);

					return [this.helpers.returnJsonArray(data)];
				}
			}
			if (resource === 'forms') {
				if (operation === 'getAllForms') {
					const data = await kizeoFormsApiRequest.call(this, 'GET', `v3/forms?used-with-n8n=`);

					return [this.helpers.returnJsonArray(data)];
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
