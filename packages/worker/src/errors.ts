// packages/worker/src/errors.ts

export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly details: any;

    constructor(statusCode: number, message: string, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export function handleError(error: any, corsHeaders: any): Response {
    if (error instanceof ApiError) {
        return new Response(JSON.stringify({
            error: error.message,
            details: error.details,
        }), {
            status: error.statusCode,
            headers: corsHeaders,
        });
    }

    console.error('Internal Server Error:', error);

    return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
    }), {
        status: 500,
        headers: corsHeaders,
    });
}
