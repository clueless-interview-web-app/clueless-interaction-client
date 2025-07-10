import { PrismaClient } from "./generated/client/index.js";
export class CluelessInteractionTrackerClient {
    constructor(dbUrl) {
        this.prisma = new PrismaClient({
            datasources: {
                db: { url: dbUrl },
            },
        });
    }
    async addEvent(event, context) {
        return this.prisma.event.create({
            data: {
                event,
                context,
            },
        });
    }
    async createContextIndex(field) {
        const indexName = `idx_event_context_${field}`;
        const sql = `CREATE INDEX IF NOT EXISTS ${indexName} ON "Event" ((context->>'${field}'));`;
        await this.prisma.$executeRawUnsafe(sql);
    }
    async queryEvents(filters = {}, options = {}) {
        const where = {};
        if (filters.event) {
            where.event = filters.event;
        }
        if (filters.context &&
            Array.isArray(filters.context) &&
            filters.context.length > 0) {
            where.AND = filters.context.map((c) => ({
                context: {
                    path: [c.contextField],
                    equals: c.contextValue,
                },
            }));
        }
        return this.prisma.event.findMany({
            where,
            orderBy: {
                timestamp: options.order || "desc",
            },
            take: options.limit,
        });
    }
}
