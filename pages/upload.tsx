import React, { useState, useEffect } from "react";
import Uploady from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";

const UploadComponent = ({ uploadUrl }: { uploadUrl: string | null }) => (
  <Uploady destination={{ url: uploadUrl || "fallback_url" }}>
    <UploadButton />
  </Uploady>
);

const UploadPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = async (file: File) => {
    const response = await fetch('/api/presignedUrl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type
      })
    });

    const { uploadURL } = await response.json();
    setUploadUrl(uploadURL);
  };

  return (
    <div>
      <h1>Upload Test Page</h1>
      {isClient && <UploadComponent uploadUrl={uploadUrl} />}
    </div>
  );
}

export default UploadPage;
