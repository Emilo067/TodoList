import React, {useCallback, useEffect} from 'react'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {
    changeTodolistFilterAC, changeTodolistTitleTC, createTodolistTC, fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType
} from "../../model/todolists-reducer";
import {TasksStateType} from "../../App/App";
import {useAppDispatch, useAppSelector} from "../../model/store";
import {createTaskTC, removeTaskTC, updateTaskTC} from "../../model/tasks-reducer";
import {TaskStatuses} from "../../api/todolist-api";
import {AddItemForm} from "../../common/components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";

export const TodolistsList: React.FC = () => {

    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if(!isLoggedIn) {
            return
        }
        dispatch(fetchTodolistsTC)
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        const thunk = removeTaskTC(id, todolistId)
        dispatch(thunk)
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        const thunk = createTaskTC(title, todolistId)
        dispatch(thunk)
    }, [])

    const changeTaskStatus = useCallback(function (todolistId: string, taskId: string, status: TaskStatuses,) {
        const thunk = updateTaskTC(todolistId, taskId, {status})
        dispatch(thunk)
    }, [])

    const changeTaskTitle = useCallback(function (todolistId: string, taskId: string, title: string,) {
        const thunk = updateTaskTC(todolistId, taskId, {title})
        dispatch(thunk)
    }, [])

    const changeFilter = useCallback(function (todolistId: string, value: FilterValuesType,) {
        const action = changeTodolistFilterAC(todolistId, value)
        dispatch(action)
    }, [])

    const removeTodolist = useCallback(function (todolistId: string) {
        dispatch(removeTodolistTC(todolistId))
    }, [])

    const updateTodolist = useCallback(function (id: string, title: string) {
        const thunk = changeTodolistTitleTC(id, title)
        dispatch(thunk)
    }, [])

    const addTodolistCallback = useCallback((title: string) => {
        const thunk = createTodolistTC(title)
        dispatch(thunk)
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={'/login'} />
    }


    return <>
        <Grid container sx={{mb: '60px'}}>
            <AddItemForm addItem={addTodolistCallback}/>
        </Grid>

        <Grid container spacing={4} gap={5} alignContent={"center"}>
            {todolists.map(tl => {

                return <Grid key={tl.id}>
                    <Paper sx={{p: '0 40px 40px 40px'}}>
                        <Todolist entityStatus={tl.entityStatus}
                                  id={tl.id}
                                  title={tl.title}
                                  removeTodolist={removeTodolist}
                                  tasks={tasks[tl.id]}
                                  filter={tl.filter}
                                  removeTask={removeTask}
                                  changeFilter={changeFilter}
                                  addTask={addTask}
                                  changeTaskStatus={changeTaskStatus}
                                  changeTaskTitle={changeTaskTitle}
                                  updateTodolist={updateTodolist}
                        />
                    </Paper>

                </Grid>
            })}
        </Grid>
    </>
}
