import { compare, hash } from "bcrypt";

export const encrypt = async (password) =>{
    const passwordHash = await hash(password, 10)
    return passwordHash
}

export const verified = async (password, hash) =>{
    return await compare(password, hash)
}