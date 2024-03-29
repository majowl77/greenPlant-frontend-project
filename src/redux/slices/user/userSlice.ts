import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

import api from '../../../api'
import { requestHandler } from '../../../api/requestHandler'
import { RegisterSchema } from '../../../types/loginRegister/loginRegister'
import { DecodedUser, User, UserInfo, UsersinitialState } from '../../../types/users/usersType'
import { getDecodedTokenFromStorage } from '../../../utils/token'

const decodedUser = getDecodedTokenFromStorage()

const initialState: UsersinitialState = {
  users: [],
  isLogedIn: false,
  isLogedOut: false,
  error: null,
  isLoading: false,
  decodedUser,
  loggedUser: null,
  userRole: null,
  isEditForm: false,
  popUp: false,
  message: null
}

export const loginThunk = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // you can change the type User[] to be the shape of your response

      const res = await api.post('/api/auth/login', credentials)
      const token = res.data.token
      localStorage.setItem('token', token)
      api.defaults.headers['Authorization'] = `Bearer ${token}`
      const decodedUser = getDecodedTokenFromStorage()

      return { data: res.data, decodedUser }
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response?.data.msg)
    }
  }
)

export const registerThunk = createAsyncThunk(
  'user/register',
  async (userData: RegisterSchema, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/register', userData)
      return res.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.msg)
      }
    }
  }
)

export const updateSingleUserInfoThunk = createAsyncThunk(
  'users/getUserData',
  async (
    { userId, updatedData }: { userId: User['_id']; updatedData: UserInfo },
    { rejectWithValue }
  ) => {
    try {
      const user = await api.put(`/api/users/profile/${userId}`, updatedData)
      return user.data
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response?.data.msg)
    }
  }
)

export const getSingleUserThunk = createAsyncThunk(
  'users/getSingleUser',
  async (userId: User['_id'], { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/users/${userId}`)
      return res.data.user
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response?.data.msg)
    }
  }
)

// --- Handle user Info By the Admin ---
export const getUsersThunk = createAsyncThunk(
  'users/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/users/admin/getAllUsers')
      return res.data.users
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response?.data.msg)
    }
  }
)

export const deleteUsersThunk = createAsyncThunk(
  'users/delete',
  async (userId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/users/admin/deleteUser/${userId}`)
      return userId
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response?.data.msg)
    }
  }
)

export const grantRoleUserThunk = createAsyncThunk(
  'users/role',
  async ({ role, userId }: { role: string; userId: User['_id'] }, { rejectWithValue }) => {
    try {
      const user = await api.put('/api/users/admin/role', { role, userId })
      return user.data.user
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response?.data.msg)
    }
  }
)

// --- Forgot and rest password handling ---
export const forgotPasswordThunk = createAsyncThunk(
  'users/forgotPassword',
  async ({ email }: { email: User['email'] }, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/password/forgotPassword', { email })
      return res.data
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response?.data.msg)
    }
  }
)

