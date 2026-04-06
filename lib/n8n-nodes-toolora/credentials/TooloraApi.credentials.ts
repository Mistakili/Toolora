import { ICredentialType, INodeProperties } from "n8n-workflow";

export class TooloraApi implements ICredentialType {
  name = "tooloraApi";
  displayName = "Toolora API";
  documentationUrl = "https://toolora.dev/api-docs";
  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: { password: true },
      default: "",
      placeholder: "sk_toolora_...",
      description:
        "Your Toolora API key. Get one free at toolora.dev/api-keys",
    },
  ];
}
