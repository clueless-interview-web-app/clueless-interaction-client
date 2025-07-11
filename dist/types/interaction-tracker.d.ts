import { Event, Prisma } from "./generated/client/index.js";
export declare class CluelessInteractionTrackerClient {
    private prisma;
    constructor(dbUrl: string);
    addEvent(event: string, context: Record<string, any>): Promise<Event>;
    createContextIndex(field: string): Promise<void>;
    queryEvents(filters?: EventQueryFilters, options?: EventQueryOptions): Promise<Event[]>;
}
type EventQueryFilters = {
    event?: string | string[];
    to?: Date;
    from?: Date;
    context?: {
        contextField?: string;
        contextValue?: any;
        operation?: Prisma.JsonFilter;
    }[];
};
type EventQueryOptions = {
    order?: "asc" | "desc";
    limit?: number;
};
export {};
