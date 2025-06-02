// Prepare upload parameters
const uploadParams = {
	Bucket: ipfsConfig.bucketName,
	Key: `${dayjs().valueOf()}`,
	Body: bufferFile,
	ContentType: "application/pdf",
};

// Create command for S3 upload
const command = new PutObjectCommand(uploadParams);
let cid = "";

// Add middleware to extract CID from response headers
command.middlewareStack.add(
	(next) => async (args) => {
		try {
			const response = await next(args);
			if (!response.response || typeof response.response !== 'object')
				return response;
			const apiResponse = response.response as {
				statusCode?: number;
				headers?: Record<string, string>
			};
			if (apiResponse.headers && "x-amz-meta-cid" in apiResponse.headers) {
				cid = apiResponse.headers["x-amz-meta-cid"];
			}
			return response;
		} catch (error) {
			logError('Middleware error:', error);
			throw error;
		}
	}, {
	step: "build",
	name: "addCidToOutput",
});

// Execute upload
await s3Client.send(command);