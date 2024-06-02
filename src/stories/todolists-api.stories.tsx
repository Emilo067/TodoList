import React, { useEffect, useState } from 'react'
import {todolistAPI} from "../api/todolist-api";

export default {
    title: 'API',
}
export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        todolistAPI.getTodolists().then(res => {
            setState(res.data)
        })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = '8ac793b3-2cfa-4df9-8561-1d5aae7635c2'
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        todolistAPI.getTasks(todolistId).then(res => {
            setState(res.data.items)
        })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.createTodolist('React')
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const CreateTask= () => {
    const [state, setState] = useState<any>(null)
    const todolistId = '8ac793b3-2cfa-4df9-8561-1d5aae7635c2'
    useEffect(() => {
        todolistAPI.createTask(todolistId, 'NEW TASK')
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = '2ad7a7d8-8aec-4056-b2f5-06a6cd194fc7'
    useEffect(() => {
        todolistAPI.deleteTodolist(todolistId)
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTask= () => {
    const [state, setState] = useState<any>(null)
    const todolistId = '8ac793b3-2cfa-4df9-8561-1d5aae7635c2'
    const taskId = '8ea8f54e-f1d6-4f64-80ab-ccfb8ebb62d2'
    useEffect(() => {
        todolistAPI.deleteTask(todolistId, taskId)
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}


export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = '5343c984-f0e3-4b44-b4bb-863610702236'
    useEffect(() => {
        todolistAPI.updateTodolist(todolistId, 'SOME NEW TITLE').then(res => {
            setState(res.data)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

// export const UpdateTaskTitle = () => {
//     const [state, setState] = useState<any>(null)
//     const todolistId = '8ac793b3-2cfa-4df9-8561-1d5aae7635c2'
//     const taskId = '8ea8f54e-f1d6-4f64-80ab-ccfb8ebb62d2'
//     useEffect(() => {
//         todolistAPI.updateTask(todolistId, taskId,'SOME NEW TITLE').then(res => {
//             setState(res.data)
//         })
//     }, [])
//
//     return <div>{JSON.stringify(state)}</div>
// }