import React, {useCallback, useState} from 'react';
import '../App.css';
import {Todolist} from "../Todolist/Todolist";
import {AddItemForm} from "../common/components/AddItemForm/AddItemForm";
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'
import Paper from '@mui/material/Paper'
import {MenuButton} from "../common/components/MenuButton/MenuButton";
import {createTheme, ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Switch from '@mui/material/Switch'
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC
} from "../model/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../model/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../model/store";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: TaskType[]
}

export type FilterValuesType = 'all' | 'active' | 'completed'
type ThemeMode = 'dark' | 'light'

function AppWithRedux() {

    const [themeMode, setThemeMode] = useState<ThemeMode>('light')

    const theme = createTheme({
        palette: {
            mode: themeMode === 'light' ? 'light' : 'dark',
            primary: {
                main: '#087EA4',
            },
        },
    })

    const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()

    const changeModeHandler = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light')
    }

    const removeTask = useCallback((todoId: string, taskId: string) => {
        const action = removeTaskAC(todoId, taskId)
        dispatch(action)
    }, [])

    const changeFilter = useCallback((todoId: string, filter: FilterValuesType) => {
        const action = changeTodolistFilterAC(todoId, filter)
        dispatch(action)
    },[])

    const addTask = useCallback((todoId: string, title: string) => {
        const action = addTaskAC(todoId, title)
        dispatch(action)
    },[])

    const changeTaskStatus = useCallback((todoId: string, taskId: string, isDone: boolean) => {
        const action = changeTaskStatusAC(todoId, taskId, isDone)
        dispatch(action)
    },[])

    const changeTaskTitle= useCallback((todoId: string, taskId: string, title: string) => {
        const action = changeTaskTitleAC(todoId, taskId, title)
        dispatch(action)
    },[])

    const removeTodolist = useCallback((todoId: string) => {
        const action = removeTodolistAC(todoId)
        dispatch(action)
    },[])

    const addTodolistCallback = useCallback((title: string) => {
        const action = addTodolistAC(title)
        dispatch(action)
    },[])

    const updateTodolist = useCallback((todoId: string, title: string) => {
        const action = changeTodolistTitleAC(todoId, title)
        dispatch(action)
    },[])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" sx={{ mb: '30px' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton color="inherit">
                        <MenuIcon />
                    </IconButton>
                    <div>
                        <MenuButton>Login</MenuButton>
                        <MenuButton>Logout</MenuButton>
                        <MenuButton>Faq</MenuButton>
                        <Switch color={'default'} onChange={changeModeHandler} />
                    </div>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container sx={{ mb: '30px' }}>
                    <AddItemForm addItem={addTodolistCallback}/>
                </Grid>

                <Grid container spacing={4}>
                    {todolists.map(tl => {

                        return <Grid key={tl.id}>
                            <Paper  sx={{ p: '0 20px 20px 20px' }}>
                                <Todolist id={tl.id}
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

            </Container>


        </ThemeProvider>
    );
}

export default AppWithRedux;
