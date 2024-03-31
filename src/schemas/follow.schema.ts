import { TypeOf, object, string } from "zod";

export const followTopicSchema = object({
    body: object({
        userId: string({
            required_error: 'User ID is required'
        }),
        topicId: string({
            required_error: 'Topic ID is required'
        })
    })
})


export type FollowTopic = TypeOf<typeof followTopicSchema>;