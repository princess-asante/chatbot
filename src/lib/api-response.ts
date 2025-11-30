export function successResponse<T>(data: T, status = 200) {
  return new Response(JSON.stringify(data), { status });
}

export function errorResponse(error: string, status = 500) {
  return new Response(JSON.stringify({ error }), { status });
}

export function notFoundResponse(message = 'Not found') {
  return errorResponse(message, 404);
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return errorResponse(message, 401);
}