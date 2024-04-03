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


export const socialLoginSchema = object({
    params: object({
        provider: string({
            required_error: "Provider is a required field"
        }).min(5, "Must be more than 4 in length")
    }),
})


export const loginCallbackSchema = object({
    params: object({
        provider: string({
            required_error: "Provider is a required field"
        }).min(5, "Must be more than 4 in length")
    }),
    body: object({
        code: string({
            required_error: "Code is required for authentication"
        })
    })
})


export const forgotPasswordSchema = object({
    body: object({
        email: string({
            required_error: "Email is required"
        })
    })
})



export const updatePasswordSchema = object({
    body: object({
        newPassword: string({
            required_error: 'New password is required'
        }),
        token: string({
            required_error: 'Token is required'
        })
    })
})




export type UpdatePassword =TypeOf<typeof updatePasswordSchema>;

export type ForgotPassword = TypeOf<typeof forgotPasswordSchema>;

export type LoginCallback = TypeOf<typeof loginCallbackSchema>;

export type SocialLogin = TypeOf<typeof socialLoginSchema>;

export type CreateUser = TypeOf<typeof createUserSchema>;

export type LoginUser = TypeOf<typeof loginUserSchema>;