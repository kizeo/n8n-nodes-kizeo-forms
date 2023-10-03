#!/usr/bin/env sh

set -e

cd /workspaces/n8n-nodes-kizeo-forms
npm link

mkdir -p ~/.n8n/nodes
cd ~/.n8n/nodes
npm link n8n-nodes-kizeo-forms
