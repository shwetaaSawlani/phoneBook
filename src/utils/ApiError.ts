class ApiError extends Error{
    statusCode: number;
    data: null;
    success: false;
    errors: any[];
    constructor(
        statusCode:number, 
        message :string = "Something Went Wrong",
        error =[],
        stack=""
    
    ){
        super(message)
        this.statusCode=statusCode
        this.data = null                              
        this.message=message
        this.success= false
        this.errors= error
    
    if(stack){
        this.stack= stack
    } else{
        Error.captureStackTrace(this)
    }
}

}
export{ApiError}