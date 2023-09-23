import React, { useState, useEffect } from "react";
import Uploady from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";

const UploadComponent = () => (
    <Uploady destination={{ url: "https://my-server.com/upload" }}>
        <UploadButton />
    </Uploady>
);

const UploadPage = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Set isClient to true once the component has been mounted
        setIsClient(true);
    }, []);

    return (
        <div>
            <h1>Upload Test Page</h1>
            {isClient && <UploadComponent />}
        </div>
    );
}

export default UploadPage;
