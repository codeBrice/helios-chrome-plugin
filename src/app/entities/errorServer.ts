export class ErrorServer {

    constructor(error, errorDescription) {
        this.error = error;
        this.errorDescription = errorDescription;
    }

    error: number;
    errorDescription: string;
}