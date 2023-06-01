const success=(message,data=null)=>{
    let response={
      "text":"success",
       "status_code":"1",
       message:message,

    }
    if(data!=null || data==[]){
      response["data"]=data;
    }
    return response;
}

const failed=(message)=>{
    let response={
      "text":"failed",
       "status_code":'0',
       message:message,
    }
    return response;

}


module.exports={success,failed}