import { User } from "./types";

export type UserReducerInitialStateType = {
    user: User | null;
    loading: boolean;
}