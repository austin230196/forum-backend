import {object, string, TypeOf} from "zod"


export const createReplySchema = object({
    body: object({
        topicId: string({
            required_error: 'TopicID is required'
        }),
        message: string({
            required_error: 'Message is required'
        }).min(10, 'Message must be greater than 10 characters')
    })
}) 


export const getReplySchema = object({
    params: object({
        id: string({
            required_error: 'Reply ID is required'
        })
    })
})


export const getAllTopicRepliesSchema = object({
    params: object({
        topicId: string({
            required_error: 'Topic ID is required'
        })
    })
})


export type GetAllTopicReplies = TypeOf<typeof getAllTopicRepliesSchema>;


export type GetReply = TypeOf<typeof getReplySchema>;


export type CreateReply = TypeOf<typeof createReplySchema>;