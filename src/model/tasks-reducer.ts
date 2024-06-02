import {TasksStateType} from "../App/App";
import {
    AddTodolistActionType,
    changeTodolistEntityStatusAC,
    ChangeTodolistEntityStatusActionType,
    ClearData,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModel} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {setAppStatusAC} from "../App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";


const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case "REMOVE-TASK": {
            return {
                ...state,
                [action.payload.todoId]: state[action.payload.todoId].filter(t => t.id !== action.payload.taskId)
            }
        }
        case "ADD-TASK": {
            return {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]
            }
        }
        case "UPDATE-TASK": {
            return {
                ...state,
                [action.payload.todoId]: state[action.payload.todoId].map(t => t.id === action.payload.taskId ? {...t, ...action.payload.model} : t)
            }
        }

        case "CHANGE-TASK-TITLE": {
            return {
                ...state,
                [action.payload.todoId]: state[action.payload.todoId].map(t => t.id === action.payload.taskId ? {
                    ...t,
                    title: action.payload.title
                } : t)
            }
        }
        case "ADD-TODOLIST": {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case "REMOVE-TODOLIST": {
            const copyState = {...state}
            delete copyState[action.payload.id]
            return copyState
        }
        case "SET-TASKS": {
            return {...state, [action.payload.todolistId]: action.payload.tasks}
        }
        case "CLEAR-DATA": {
            return {}
        }
        default: {
            return state
        }
    }
}

export const removeTaskAC = (todoId: string, taskId: string,) => ({
    type: "REMOVE-TASK",
    payload: {taskId, todoId}
}) as const
export const addTaskAC = (task: TaskType) => ({type: "ADD-TASK", payload: {task}}) as const
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({
    type: "SET-TASKS",
    payload: {todolistId, tasks}
}) as const
export const updateTaskAC = (todoId: string, taskId: string, model: UpdateTaskDomainType) => ({
    type: "UPDATE-TASK",
    payload: {todoId, taskId, model}
}) as const
export const changeTaskTitleAC = (todoId: string, taskId: string, title: string) => ({
    type: "CHANGE-TASK-TITLE",
    payload: {todoId, taskId, title}
}) as const

export const fetchTasksThunk = (todolistId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await todolistAPI.getTasks(todolistId)
        dispatch(setTasksAC(todolistId, res.data.items))
        dispatch(setAppStatusAC('succeeded'))
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

export const removeTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    try {
        const res = await todolistAPI.deleteTask(todolistId, taskId)
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC(todolistId, taskId))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'))
        } else {
            //@ts-ignore
            handleServerAppError(res, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

export const createTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await todolistAPI.createTask(todolistId, title)
        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            dispatch(addTaskAC(task))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

export type UpdateTaskDomainType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
    completed?: boolean
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateTaskDomainType) => async (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const tasks = getState().tasks
    const task = tasks[todolistId].find(t => t.id === taskId)
    dispatch(setAppStatusAC('loading'))
    if (task) {
        const model: UpdateTaskModel = {
            title: task.title,
            deadline: task.deadline,
            priority: task.priority,
            description: task.description,
            startDate: task.startDate,
            status: task.status,
            completed: task.completed,
            ...domainModel,
        }

        try {
            const res = await todolistAPI.updateTask(todolistId, taskId, model)
            if (res.data.resultCode === 0) {
                dispatch(updateTaskAC(todolistId, taskId, model))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
        }
    }
}


type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
export type SetTasksActionType = ReturnType<typeof setTasksAC>

type ActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | UpdateTaskActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType
    | ChangeTodolistEntityStatusActionType
    | ClearData