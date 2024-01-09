import { seedStatus } from "./status"

export const seedAll = async () => {
    await Promise.all([
        seedStatus()
    ])  
}