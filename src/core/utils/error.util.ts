export interface AppError {
  message: string;
  code: string;
}

const HTTP_MESSAGES: Record<number, string> = {
  400: 'Los datos enviados no son válidos.',
  401: 'Sesión inválida. Por favor verifica tus credenciales.',
  403: 'No tienes permiso para realizar esta acción.',
  404: 'El recurso solicitado no existe.',
  409: 'Existe un conflicto con los datos, verifique e intente de nuevo',
  422: 'Los datos no cumplen con el formato requerido.',
  429: 'Demasiadas solicitudes. Espera un momento.',
  500: 'Error interno del servidor. Intenta más tarde.',
  502: 'El servidor no está disponible en este momento.',
  503: 'Servicio temporalmente no disponible.',
};

export function serializeError(error: unknown): AppError {
  // Axios error con respuesta del backend
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status && HTTP_MESSAGES[status]) {
      return { message: HTTP_MESSAGES[status], code: `HTTP_${status}` };
    }
    if (!error.response) {
      return { message: 'No se pudo conectar con el servidor.', code: 'NETWORK_ERROR' };
    }
  }

  // Error nativo de JS
  if (error instanceof Error) {
    // No exponemos el mensaje real — solo lo logueamos
    console.error('[AppError]', error.message);
    return { message: 'Ocurrió un error inesperado.', code: 'UNKNOWN' };
  }

  return { message: 'Ocurrió un error inesperado.', code: 'UNKNOWN' };
}

// Type guard para errores Axios sin importar axios aquí
function isAxiosError(error: unknown): error is {
  response?: { status: number; data?: unknown };
  message: string;
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  );
}
