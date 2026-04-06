import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  IDataObject,
} from "n8n-workflow";
import NodeFormData from "form-data";

const BASE_URL = "https://toolora.dev/api/agent";

export class Toolora implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Toolora",
    name: "toolora",
    icon: "file:toolora.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"] + " · " + $parameter["resource"]}}',
    description:
      "Extract text from PDFs, OCR images, generate QR codes, convert CSV/JSON, scrape URLs, and more — via the Toolora API. All processing is privacy-first.",
    defaults: { name: "Toolora" },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [{ name: "tooloraApi", required: true }],
    properties: [
      // ── Resource ─────────────────────────────────────────────────────────
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        options: [
          { name: "PDF", value: "pdf" },
          { name: "Image / OCR", value: "image" },
          { name: "Document", value: "document" },
          { name: "Web", value: "web" },
          { name: "Data", value: "data" },
          { name: "Utility", value: "utility" },
        ],
        default: "pdf",
      },

      // ── PDF operations ────────────────────────────────────────────────────
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: { show: { resource: ["pdf"] } },
        options: [
          {
            name: "Extract Text",
            value: "extractText",
            action: "Extract plain text from a PDF file",
            description: "Returns text content, page count, word count, and metadata",
          },
          {
            name: "Extract Structure",
            value: "extractStructure",
            action: "Extract structured sections from a PDF",
            description: "Returns sections with headings and content — useful for RAG pipelines",
          },
        ],
        default: "extractText",
      },

      // ── Image operations ──────────────────────────────────────────────────
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: { show: { resource: ["image"] } },
        options: [
          {
            name: "OCR — Extract Text",
            value: "ocr",
            action: "Extract text from an image using OCR",
            description: "Uses Tesseract OCR. Accepts PNG, JPEG, or WebP.",
          },
        ],
        default: "ocr",
      },

      // ── Document operations ───────────────────────────────────────────────
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: { show: { resource: ["document"] } },
        options: [
          {
            name: "Extract DOCX Text",
            value: "extractDocx",
            action: "Extract plain text from a Word DOCX file",
          },
          {
            name: "Excel to JSON",
            value: "excelToJson",
            action: "Parse an Excel file and return all sheets as JSON",
            description: "Accepts .xlsx, .xls, or .csv files",
          },
        ],
        default: "extractDocx",
      },

      // ── Web operations ────────────────────────────────────────────────────
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: { show: { resource: ["web"] } },
        options: [
          {
            name: "Read URL",
            value: "readUrl",
            action: "Fetch a URL and return clean readable text",
            description: "Uses Mozilla Readability. Returns title, byline, excerpt, and content.",
          },
          {
            name: "Scrape URL",
            value: "scrapeUrl",
            action: "Fetch a JavaScript-rendered page and extract its content",
            description: "Uses a headless browser. Returns text or markdown.",
          },
        ],
        default: "readUrl",
      },

      // ── Data operations ───────────────────────────────────────────────────
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: { show: { resource: ["data"] } },
        options: [
          {
            name: "CSV to JSON",
            value: "csvToJson",
            action: "Convert a CSV string to a JSON array of objects",
          },
          {
            name: "JSON to CSV",
            value: "jsonToCsv",
            action: "Convert a JSON array to a CSV string",
          },
        ],
        default: "csvToJson",
      },

      // ── Utility operations ────────────────────────────────────────────────
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: { show: { resource: ["utility"] } },
        options: [
          {
            name: "Generate QR Code",
            value: "qrCode",
            action: "Generate a QR code PNG from any text or URL",
            description: "Returns a base64-encoded PNG",
          },
        ],
        default: "qrCode",
      },

      // ── Shared: binary field for file uploads ─────────────────────────────
      {
        displayName: "Input Binary Field",
        name: "binaryPropertyName",
        type: "string",
        default: "data",
        required: true,
        displayOptions: {
          show: {
            resource: ["pdf", "image", "document"],
          },
        },
        description:
          "Name of the binary property that contains the file to process",
      },

      // ── Web: URL ──────────────────────────────────────────────────────────
      {
        displayName: "URL",
        name: "url",
        type: "string",
        default: "",
        required: true,
        displayOptions: { show: { resource: ["web"] } },
        description: "The URL to fetch or scrape",
        placeholder: "https://example.com/article",
      },
      {
        displayName: "Return Format",
        name: "scrapeFormat",
        type: "options",
        default: "markdown",
        displayOptions: { show: { resource: ["web"], operation: ["scrapeUrl"] } },
        options: [
          { name: "Markdown", value: "markdown" },
          { name: "Plain Text", value: "text" },
          { name: "HTML", value: "html" },
        ],
      },

      // ── Data: CSV input ───────────────────────────────────────────────────
      {
        displayName: "CSV",
        name: "csv",
        type: "string",
        typeOptions: { rows: 5 },
        default: "",
        required: true,
        displayOptions: { show: { resource: ["data"], operation: ["csvToJson"] } },
        description: "The CSV string to convert",
      },
      {
        displayName: "Has Header Row",
        name: "hasHeader",
        type: "boolean",
        default: true,
        displayOptions: { show: { resource: ["data"], operation: ["csvToJson"] } },
      },

      // ── Data: JSON input ──────────────────────────────────────────────────
      {
        displayName: "JSON Array",
        name: "jsonData",
        type: "json",
        default: "[]",
        required: true,
        displayOptions: { show: { resource: ["data"], operation: ["jsonToCsv"] } },
        description: "A JSON array of objects to convert to CSV",
      },

      // ── Utility: QR code ──────────────────────────────────────────────────
      {
        displayName: "Text or URL",
        name: "qrText",
        type: "string",
        default: "",
        required: true,
        displayOptions: { show: { resource: ["utility"], operation: ["qrCode"] } },
        description: "The text or URL to encode in the QR code",
        placeholder: "https://toolora.dev",
      },
      {
        displayName: "Size (px)",
        name: "qrSize",
        type: "number",
        default: 300,
        displayOptions: { show: { resource: ["utility"], operation: ["qrCode"] } },
        description: "Width and height of the QR code in pixels (100–1000)",
      },
      {
        displayName: "Error Correction Level",
        name: "qrErrorLevel",
        type: "options",
        default: "M",
        displayOptions: { show: { resource: ["utility"], operation: ["qrCode"] } },
        options: [
          { name: "Low (7%)", value: "L" },
          { name: "Medium (15%)", value: "M" },
          { name: "Quartile (25%)", value: "Q" },
          { name: "High (30%)", value: "H" },
        ],
      },

      // ── Output binary field for QR ────────────────────────────────────────
      {
        displayName: "Output Binary Field",
        name: "outputBinaryPropertyName",
        type: "string",
        default: "data",
        displayOptions: { show: { resource: ["utility"], operation: ["qrCode"] } },
        description: "Name of the binary property to write the QR code PNG to",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials("tooloraApi");
    const apiKey = credentials.apiKey as string;

    const authHeader = { Authorization: `Bearer ${apiKey}` };

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter("resource", i) as string;
      const operation = this.getNodeParameter("operation", i) as string;

      try {
        let responseData: IDataObject = {};

        // ── PDF ─────────────────────────────────────────────────────────────
        if (resource === "pdf") {
          const binaryProp = this.getNodeParameter("binaryPropertyName", i) as string;
          const binaryData = this.helpers.assertBinaryData(i, binaryProp);
          const buffer = await this.helpers.getBinaryDataBuffer(i, binaryProp);
          const endpoint = operation === "extractText" ? "/pdf/text" : "/pdf/extract";

          const formData = new NodeFormData();
          formData.append("file", buffer, {
            filename: binaryData.fileName ?? "document.pdf",
            contentType: binaryData.mimeType ?? "application/pdf",
          });

          responseData = await this.helpers.httpRequest({
            method: "POST",
            url: `${BASE_URL}${endpoint}`,
            headers: { ...authHeader, ...formData.getHeaders() },
            body: formData,
          }) as IDataObject;
        }

        // ── Image / OCR ──────────────────────────────────────────────────────
        else if (resource === "image" && operation === "ocr") {
          const binaryProp = this.getNodeParameter("binaryPropertyName", i) as string;
          const binaryData = this.helpers.assertBinaryData(i, binaryProp);
          const buffer = await this.helpers.getBinaryDataBuffer(i, binaryProp);

          const formData = new NodeFormData();
          formData.append("file", buffer, {
            filename: binaryData.fileName ?? "image.png",
            contentType: binaryData.mimeType ?? "image/png",
          });

          responseData = await this.helpers.httpRequest({
            method: "POST",
            url: `${BASE_URL}/ocr`,
            headers: { ...authHeader, ...formData.getHeaders() },
            body: formData,
          }) as IDataObject;
        }

        // ── Document ─────────────────────────────────────────────────────────
        else if (resource === "document") {
          const binaryProp = this.getNodeParameter("binaryPropertyName", i) as string;
          const binaryData = this.helpers.assertBinaryData(i, binaryProp);
          const buffer = await this.helpers.getBinaryDataBuffer(i, binaryProp);
          const endpoint = operation === "extractDocx" ? "/docx/text" : "/excel/to-json";
          const defaultMime =
            operation === "extractDocx"
              ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

          const formData = new NodeFormData();
          formData.append("file", buffer, {
            filename: binaryData.fileName ?? "document",
            contentType: binaryData.mimeType ?? defaultMime,
          });

          responseData = await this.helpers.httpRequest({
            method: "POST",
            url: `${BASE_URL}${endpoint}`,
            headers: { ...authHeader, ...formData.getHeaders() },
            body: formData,
          }) as IDataObject;
        }

        // ── Web ──────────────────────────────────────────────────────────────
        else if (resource === "web") {
          const url = this.getNodeParameter("url", i) as string;
          if (operation === "readUrl") {
            responseData = await this.helpers.httpRequest({
              method: "POST",
              url: `${BASE_URL}/url/read`,
              headers: { ...authHeader, "Content-Type": "application/json" },
              body: JSON.stringify({ url }),
            }) as IDataObject;
          } else {
            const format = this.getNodeParameter("scrapeFormat", i) as string;
            responseData = await this.helpers.httpRequest({
              method: "POST",
              url: `${BASE_URL}/url/scrape`,
              headers: { ...authHeader, "Content-Type": "application/json" },
              body: JSON.stringify({ url, format }),
            }) as IDataObject;
          }
        }

        // ── Data ─────────────────────────────────────────────────────────────
        else if (resource === "data") {
          if (operation === "csvToJson") {
            const csv = this.getNodeParameter("csv", i) as string;
            const hasHeader = this.getNodeParameter("hasHeader", i) as boolean;
            responseData = await this.helpers.httpRequest({
              method: "POST",
              url: `${BASE_URL}/csv/to-json`,
              headers: { ...authHeader, "Content-Type": "application/json" },
              body: JSON.stringify({ csv, hasHeader }),
            }) as IDataObject;
          } else {
            const jsonData = this.getNodeParameter("jsonData", i) as IDataObject[];
            responseData = await this.helpers.httpRequest({
              method: "POST",
              url: `${BASE_URL}/json/to-csv`,
              headers: { ...authHeader, "Content-Type": "application/json" },
              body: JSON.stringify({ data: jsonData }),
            }) as IDataObject;
          }
        }

        // ── Utility: QR Code ─────────────────────────────────────────────────
        else if (resource === "utility" && operation === "qrCode") {
          const text = this.getNodeParameter("qrText", i) as string;
          const size = this.getNodeParameter("qrSize", i) as number;
          const errorLevel = this.getNodeParameter("qrErrorLevel", i) as string;
          const outputProp = this.getNodeParameter("outputBinaryPropertyName", i) as string;

          const qrResponse = await this.helpers.httpRequest({
            method: "POST",
            url: `${BASE_URL}/qr`,
            headers: { ...authHeader, "Content-Type": "application/json" },
            body: JSON.stringify({ text, size, errorCorrectionLevel: errorLevel }),
          }) as IDataObject;

          const base64 = qrResponse.qr as string;
          const binaryData = await this.helpers.prepareBinaryData(
            Buffer.from(base64, "base64"),
            "qr-code.png",
            "image/png",
          );

          returnData.push({
            json: { text, size, errorCorrectionLevel: errorLevel },
            binary: { [outputProp]: binaryData },
            pairedItem: { item: i },
          });
          continue;
        }

        returnData.push({
          json: responseData,
          pairedItem: { item: i },
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: { item: i },
          });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
      }
    }

    return [returnData];
  }
}