export const resetPasswordThunk = createAsyncThunk(
  'users/resetPassword',
  async (
    {
      password,
      forgotPasswordCode
    }: {
      password: string
      forgotPasswordCode: string | undefined
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/api/password/resetPassword', {
        password,
        forgotPasswordCode
      })
      return res.data
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response?.data.msg)
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    getError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    isLogedOut: (state) => {
      state.isLogedOut = true
      state.isLogedIn = false
      state.decodedUser = null
      state.loggedUser = null
    },
    openEditProfileForm: (state) => {
      state.isEditForm = true
    },
    setPopUp: (state, action: PayloadAction<Boolean>) => {
      if (action.payload === true) {
        state.popUp = true
      } else if (action.payload === false) {
        state.popUp = false
      }
    },
    closeEditForm: (state) => {
      state.isEditForm = false
    },
    editUserInfo: (state, action: { payload: { userInfo: User } }) => {
      const { userInfo } = action.payload
      state.loggedUser = {
        ...state.loggedUser, // Keep the old user data
        ...userInfo // Update with the new user data
      }
    }
  },
  extraReducers: (builder) => {
    // ---Login handling---
    builder.addCase(loginThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(loginThunk.rejected, (state, action) => {
      const errorMsg = action.payload
      if (typeof errorMsg === 'string') {
        state.error = errorMsg
      } else {
        state.error = 'somthing went wrong :('
      }
      state.isLoading = false
      state.isLogedIn = false

      return state
    })
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loggedUser = action.payload?.data.user
      console.log('🚀 ~ file: userSlice.ts:124 ~ builder.addCase ~ action.payload:', action.payload)

      state.decodedUser = action.payload?.decodedUser
      state.isLogedIn = true
      state.isLoading = false
      return state
    })
    // ---Register handling---
    builder.addCase(registerThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(registerThunk.rejected, (state, action) => {
      const errorMsg = action.payload
      if (typeof errorMsg === 'string') {
        state.error = errorMsg
      } else {
        state.error = 'somthing went wrong :('
      }
      state.isLoading = false
      state.isLogedIn = false

      return state
    })
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.message = action.payload.msg
      state.isLoading = false
      return state
    })
    // --- Handling the retrieval of users information ---
    builder.addCase(getUsersThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getUsersThunk.rejected, (state, action) => {
      const errorMsg = action.payload
      if (typeof errorMsg === 'string') {
        state.error = errorMsg
      } else {
        state.error = 'somthing went wrong :('
      }
      state.isLoading = false
      return state
    })
    builder.addCase(getUsersThunk.fulfilled, (state, action) => {
      state.users = action.payload
      state.isLoading = false
    })
    // --- Handling the retrieval of single user information ---
    builder.addCase(getSingleUserThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getSingleUserThunk.rejected, (state, action) => {
      const errorMsg = action.payload
      if (typeof errorMsg === 'string') {
        state.error = errorMsg
      } else {
        state.error = 'somthing went wrong :('
      }
      state.isLoading = false
      return state
    })
    builder.addCase(getSingleUserThunk.fulfilled, (state, action) => {
      state.loggedUser = action.payload
      state.isLoading = false
    })
    // --- Granting user roles ---
    builder.addCase(grantRoleUserThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(grantRoleUserThunk.rejected, (state, action) => {
      const errorMsg = action.payload
      if (typeof errorMsg === 'string') {
        state.error = errorMsg
      } else {
        state.error = 'somthing went wrong :('
      }
      state.isLoading = false
      return state
    })
    builder.addCase(grantRoleUserThunk.fulfilled, (state, action) => {
      const userId = action.payload._id
      const updatedUsers = state.users.map((user) => {
        if (user._id === userId) {
          return action.payload
        }
        return user
      })
      state.users = updatedUsers
      state.isLoading = false
      return state
    })
    // --- handle deleting the user ---
    builder.addCase(deleteUsersThunk.fulfilled, (state, action) => {
      const userId = action.payload
      const updatedUsers = state.users.filter((user) => user._id !== userId)
      state.users = updatedUsers
      return state
    })
    // --- Update User Info
    builder.addCase(updateSingleUserInfoThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateSingleUserInfoThunk.rejected, (state, action) => {
      const errorMsg = action.payload
      if (typeof errorMsg === 'string') {
        state.error = errorMsg
      } else {
        state.error = 'somthing went wrong :('
      }
      state.isLoading = false
      return state
    })
    builder.addCase(updateSingleUserInfoThunk.fulfilled, (state, action) => {
      const userId = action.payload._id
      const updatedUsers = state.users.map((user) => {
        if (user._id === userId) {
          return action.payload
        }
        return user
      })
      state.users = updatedUsers
      state.loggedUser = action.payload.user
      state.isLoading = false
      return state
    })
    // --- handle forgot password for the user  ---
    builder.addCase(forgotPasswordThunk.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(forgotPasswordThunk.rejected, (state, action) => {
      const errorMsg = action.payload
      if (typeof errorMsg === 'string') {
        state.error = errorMsg
      } else {
        state.error = 'somthing went wrong :('
      }
      state.isLoading = false
      return state
    })
    builder.addCase(forgotPasswordThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.message = action.payload.msg

      return state
    })
    // --- handle reset password for the user  ---
    builder.addCase(resetPasswordThunk.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(resetPasswordThunk.rejected, (state, action) => {
      const errorMsg = action.payload
      if (typeof errorMsg === 'string') {
        state.error = errorMsg
      } else {
        state.error = 'somthing went wrong :('
      }
      state.isLoading = false
      return state
    })
    builder.addCase(resetPasswordThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.message = action.payload.msg

      return state
    })
  }
})

export default usersSlice.reducer
export const usersSliceActions = usersSlice.actions
