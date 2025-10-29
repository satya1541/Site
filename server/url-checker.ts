import axios, { AxiosError } from 'axios';
import * as dns from 'dns';
import * as https from 'https';
import { promisify } from 'util';
import type { CheckOptions, CheckResult } from '@shared/schema';

const dnsLookup = promisify(dns.lookup);

export async function checkUrl(url: string, options: CheckOptions = {
  timeout: 5000,
  followRedirects: true,
  validateSSL: true,
  customHeaders: ''
}): Promise<CheckResult> {
  const startTime = Date.now();
  let dnsTime = 0;
  let tcpTime = 0;
  let tlsTime = 0;
  let ipAddress = 'Unknown';
  let statusCode = 0;
  let sslValid = false;
  let isReachable = false;
  let error: string | undefined;

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // DNS lookup
    const dnsStart = Date.now();
    try {
      const dnsResult = await dnsLookup(hostname);
      ipAddress = dnsResult.address;
      dnsTime = Date.now() - dnsStart;
    } catch (err) {
      dnsTime = Date.now() - dnsStart;
      throw new Error(`DNS lookup failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    // Parse custom headers
    let headers = {};
    if (options.customHeaders) {
      try {
        headers = JSON.parse(options.customHeaders);
      } catch {
        // Invalid JSON, ignore custom headers
      }
    }

    // HTTP request with timing
    const requestStart = Date.now();
    const response = await axios({
      url,
      method: 'GET',
      timeout: options.timeout,
      maxRedirects: options.followRedirects ? 5 : 0,
      validateStatus: () => true, // Accept any status code
      headers: {
        'User-Agent': 'SitePulse/1.0',
        ...headers
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: options.validateSSL
      })
    });

    const totalRequestTime = Date.now() - requestStart;
    tcpTime = totalRequestTime - dnsTime;
    
    // Check if HTTPS and extract TLS time
    if (urlObj.protocol === 'https:') {
      sslValid = options.validateSSL;
      tlsTime = Math.floor(tcpTime * 0.4); // Approximate TLS handshake time
      tcpTime = tcpTime - tlsTime;
    } else {
      sslValid = false;
    }

    statusCode = response.status;
    isReachable = statusCode >= 200 && statusCode < 600;

  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError;
      if (axiosError.code === 'ECONNABORTED') {
        error = 'Request timeout';
      } else if (axiosError.code === 'ENOTFOUND') {
        error = 'Host not found';
      } else if (axiosError.code === 'ECONNREFUSED') {
        error = 'Connection refused';
      } else if (axiosError.response) {
        statusCode = axiosError.response.status;
        isReachable = true; // Got a response, even if error
      } else {
        error = axiosError.message;
      }
    } else if (err instanceof Error) {
      error = err.message;
    } else {
      error = 'Unknown error occurred';
    }
  }

  const responseTime = Date.now() - startTime;

  return {
    url,
    isReachable,
    responseTime,
    ipAddress,
    statusCode,
    sslValid,
    dnsTime: dnsTime > 0 ? dnsTime : undefined,
    tcpTime: tcpTime > 0 ? tcpTime : undefined,
    tlsTime: tlsTime > 0 ? tlsTime : undefined,
    error
  };
}

export async function checkUrlsBatch(urls: string[], options: CheckOptions = {
  timeout: 5000,
  followRedirects: true,
  validateSSL: true,
  customHeaders: ''
}): Promise<CheckResult[]> {
  const promises = urls.map(url => checkUrl(url, options));
  return Promise.all(promises);
}
