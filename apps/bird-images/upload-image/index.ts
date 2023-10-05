import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { v1 as uuidv1 } from 'uuid';
import 'dotenv/config';

const uploadFile: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('HTTP trigger function processed a request.');

  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  if (!accountName) throw Error('Azure Storage accountName not found');

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new DefaultAzureCredential()
  );

  const file = req.parseFormBody().get('image');

  if (!file) {
    context.res = {
      status: 400,
      body: 'No image file included in request',
    };
    return;
  }

  const filename = file.fileName;
  console.log(`Received file: ${filename}`);

  // Create a unique name for the blob
  const blobName = `${uuidv1()}-${filename}`;

  // Get a block blob client
  const containerClient = blobServiceClient.getContainerClient(
    `${process.env.AZURE_STORAGE_IMAGES_CONTAINER_NAME}`
  );
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Display blob name and url
  console.log(
    `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
  );

  // Upload data to the blob
  const data = Buffer.from(file.value);
  const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
  console.log(
    `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
  );

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: `Uploaded file: ${filename}`,
  };
};

export default uploadFile;
