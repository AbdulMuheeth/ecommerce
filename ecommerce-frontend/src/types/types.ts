export interface User {
    _id:string,
    name:string,
    photo:string,
    email:string,
    role:string,
    gender:string,
    dob:string,
}

export interface Product{
    name:string,
    price:number,
    stock:number,
    category:string,
    photo:string,
    _id:string
}