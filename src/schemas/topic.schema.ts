import {string, object, TypeOf, enum as enum_} from "zod";


export const getTopicSchema = object({
    params: object({
        id: string({
            required_error: 'Topic ID is required'
        })
    })
})

export const getAllTopicsSchema = object({
    query: object({
        order: enum_(['latest', 'oldest']),
        category: enum_(["general", "news", "sports", "algorithms", "organization", "project"]).optional()
    })
})

export const createTopicSchema = object({
    body: object({
        message: string({
            required_error: 'Message is required'
        }).min(20, 'Message must be at most 20 characters'),
        category: string({
            required_error: 'Category is required'
        }),
        title: string({
            required_error: 'Title is required'
        }).min(5, 'Title must be at most 5 characters')
    })
})



export type CreateTopic = TypeOf<typeof createTopicSchema>;

export type GetAllTopics = TypeOf<typeof getAllTopicsSchema>;

export type GetTopic = TypeOf<typeof getTopicSchema>;