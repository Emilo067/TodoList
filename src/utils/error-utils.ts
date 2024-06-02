import { Dispatch } from 'redux'
import {setAppErrorAC, SetAppErrorType, setAppStatusAC, SetAppStatusType} from "../App/app-reducer";
import { ResponseType } from '../api/todolist-api'

type ErrorUtilsDispatchType = Dispatch<SetAppErrorType | SetAppStatusType>

// generic function
export const handleServerAppError = <T,>(
    data: ResponseType<T>,
    dispatch: ErrorUtilsDispatchType
) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (
    error: { message: string },
    dispatch: ErrorUtilsDispatchType
) => {
    dispatch(setAppErrorAC(error.message))
    dispatch(setAppStatusAC('failed'))
}