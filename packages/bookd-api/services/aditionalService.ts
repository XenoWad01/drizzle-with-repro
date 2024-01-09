import { inArray } from "drizzle-orm";

import { aditionalService, aditionalServiceID } from "../db/schema/aditional-service";
import { TRPCError } from "@trpc/server";
import { bookingID } from "../db/schema/booking";
import { aditionalServiceInstance } from "../db/schema/aditional-service-instance";
import { taskInstance } from "../db/schema/task-instance";
import { db } from "../db/drizzle";

export const createAditionalServiceInstancesFromAditionalServiceIds = async (bookingId: bookingID, aditionalSvIds: aditionalServiceID[]) => {

    const foundAditionalServices = await db.query.aditionalService.findMany({
        where: inArray(aditionalService.id, aditionalSvIds),
        with: {
            tasks: true
        }
    })
  
    if(foundAditionalServices.length !== aditionalSvIds.length) {
        throw new TRPCError({
            message: 'Please provide valid aditional service ids or none at all.',
            code: 'BAD_REQUEST'
        })
    }

    foundAditionalServices.forEach(async aditionalService => {


        const [createdAditionalServiceInstance] = await db.insert(aditionalServiceInstance).values({
            name: aditionalService.name,
            price: aditionalService.price,
            bookingId: bookingId
        }).returning({ id: aditionalServiceInstance.id })

        aditionalService.tasks.forEach(async task => {
            await db.insert(taskInstance).values({
                name: task.name,
                isExternal: task.isExternal,
                aditionalServiceInstanceId: createdAditionalServiceInstance.id
            })
        })
  
    })

}