import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { UserReducerInitialState } from '../../types/reducer-types';
import { User } from '../../types/types';


const initialState:UserReducerInitialState = {
    user:null,
    loading:false
};

export const userReducer = createSlice({
    name:"userReducer",
    initialState,
    reducers:{
        userExists: (state,action:PayloadAction<User>) => { // here it appears like we are mutating the state object but in backend it won't be mutated, a new object is created and updated with new state
            state.user = action.payload;
            state.loading = false;
        },
        userNotExists: (state) => {
            state.user = null;
            state.loading = false;
        }
    } 
})


export const {userExists,userNotExists} = userReducer.actions
