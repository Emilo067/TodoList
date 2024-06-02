import axios from 'axios'


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        "API-KEY": "845a7512-7ea3-4d78-b9e5-2066f67a35cc"
    }
})

export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists')
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
    },
    updateTask(todolistId: string, taskId: string, task: UpdateTaskModel) {
        return instance.put<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, task)
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
        return instance.delete<ResponseType<any>>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(
            `todo-lists/${todolistId}/tasks`,
            {title}
        )
    },
}

export const authAPI = {
    login(params: LoginParamsType) {
        return instance.post<ResponseType<{userId: number}>>('auth/login', params)
    },
    me() {
        return instance.get<ResponseType<{id: number, email: string, login: string}>>('auth/me')
    },
    logout() {
        return instance.delete<ResponseType>('auth/login')
    },
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: boolean
}


export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: FieldErrorType[]
    data: D
}

type FieldErrorType = {
    error: string
    field: string
}

export type TaskType = {
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

export type UpdateTaskModel = {
    title: string
    description: string
    completed: boolean
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

export type TodolistType = {
    addedDate: string
    id: string
    order: number
    title: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
