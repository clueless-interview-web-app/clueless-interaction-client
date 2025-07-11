import { Event, Prisma, PrismaClient } from "./generated/client/index.js";

export class CluelessInteractionTrackerClient {
  private prisma: PrismaClient;

  constructor(dbUrl: string) {
    this.prisma = new PrismaClient({
      datasources: {
        db: { url: dbUrl },
      },
    });
  }

  async addEvent(event: string, context: Record<string, any>): Promise<Event> {
    return this.prisma.event.create({
      data: {
        event,
        context,
      },
    });
  }

  async createContextIndex(field: string) {
    const indexName = `idx_event_context_${field}`;
    const sql = `CREATE INDEX IF NOT EXISTS ${indexName} ON "Event" ((context->>'${field}'));`;
    await this.prisma.$executeRawUnsafe(sql);
  }

  async queryEvents(
    filters: {
      event?: string | string[];
      context?: {
        contextField?: string;
        contextValue?: any;
        operation?: Prisma.JsonFilter;
      }[];
    } = {},
    options: { order?: "asc" | "desc"; limit?: number } = {}
  ): Promise<Event[]> {
    const where: Prisma.EventWhereInput = {};

    if (filters.event) {
      if (Array.isArray(filters.event)) {
        where.event = { in: filters.event };
      } else {
        where.event = filters.event;
      }
    }

    if (
      filters.context &&
      Array.isArray(filters.context) &&
      filters.context.length > 0
    ) {
      where.AND = filters.context.map((c) => ({
        context: {
          path: [c.contextField],
          ...(c.operation ? { ...c.operation } : { equals: c.contextValue }),
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
