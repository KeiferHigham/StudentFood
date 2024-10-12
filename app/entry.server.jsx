import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";

// ABORT_DELAY for the streaming timeout
const ABORT_DELAY = 5_000;

// Custom error handling for server-side errors
export const handleError = (error, { request }) => {
  // Log detailed error information
  console.error("Error during SSR:", error);
  
  // Optionally, send errors to a third-party service like Sentry
  // Sentry.captureException(error);

  // Log request details for better understanding
  console.error("Request details:", request.url);
};

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
  loadContext
) {
  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
}

function handleBotRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error) {
          // Log initial shell rendering errors
          handleError(error, { request });
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          // Log errors during streaming after shell rendering
          if (shellRendered) {
            handleError(error, { request });
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error) {
          // Log initial shell rendering errors
          handleError(error, { request });
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          // Log errors during streaming after shell rendering
          if (shellRendered) {
            handleError(error, { request });
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
