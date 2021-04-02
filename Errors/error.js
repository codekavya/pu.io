export default function MyError(message){
    this.message = message;
}

MyError.prototype = new Error();

