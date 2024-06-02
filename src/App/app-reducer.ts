export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

export const appReducer = (
    state: InitialStateType = initialState,
    action: ActionsType
): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return { ...state, status: action.status }
        case 'APP/SET-ERROR':
            return { ...state, error: action.error }
        case 'APP/SET-IS-INITIALIZED': {
                return {...state, isInitialized: action.isInitialized}
        }
        default:
            return state
    }
}

type ActionsType = SetAppStatusType | SetAppErrorType | SetAppIsInitializedType


export type SetAppStatusType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>
export type SetAppIsInitializedType = ReturnType<typeof setAppIsInitializedAC>
export const setAppStatusAC = (status: RequestStatusType) => ({type:'APP/SET-STATUS', status}) as const
export const setAppErrorAC = (error: string | null) => ({type:'APP/SET-ERROR', error}) as const
export const setAppIsInitializedAC = (isInitialized: boolean) => ({type:'APP/SET-IS-INITIALIZED', isInitialized}) as const