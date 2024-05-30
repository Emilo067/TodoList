import axios from 'axios'
import {TodolistType} from "../App/AppWithRedux";


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        "API-KEY": "845a7512-7ea3-4d78-b9e5-2066f67a35cc"
    }
})

export const todolistAPI = {
    getTodolist() {
        return instance.get<ResponseType<{
            item: TodolistType
        }>>('todo-lists')
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
    },
    updateTask(todolistId: string, taskId: string, title: string) {
        return instance.put<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks/${taskId}`, {title})
    },
    createTodolist(title: string) {
        return instance.post<ResponseType>(
            'todo-lists',
            {title}
        )
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    getTasks(todolistId: string) {
        return instance.get<ResponseTaskType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{item: TaskType}>>(
            `todo-lists/${todolistId}/tasks`,
            {title}
        )
    },
}

type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: FieldErrorType[]
    data: D
}

type FieldErrorType = {
    error: string
    field: string
}

type ResponseTaskType = {
    items: TaskType[]
    totalCount: number
    error: string
}

type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
