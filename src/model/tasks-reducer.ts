import {v1} from "uuid"
import {TasksStateType} from "../App/App";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch(action.type) {
        case "REMOVE-TASK": {
            return {...state,
                    [action.payload.todoId]: state[action.payload.todoId].filter(t => t.id !== action.payload.taskId)
            }
        }
        case "ADD-TASK": {
            return {...state,
                    [action.payload.todoId]: [{id: v1(), title: action.payload.title, isDone: false}, ...state[action.payload.todoId]]
            }
        }
        case "CHANGE-TASK-STATUS": {
            return {...state,
                    [action.payload.todoId]: state[action.payload.todoId].map(t => t.id === action.payload.taskId ? {...t, isDone: action.payload.status} : t)
            }
        }
        case "CHANGE-TASK-TITLE": {
            return {...state,
                    [action.payload.todoId]: state[action.payload.todoId].map(t => t.id === action.payload.taskId ? {...t, title: action.payload.title} : t)
            }
        }
        case "ADD-TODOLIST": {
            return {...state,
                    [action.todolistId]: []
            }
        }
        case "REMOVE-TODOLIST": {
            const copyState = {...state}
            delete copyState[action.payload.id]
            return copyState
        }
        default: {
            return state
        }
    }
}

export const removeTaskAC = ( todoId: string, taskId: string,) => ({ type: "REMOVE-TASK", payload: {taskId, todoId}}) as const
export const addTaskAC = (todoId: string, title: string) => ({ type: "ADD-TASK", payload: {title, todoId}}) as const
export const changeTaskStatusAC = (todoId: string, taskId: string, status: boolean) => ({ type: "CHANGE-TASK-STATUS", payload: {todoId, taskId, status}}) as const
export const changeTaskTitleAC = (todoId: string, taskId: string, title: string) => ({ type: "CHANGE-TASK-TITLE", payload: {todoId, taskId, title}}) as const

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>

type ActionsType = RemoveTaskActionType | AddTaskActionType | ChangeTaskStatusActionType | ChangeTaskTitleActionType | AddTodolistActionType | RemoveTodolistActionType