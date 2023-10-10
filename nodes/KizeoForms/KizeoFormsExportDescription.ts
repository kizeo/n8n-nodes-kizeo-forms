import { INodeProperties } from 'n8n-workflow';

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
        name: 'DownloadCustomExportInItsOriginalFormat',
        value: 'downloadCustomExportInItsOriginalFormat',
        action: 'Download a custom export in its original format',
      },
    ],
    default: 'downloadStandardPDF',
  },
];

const downloadStandardPDFOperation: INodeProperties[] = [
  {
    displayName: 'Form Name or ID',
    name: 'form',
    type: 'options',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
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

const downloadCustomExportInItsOriginalFormatOperation: INodeProperties[] = [
  {
    displayName: 'Form Name or ID',
    name: 'form',
    type: 'options',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
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
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
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
    displayName: 'Export in PDF',
    name: 'exportInPDF',
    type: 'boolean',
    default: false,
    description: 'Whether export in PDF or in its original format',
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
  ...downloadStandardPDFOperation,
  ...downloadCustomExportInItsOriginalFormatOperation,
];
