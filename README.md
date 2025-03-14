# Simple POST Proxy Worker

This worker acts as a simple proxy, forwarding POST requests to a specified target endpoint while handling CORS preflight requests. The target endpoint can be specified either in the request body as `endpoint` or via a custom header `X-Target-Endpoint`.

## Usage

1.  **Deployment:** Deploy this worker to your chosen serverless platform (e.g., Cloudflare Workers, AWS Lambda@Edge).
2.  **POST Requests:** Send POST requests to the worker's URL.
3.  **Target Endpoint:** Specify the target endpoint:
    * In the request body: `{ "endpoint": "https://target-api.com/path", ... }`
    * In the request headers: `X-Target-Endpoint: https://target-api.com/path`
4.  **Request Body:** The worker will forward the rest of the request body to the target endpoint.
5.  **CORS:** The worker handles CORS preflight requests and adds necessary CORS headers to the response.

## Example

**Request:**

```http
POST / HTTP/1.1
Host: [your-worker-url.com](https://www.google.com/search?q=your-worker-url.com)
Content-Type: application/json
X-Target-Endpoint: [https://api.example.com/data](https://api.example.com/data)

{
  "key": "value",
  "data": 123
}
```

**Response:**

The worker will forward the POST request to `https://api.example.com/data` and return the response from that endpoint, along with appropriate CORS headers.

## CORS Headers

The worker sets the following CORS headers:

* `Access-Control-Allow-Origin: *` (You can restrict this to specific origins)
* `Access-Control-Allow-Methods: POST, OPTIONS`
* `Access-Control-Allow-Headers: Content-Type, X-Target-Endpoint`
* `Access-Control-Max-Age: 86400`
