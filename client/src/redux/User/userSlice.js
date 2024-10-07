import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser:null,
  error:null,
  loading:false
}


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      signInStart:(state)=>{
        state.loading=true;
        state.error=null;
      },
      signInSuccess:(state,action)=>{
        //action-information we wanna add like email and pasword , username
        state.currentUser=action.payload;
        state.loading=false;
        state.error=null;
      },
      signInFailure:(state,action)=>{
        state.loading=false;
        state.error=action.payload;
      },
      updateStart:(state)=>{
        state.loading=true;
        state.error=null;
      },
      updateSuccess:(state,action)=>{
        state.loading=false;
        state.error=null;
        state.currentUser=action.payload
      },
      updateFailure:(state,action)=>{
        state.loading=false;
        state.error=action.payload;
      },
      deleteUserStart:(state)=>{
        state.loading=true;
        state.error=null;
      },
      deleteUserSuccess:(state,action)=>{
        state.loading=false;
        state.error=null;
        state.currentUser=null;
      },
      deleteUserFailure:(state,action)=>{
        state.loading=false;
        state.error=action.payload;
      },
      signoutSuccess:(state)=>{
        state.loading=false;
        state.currentUser=null;
        state.error=null;
      }

    },
  })
  
  // Action creators are generated for each case reducer function
  export const { signInStart, signInSuccess, signInFailure ,updateStart,updateSuccess ,updateFailure,
    deleteUserStart,deleteUserSuccess,deleteUserFailure,signoutSuccess
  } = userSlice.actions
  
  export default userSlice.reducer