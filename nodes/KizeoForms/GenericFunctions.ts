import {
    OptionsWithUri,
} from 'request';

import {
    IExecuteFunctions,
    ILoadOptionsFunctions,
} from 'n8n-core';

import {
    IDataObject,
    IHookFunctions,
    IWebhookFunctions,
} from 'n8n-workflow';

export async function kizeoFormsApiRequest(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, method: string, resource: string, body: any = {}, query: IDataObject = {}, uri?: string, option: IDataObject = {}): Promise<any> {

    const credentials = await this.getCredentials('kizeoFormsApi') as IDataObject;

    const apiKey = credentials.apiKey;

    const endpoint = 'https://forms.kizeo.com/rest/';

    const options: OptionsWithUri = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiKey,
        },
        method,
        body,
        qs: query,
        uri: uri || `${endpoint}${resource}?used-with-n8n=`,
        json: true,
    };


    if (!Object.keys(body).length) {
        delete options.body;
    }

    if (!Object.keys(query).length) {
        delete options.qs;
    }

    console.log(options);
    try {
        return await this.helpers.request!(options);
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.body.message || error.response.body.description || error.message;
            throw new Error(`error response [${error.statusCode}]: ${errorMessage}`);
        }
        throw error;
    }
}

export function propertyTest() {
    return {
        displayName: 'User Name or ID',
        name: 'user',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
        required: true,
        default: '',
        typeOptions: {
            loadOptionsMethod: 'getUsers',
        },
    }
}