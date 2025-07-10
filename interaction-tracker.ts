import { Event, Prisma, PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

export class CluelessInteractionTrackerClient {
  private prisma: PrismaClient;
  
  constructor(dbUrl: string) {
    process.env.DATABASE_URL = dbUrl;
    const prismaPath: string = "./prisma/schema.prisma";
    execSync(`npx prisma migrate deploy --schema=${prismaPath}`, {
      stdio: "ignore",
    });

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
    filters: { event?: string; contextField?: string; contextValue?: any } = {},
    options: { order?: "asc" | "desc"; limit?: number } = {}
  ): Promise<Event[]> {
    const where: Prisma.EventWhereInput = {};
    if (filters.event) {
      where.event = filters.event;
    }
    if (filters.contextField && filters.contextValue !== undefined) {
      where.context = {
        path: [filters.contextField],
        equals: filters.contextValue,
      };
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
