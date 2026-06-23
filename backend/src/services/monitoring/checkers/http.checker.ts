import type { Target } from "../../../types";
import { HTTP_TIMEOUT_MS } from "../../../config/constants";

function getHttpErrorDetails(err: any): { reason: string; details: string } {
  const msg = String(err?.message || err || "").toLowerCase();
  const cause = String(err?.cause?.message || err?.cause?.code || err?.code || "").toLowerCase();

  if (err?.name === "AbortError" || msg.includes("timeout") || msg.includes("aborted")) {
    return {
      reason: "Request Timeout",
      details: "The request timed out before receiving a response from the server.",
    };
  }
  if (msg.includes("refused") || cause.includes("econnrefused") || msg.includes("econnrefused")) {
    return {
      reason: "Connection Refused",
      details: "The host refused the connection on the specified port. Verify that the service is running and listening.",
    };
  }
  if (msg.includes("dns") || cause.includes("enotfound") || msg.includes("enotfound") || msg.includes("fetch failed")) {
    return {
      reason: "DNS Lookup Failed",
      details: "The domain name could not be resolved to an IP address. Check the host spelling or DNS settings.",
    };
  }
  return {
    reason: "Network Error",
    details: `An unexpected network error occurred: ${err?.message || "Unknown error"}`,
  };
}

function getHttpStatusError(status: number): { reason: string; details: string } {
  switch (status) {
    case 500:
      return {
        reason: "Internal Server Error. 500",
        details: "The server encountered an internal error or misconfiguration and was unable to complete your request.",
      };
    case 502:
      return {
        reason: "Bad Gateway. 502",
        details: "The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.",
      };
    case 503:
      return {
        reason: "Service Unavailable. 503",
        details: "The server is temporarily unable to service your request due to maintenance downtime or capacity problems.",
      };
    case 504:
      return {
        reason: "Gateway Timeout. 504",
        details: "The gateway did not receive a timely response from the upstream server.",
      };
    default:
      return {
        reason: `HTTP Error. ${status}`,
        details: `The server returned an error status code: ${status}.`,
      };
  }
}

export async function checkHTTP(
  target: Target,
): Promise<{ status: "UP" | "DOWN"; latency: number; errorReason?: string; errorDetails?: string }> {
  const host: string = target.host;
  const scheme = target.protocol === "HTTPS" ? "https" : "http";

  let url: string;
  if (host.startsWith("http://") || host.startsWith("https://")) {
    url = host;
  } else {
    const port = target.port ? `:${target.port}` : "";
    url = `${scheme}://${host}${port}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);

  const start = performance.now();
  try {
    let res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });

    if (res.status === 405) {
      res = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        redirect: "follow",
      });
    }

    const latency = Math.round(performance.now() - start);
    const isServerError = res.status >= 500;
    
    if (isServerError) {
      const errInfo = getHttpStatusError(res.status);
      return { status: "DOWN", latency, errorReason: errInfo.reason, errorDetails: errInfo.details };
    }
    
    return { status: "UP", latency };
  } catch (err: any) {
    const latency = Math.round(performance.now() - start);
    const errInfo = getHttpErrorDetails(err);
    return { status: "DOWN", latency, errorReason: errInfo.reason, errorDetails: errInfo.details };
  } finally {
    clearTimeout(timer);
  }
}
