import {TypeOf, object, string} from "zod";


export const loginUserSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required'
        }).email(),
        password: string({
            required_error: 'Password is required'
        }).min(6, 'Password must be greater than 6 characters')
    })
})


export const createUserSchema = object({
    body: object({
        name: string({
            required_error: 'Name is required'
        }),
        email: string({
            required_error: 'Email is required'
        }).email(),
        password: string({
            required_error: 'Password is required'
        }).min(6, 'Password must be more than 6')
    })
})



export type CreateUser = TypeOf<typeof createUserSchema>;

export type LoginUser = TypeOf<typeof loginUserSchema>;