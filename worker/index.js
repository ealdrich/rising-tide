// Cloudflare Worker: proxies AWS elevation tiles and adds CORS headers.
// Deploy steps:
//   1. Go to https://dash.cloudflare.com → Workers & Pages → Create Worker
//   2. Paste this script, click Deploy
//   3. Copy your worker URL (e.g. https://elevation-proxy.yourname.workers.dev)
//   4. Set that URL as WORKER_URL in ElevationOverlay.jsx

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const awsUrl = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium${url.pathname}`

    const response = await fetch(awsUrl)
    const newResponse = new Response(response.body, response)
    newResponse.headers.set('Access-Control-Allow-Origin', '*')
    return newResponse
  }
}
