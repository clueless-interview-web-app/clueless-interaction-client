import { Event, Prisma } from "./generated/client/index.js";
export declare class CluelessInteractionTrackerClient {
    private prisma;
    constructor(dbUrl: string);
    addEvent(event: string, context: Record<string, any>): Promise<Event>;
    createContextIndex(field: string): Promise<void>;
    queryEvents(filters?: {
        event?: string | string[];
        context?: {
            contextField?: string;
            contextValue?: any;
            operation?: Prisma.JsonFilter;
        }[];
    }, options?: {
        order?: "asc" | "desc";
        limit?: number;
    }): Promise<Event[]>;
}
