import type { UnisynthSerializer, ServerRequestEvent, StatusCodes } from './types';
import type { RequestEvent, RequestHandler } from '@khulnasoft.com/unisynth-city';
import { createRequestEvent, getRequestMode, type RequestEventInternal } from './request-event';
import { ErrorResponse, getErrorHtml, minimalHtmlResponse } from './error-handler';
import { AbortMessage, RedirectMessage } from './redirect-handler';
import type { LoadedRoute } from '../../runtime/src/types';
import { encoder } from './resolve-request-handlers';
import type { UnisynthManifest, ResolvedManifest } from '@khulnasoft.com/unisynth/optimizer';

export interface UnisynthCityRun<T> {
  response: Promise<T | null>;
  requestEv: RequestEvent;
  completion: Promise<unknown>;
}

let asyncStore: AsyncStore | undefined;
import('node:async_hooks')
  .then((module) => {
    const AsyncLocalStorage = module.AsyncLocalStorage;
    asyncStore = new AsyncLocalStorage<RequestEventInternal>();
    globalThis.qcAsyncRequestStore = asyncStore;
  })
  .catch((err) => {
    console.warn(
      'AsyncLocalStorage not available, continuing without it. This might impact concurrent server calls.',
      err
    );
  });

export function runUnisynthCity<T>(
  serverRequestEv: ServerRequestEvent<T>,
  loadedRoute: LoadedRoute | null,
  requestHandlers: RequestHandler<any>[],
  manifest: UnisynthManifest | ResolvedManifest | undefined,
  trailingSlash = true,
  basePathname = '/',
  unisynthSerializer: UnisynthSerializer
): UnisynthCityRun<T> {
  let resolve: (value: T) => void;
  const responsePromise = new Promise<T>((r) => (resolve = r));
  const requestEv = createRequestEvent(
    serverRequestEv,
    loadedRoute,
    requestHandlers,
    manifest,
    trailingSlash,
    basePathname,
    unisynthSerializer,
    resolve!
  );
  return {
    response: responsePromise,
    requestEv,
    completion: asyncStore
      ? asyncStore.run(requestEv, runNext, requestEv, resolve!)
      : runNext(requestEv, resolve!),
  };
}

async function runNext(requestEv: RequestEventInternal, resolve: (value: any) => void) {
  try {
    // Run all middlewares
    await requestEv.next();
  } catch (e) {
    if (e instanceof RedirectMessage) {
      const stream = requestEv.getWritableStream();
      await stream.close();
    } else if (e instanceof ErrorResponse) {
      console.error(e);
      if (!requestEv.headersSent) {
        const html = getErrorHtml(e.status, e);
        const status = e.status as StatusCodes;
        requestEv.html(status, html);
      }
    } else if (!(e instanceof AbortMessage)) {
      if (getRequestMode(requestEv) !== 'dev') {
        try {
          if (!requestEv.headersSent) {
            requestEv.headers.set('content-type', 'text/html; charset=utf-8');
            requestEv.cacheControl({ noCache: true });
            requestEv.status(500);
          }
          const stream = requestEv.getWritableStream();
          if (!stream.locked) {
            const writer = stream.getWriter();
            await writer.write(encoder.encode(minimalHtmlResponse(500, 'Internal Server Error')));
            await writer.close();
          }
        } catch {
          console.error('Unable to render error page');
        }
      }
      return e;
    }
  } finally {
    if (!requestEv.isDirty()) {
      resolve(null);
    }
  }
  return undefined;
}

/**
 * The pathname used to match in the route regex array. A pathname ending with /q-data.json should
 * be treated as a pathname without it.
 */
export function getRouteMatchPathname(pathname: string, trailingSlash: boolean | undefined) {
  if (pathname.endsWith(QDATA_JSON)) {
    const trimEnd = pathname.length - QDATA_JSON_LEN + (trailingSlash ? 1 : 0);
    pathname = pathname.slice(0, trimEnd);
    if (pathname === '') {
      pathname = '/';
    }
  }
  return pathname;
}

export const IsQData = '@isQData';
export const QDATA_JSON = '/q-data.json';
export const QDATA_JSON_LEN = QDATA_JSON.length;
