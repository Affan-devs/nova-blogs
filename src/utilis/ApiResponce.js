class ApiError extends Error {
    constructor(
        stausCode,
        message='Success',
        data,
    ){
        this.statusCode = stausCode;
        this.message = message;
        this.data = data
        this.success = statusCode < 400
    }
}