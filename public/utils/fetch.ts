type RequestOptions = {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: object;
  credentials?: boolean;
};

type ServerError = {
  error: string;
  message: string;
};

export class ErrorWithDetails extends Error {
  response?: Response;
  errorDetails: ServerError;

  constructor(message: string) {
    super(message);
    this.name = 'ErrorWithDetails';
    this.errorDetails = {
      error: 'unknown',
      message: 'none'
    };
  }
}

const request = async ({
  url,
  method = 'GET',
  headers = { 'Content-Type': 'application/json' },
  body,
  credentials = false
}: RequestOptions): Promise<{ code: number; body: any }> => {
  const cred = credentials ? 'include' : 'omit';
  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
    credentials: cred
  });

  if (!response.ok) {
    let errorDetails: ServerError;
    try {
      errorDetails = await response.json();
    } catch {
      errorDetails = {
        error: 'Не удалось распарсить JSON ошибку с сервера',
        message: response.statusText
      };
    }

    const error = new ErrorWithDetails(`Ошибка модуля request: ${response.status}`);
    error.response = response;
    error.errorDetails = errorDetails;
    throw error;
  }

  const responseJSON = await response.json();
  return { code: response.status, body: responseJSON };
};

export default request;
