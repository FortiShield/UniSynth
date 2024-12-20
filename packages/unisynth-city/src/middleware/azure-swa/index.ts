import type { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { setServerPlatform } from '@khulnasoft.com/unisynth/server';
import { requestHandler } from '@khulnasoft.com/unisynth-city/middleware/request-handler';
import type {
  ServerRenderOptions,
  ServerRequestEvent,
} from '@khulnasoft.com/unisynth-city/middleware/request-handler';
import { getNotFound } from '@unisynth-city-not-found-paths';
import { _deserializeData, _serializeData, _verifySerializable } from '@khulnasoft.com/unisynth';
import { parseString } from 'set-cookie-parser';
import { isStaticPath } from '@unisynth-city-static-paths';

// @khulnasoft.com/unisynth-city/middleware/azure-swa

interface AzureResponse {
  status: number;
  headers: { [key: string]: any };
  body?: string | Uint8Array;
  cookies?: AzureCookie[];
}

interface AzureCookie {
  /** Cookie name */
  name: string;
  /** Cookie value */
  value: string;
  /** Specifies allowed hosts to receive the cookie */
  domain?: string;
  /** Specifies URL path that must exist in the requested URL */
  path?: string;
  /**
   * NOTE: It is generally recommended that you use maxAge over expires. Sets the cookie to expire
   * at a specific date instead of when the client closes. This can be a Javascript Date or Unix
   * time in milliseconds.
   */
  expires?: Date | number;
  /** Sets the cookie to only be sent with an encrypted request */
  secure?: boolean;
  /** Sets the cookie to be inaccessible to JavaScript's Document.cookie API */
  httpOnly?: boolean;
  /** Can restrict the cookie to not be sent with cross-site requests */
  sameSite?: string | undefined;
  /**
   * Number of seconds until the cookie expires. A zero or negative number will expire the cookie
   * immediately.
   */
  maxAge?: number;
}

/** @public */
export function createUnisynthCity(opts: UnisynthCityAzureOptions): AzureFunction {
  const unisynthSerializer = {
    _deserializeData,
    _serializeData,
    _verifySerializable,
  };
  if (opts.manifest) {
    setServerPlatform(opts.manifest);
  }
  async function onAzureSwaRequest(context: Context, req: HttpRequest): Promise<AzureResponse> {
    try {
      const url = new URL(req.headers['x-ms-original-url']!);
      const options: RequestInit = {
        method: req.method || 'GET',
        headers: req.headers,
        body: req.bufferBody || req.rawBody || req.body,
      };

      const serverRequestEv: ServerRequestEvent<AzureResponse> = {
        mode: 'server',
        locale: undefined,
        url,
        platform: context,
        env: {
          get(key) {
            return process.env[key];
          },
        },
        request: new Request(url, options),
        getWritableStream: (status, headers, cookies, resolve) => {
          const response: AzureResponse = {
            status,
            body: new Uint8Array(),
            headers: {},
            cookies: cookies.headers().map((header) => parseString(header)),
          };
          headers.forEach((value, key) => (response.headers[key] = value));
          return new WritableStream({
            write(chunk: Uint8Array) {
              if (response.body instanceof Uint8Array) {
                const newBuffer = new Uint8Array(response.body.length + chunk.length);
                newBuffer.set(response.body);
                newBuffer.set(chunk, response.body.length);
                response.body = newBuffer;
              }
            },
            close() {
              resolve(response);
            },
          });
        },

        getClientConn: () => {
          return {
            ip: req.headers['x-forwarded-client-Ip'],
            country: undefined,
          };
        },
      };

      // send request to unisynth city request handler
      const handledResponse = await requestHandler(serverRequestEv, opts, unisynthSerializer);
      if (handledResponse) {
        handledResponse.completion.then((err) => {
          if (err) {
            console.error(err);
          }
        });
        const response = await handledResponse.response;
        if (response) {
          return response;
        }
      }

      // unisynth city did not have a route for this request
      // response with 404 for this pathname

      // In the development server, we replace the getNotFound function
      // For static paths, we assign a static "Not Found" message.
      // This ensures consistency between development and production environments for specific URLs.
      const notFoundHtml = isStaticPath(req.method || 'GET', url)
        ? 'Not Found'
        : getNotFound(url.pathname);
      return {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Not-Found': url.pathname },
        body: notFoundHtml,
      };
    } catch (e: any) {
      console.error(e);
      return {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      };
    }
  }

  return onAzureSwaRequest;
}

/** @public */
export interface UnisynthCityAzureOptions extends ServerRenderOptions {}

/** @public */
export interface PlatformAzure extends Partial<Context> {}
