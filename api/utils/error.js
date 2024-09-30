

//when we have custom error i.e. error creation
export const errorhandler=(statusCode,message)=>{
    // new Error () is javascript error handler
    const err=new Error()
    err.statusCode=statusCode;
    err.message=message;
    return err;
}