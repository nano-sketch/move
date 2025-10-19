import { MongoClient } from "mongodb";
import { MONGODB_URI } from "$env/static/private";

if (!MONGODB_URI) throw new Error("MONGODB_URI is null");

export interface User {
    username: string;
    progress: number;
    completed: number[];
    createdAt?: Date;
}

const client = new MongoClient(MONGODB_URI);

export let promise: Promise<MongoClient> = client.connect();

export async function get_database(db: string = "data") {
    const client = await promise;
    return client.db(db);
}

export async function get_collection<T extends Document>(
    coll_name: string,
    db_name: string = "data",
) {
    const db = await get_database(db_name);
    return db.collection<T>(coll_name);
}

export async function get_user(username: string): Promise<User | null> {
    const users = await get_collection<User>("users");
    return await users.findOne({ username });
}
