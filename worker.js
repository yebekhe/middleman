addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Handle CORS preflight (OPTIONS) requests
  if (request.method === 'OPTIONS') {
    return handleOptions(request)
  }

  // Only allow POST requests for the main functionality
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders()
    })
  }

  try {
    // Get the request body
    const requestBody = await request.json()
    
    // Get the target endpoint from either the request body or headers
    const targetEndpoint = requestBody.endpoint || request.headers.get('X-Target-Endpoint')
    
    if (!targetEndpoint) {
      return new Response('Target endpoint not specified', { 
        status: 400,
        headers: corsHeaders()
      })
    }

    // Remove the endpoint property from the body if it exists
    if (requestBody.endpoint) {
      delete requestBody.endpoint
    }

    // Forward the request to the target endpoint
    const response = await fetch(targetEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    // Convert response to include CORS headers
    const newHeaders = new Headers(response.headers)
    Object.entries(corsHeaders()).forEach(([key, value]) => {
      newHeaders.set(key, value)
    })

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    })

  } catch (error) {
    return new Response(`Error: ${error.message}`, { 
      status: 500,
      headers: corsHeaders()
    })
  }
}

// CORS headers function
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',  // You can restrict this to specific origins
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Target-Endpoint',
    'Access-Control-Max-Age': '86400'    // Cache preflight for 24 hours
  }
}

// Handle OPTIONS requests for CORS preflight
function handleOptions(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  })
}
