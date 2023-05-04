import { IHookFunctions, IWebhookFunctions } from 'n8n-core';

import {
	IDataObject,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import { kizeoFormsApiRequest } from './GenericFunctions';

export class KizeoFormsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Event On Data Trigger',
		name: 'kizeoFormsTrigger',
		group: ['trigger'],
		version: 1,
		icon: 'file:icon.svg',
		subtitle: '={{$parameter["event_types"]}}',
		description: 'Handle EventOnData events via webhooks',
		defaults: {
			name: 'Event On Data Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'kizeoFormsApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
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
			},
			{
				displayName: 'Event',
				name: 'event_types',
				type: 'multiOptions',
				required: true,
				default: [],
				options: [
					{
						name: 'Data Deleted',
						value: 'delete',
					},
					{
						name: 'Data Saved',
						value: 'finished',
					},
					{
						name: 'Data Updated',
						value: 'update',
					},
					{
						name: 'Push Received',
						value: 'pull',
					},
					{
						name: 'Push Send',
						value: 'push',
					},
				],
			},
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
		},
	};
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// const webhookData = this.getWorkflowStaticData('node');
				// const webhookUrl = this.getNodeWebhookUrl('default');
				// const event = this.getNodeParameter('event_types') as string;
				// const { hooks: webhooks } = await kizeoFormsApiRequest.call(this, 'GET', '/list');
				// for (const webhook of webhooks) {
				//     if (webhook.settings.other.url === webhookUrl && webhook.settings.on_events === event)) {
				//         webhookData.webhookId = webhook.hook_id;
				//         return true;
				//     }
				// }
				// return false;
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const event = this.getNodeParameter('event_types') as string;
				const formId = this.getNodeParameter('form') as string;
				const body: IDataObject = {
					on_events: event,
					url: webhookUrl,
					httpVerb: 'POST',
					bodyContentChoice: 'json_v4',
					third_party: 'n8n ' + this.getWorkflow().id,
				};
				const webhook = await kizeoFormsApiRequest.call(
					this,
					'POST',
					`public/v4/forms/${formId}/third_party_webhooks`,
					body,
				);
				webhookData.webhookId = webhook.id;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const formId = this.getNodeParameter('form') as string;
				if (!webhookData.webhookId) {
					return false;
				}
				try {
					await kizeoFormsApiRequest.call(
						this,
						'DELETE',
						`public/v4/forms/${formId}/third_party_webhooks/${webhookData.webhookId}`,
					);
				} catch (error) {
					return false;
				}
				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();

		return {
			workflowData: [this.helpers.returnJsonArray(req.body)],
		};
	}
}