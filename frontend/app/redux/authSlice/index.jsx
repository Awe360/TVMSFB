'use client'

import { createSlice } from "@reduxjs/toolkit";
const initialState={
    user:null,
    error:null,
    isLoading:false,
}

const authSlice =createSlice({
    name:'auth',
    initialState,
    reducers:{
        loginStart:(state)=>({...state,isLoading:true}),
        setUser:(state,action)=>({...state,user:action.payload}),
        loginSuccess:(state,action)=>({...state,isLoading:false,user:action.payload,error:null}),
        loginFailure:(state,action)=>({...state,isLoading:false,error:action.payload}),
        logout:(state)=>({...state,user:null,error:null,isLoading:false}),
        forgotPasswordStart:(state)=>({...state,error:null,isLoading:true}),
        forgotPasswordSuccess:(state,action)=>({...state,isLoading:false,error:null}),
        forgotPasswordFailure:(state,action)=>({...state,isLoading:false,error:action.payload}),
        resetPasswordStart:(state)=>({...state,error:null,isLoading:true}),
        resetPasswordSuccess:(state)=>({...state,isLoading:false,error:null}),
        resetPasswordFailure:(state,action)=>({...state, isLoading:false, error:action.payload}),

    }
    
})

export const {loginStart, 
    loginSuccess, 
    loginFailure,
    logout,
    forgotPasswordStart,
    forgotPasswordSuccess,
    setUser,
    forgotPasswordFailure,
    resetPasswordStart,
    resetPasswordFailure,
    resetPasswordSuccess} = authSlice.actions
export default authSlice.reducer;