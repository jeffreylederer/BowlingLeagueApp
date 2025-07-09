import { z } from 'zod';


export const UpdateFormDataSchema = z.object({
    id: z.coerce.number(),
    team1Score: z.coerce.number().min(0, "Team 1's score must be not negative"),
    team2Score: z.coerce.number().min(0, "Team 2's score must be not negative"),
    forfeit: z.coerce.number(),

});

export type UpdateFormData = z.infer<typeof UpdateFormDataSchema>;






    