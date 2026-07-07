import validate from "deep-email-validator"
export const varidate = (email)=>{
    return validate(email)
}