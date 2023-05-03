import { IBinaryData, IBinaryKeyData, IDataObject, IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodePropertyOptions, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { OptionsWithUri } from 'request-promise-native';
import { kizeoFormsApiRequest } from './GenericFunctions';
import { kizeoFormsExportFields, kizeoFormsExportOperations } from './KizeoFormsExportDescription';
import { kizeoFormsDataFields, kizeoFormsDataOperations } from './KizeoFormsDataDescription';


export class KizeoForms implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'KizeoForms',
		name: 'kizeoForms',
		icon: 'file:icon.svg',
		group: ['transform'],
		version: 1,
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
						name: 'Data',
						value: 'data',
					},
					{
						name: 'Export',
						value: 'export',
					},
				],
				default: 'data',
			},
			...kizeoFormsExportOperations,
			...kizeoFormsExportFields,
			...kizeoFormsDataOperations,
			...kizeoFormsDataFields,
		],
	};

	methods = {
		loadOptions: {

			async getForms(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const { forms } = await kizeoFormsApiRequest.call(this, 'GET', 'v3/forms');
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
				const { exports } = await kizeoFormsApiRequest.call(this, 'GET', `v3/forms/${form}/exports`);
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
				const { data } = await kizeoFormsApiRequest.call(this, 'GET', 'v3/users');

				for (const user of data.users) {
					const userLogin = user.login;
					const userId = user.id;
					returnData.push({
						name: userLogin,
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
				const { form } = await kizeoFormsApiRequest.call(this, 'GET', `v3/forms/${formId}`);
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
		}
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const returnData: IDataObject[] = [];
		for (let i = 0; i < items.length; i++) {
			if (resource === 'data') {
				if (operation === 'getDataDefinition') {
					const formId = this.getNodeParameter('form', 0) as string;
					const dataId = this.getNodeParameter('data', 0) as string;

					const data = await kizeoFormsApiRequest.call(this, 'GET', `v3/forms/${formId}/data/${dataId}?format=4`);

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
						'recipient_user_id': userId,
						fields: {}
					};

					for (const field of fields.fields) {
						const fieldId = field.field;
						const fieldValue = field.value;
						body.fields[fieldId] = { "value": fieldValue };
					}

					const data = await kizeoFormsApiRequest.call(this, 'POST', `v3/forms/${formId}/push`, body);

					return [this.helpers.returnJsonArray(data)];
				}
			}
			if (resource === 'export') {
				if (operation === 'downloadStandardPDF') {
					const formId = this.getNodeParameter('form', 0) as string;
					const dataId = this.getNodeParameter('data', 0) as string;
					const credentials = await this.getCredentials('kizeoFormsApi') as IDataObject;

					const apiKey = credentials.apiKey;

					const options: OptionsWithUri = {
						uri: `https://forms.kizeo.com/rest/v3/forms/${formId}/data/${dataId}/pdf?used-with-n8n=`,
						method: 'GET',
						headers: {
							'Accept': 'application/pdf',
							'Authorization': apiKey
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
					const fileName = matches ? matches[1] : "file";

					const data = binaryData!.toString('base64');

					const binary = { ["data"]: { data, fileName, mimeType } as IBinaryData } as IBinaryKeyData;

					return [[{
						json: {},
						binary
					}]];
				} else if (operation === 'downloadCustomExportInPDF') {
					const formId = this.getNodeParameter('form', 0) as string;
					const exp = this.getNodeParameter('export', 0) as string;
					const dataId = this.getNodeParameter('data', 0) as string;
					const credentials = await this.getCredentials('kizeoFormsApi') as IDataObject;

					const apiKey = credentials.apiKey;

					const options: OptionsWithUri = {
						uri: `https://forms.kizeo.com/rest/v3/forms/${formId}/data/${dataId}/exports/${exp}/pdf?used-with-n8n=`,
						method: 'GET',
						headers: {
							'Accept': 'application/pdf',
							'Authorization': apiKey
						},
						encoding: null,
						resolveWithFullResponse: true,
					};

					const response = await this.helpers.request!(options);

					const binaryData = Buffer.from(response.body, 'binary');

					const mimeType = 'application/pdf';
					const contentDisposition = response.headers['content-disposition'];
					const regex = /filename="(.+)"/;
					const matches = regex.exec(contentDisposition);
					const fileName = matches ? matches[1] : "file";

					const data = binaryData!.toString('base64');

					const binary = { ["data"]: { data, fileName, mimeType } as IBinaryData } as IBinaryKeyData;

					return [[{
						json: {},
						binary
					}]];
				} else if (operation === 'downloadCustomExportInItsOriginalFormat') {
					const formId = this.getNodeParameter('form', 0) as string;
					const exp = this.getNodeParameter('export', 0) as string;
					const dataId = this.getNodeParameter('data', 0) as string;
					const credentials = await this.getCredentials('kizeoFormsApi') as IDataObject;

					const apiKey = credentials.apiKey;

					const options: OptionsWithUri = {
						uri: `https://forms.kizeo.com/rest/v3/forms/${formId}/data/${dataId}/exports/${exp}?used-with-n8n=`,
						method: 'GET',
						headers: {
							'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
							'Authorization': apiKey
						},
						encoding: null,
						resolveWithFullResponse: true,
					};

					const response = await this.helpers.request!(options);
					const binaryData = Buffer.from(response.body, 'binary');

					const mimeType = response.headers['content-type'];

					const contentDisposition = response.headers['content-disposition'];
					const regex = /filename="(.+)"/;
					const matches = regex.exec(contentDisposition);
					const fileName = matches ? matches[1] : "file";

					const data = binaryData!.toString('base64');
					const binary = { ["data"]: { data, fileName, mimeType } as IBinaryData } as IBinaryKeyData;

					return [[{
						json: {},
						binary
					}]];
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
