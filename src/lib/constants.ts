export const API_ROUTES = {
  CHATS: '/api/chats',
  CHAT_BY_ID: (id: string) => `/api/chats/${id}`,
} as const;

export const DB_TABLES = {
  CHATS: 'chats',
  USERS: 'users',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;