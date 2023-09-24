# Learn-AI

Ariav Asulin & Cole Tahawi

AI-based Classroom Learning Platform.

Berkeley, CA, US

<br>
---

### About this repository 

This repository is a local web app used to test and develop for Learn-AI.

This is *not* our production code base; this is only for testing new features.

Code is based on [this project](https://github.com/mayooear/gpt4-pdf-chatbot-langchain)

<br>

### Local install instructions & DB setup
See instructions [here](https://github.com/mayooear/gpt4-pdf-chatbot-langchain)

<br>

### AWS deployment (S3, Lambda, EC2)

**S3:** Store each courses' documents

* Upload via presigned S3 document upload URL

**Lambda:** Run ingest script on file upload (push langchain/OpenAI embeddings to Pinecone vector store)

* Function uses package `learn-ai.zip` (learn-ai repo nested in a folder named `nodejs/`)
* Function fires on new object upload to S3 bucket: `./ingest/uploads/*`
* Compile typescript (uses `tsconfig.json`) into `./dist`, using command `tsc`. This should put JavaScript files in `./nodejs/dest/`
* Zip file should have packages installed in `lambda-ingest-package.json` with `npm install --production`
* Set Function Handler to: `nodejs.dest.scripts.lambda-ingest-data.handler`
* Input environment variables to Function:
	* `MAX_UPLOAD_SIZE` = 75 Mb = 78643200
	* `OPENAI_API_KEY`
	* `PINECONE_API_KEY`
	* `PINECONE_ENVIRONMENT`
	* `PINECONE_INDEX_NAME`
* Set Function security roles:
	* Select `AWSLambdaBasicExecutionRole`
	* Create & Select custom role with permissions: `s3:GetObject`, `s3:DeleteObject`

**EC2:** Host web-app and web-app API. (web-app API supports interface with MongoDB, chatbot, course document upload)

<br>

©2023 Ariav Asulin & Cole Tahawi.

