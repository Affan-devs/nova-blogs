class ApiError extends Error {
  constructor(
    statusCode,
    message = 'Something went wrong 404',
    err = [],
    stack = ''
  ){
    super(message);
    this.err = err;
    this.data = null;
    this.message = message;
    this.statusCode = statusCode;
    this.succecs = false;
      if(stack){
        this.stack = stack
      }else{
        Error (this, this.constructor)
      }
  }
}
export default ApiError