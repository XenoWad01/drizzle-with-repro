import { eq, or } from "drizzle-orm"
import { db } from "../db/drizzle"
import { status } from "../db/schema"


export const seedStatus = async () => {

    const foundStatuses = await db.query.status.findMany({
        where: or(
            eq(status.name, 'IN_PROGRESS'),
            eq(status.name, 'UPFRONT_PAYMENT_PENDING'),
            eq(status.name, 'CANCELED'),
            eq(status.name, 'AWAITING_START'),
            eq(status.name, 'CONCLUDED')
        )
    })
    if(foundStatuses.length !== 5) {
        await db.insert(status).values([
            {
                name: 'IN_PROGRESS',
                color: '#56a2e8'
            }, 
            {
                name: 'UPFRONT_PAYMENT_PENDING',
                color: '#e77131'
            },
            {
                name: 'CANCELED',
                color: '#ff8383'
            },
            {
                name: 'AWAITING_START',
                color: '#39964b'
            },
            {
                name: 'CONCLUDED',
                color: '#b594ff'
            }
        ])
    }

}