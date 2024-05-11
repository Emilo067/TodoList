import React, {useState} from 'react';
import '../App.css';
import {v1} from "uuid";
import {Todolist} from "../Todolist/Todolist";
import {AddItemForm} from "../common/components/AddItemForm/AddItemForm";
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
//❗С релизом новой версии import Grid скорее всего изменится (см. документацию)
import Grid from '@mui/material/Unstable_Grid2'
import Paper from '@mui/material/Paper'
import {MenuButton} from "../common/components/MenuButton/MenuButton";
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Switch from '@mui/material/Switch'

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

function App() {

    const [themeMode, setThemeMode] = useState<ThemeMode>('light')

    const theme = createTheme({
        palette: {
            mode: themeMode === 'light' ? 'light' : 'dark',
            primary: {
                main: '#087EA4',
            },
        },
    })

    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, setTodolists] = useState<TodolistType[]>([
        { id: todolistID1, title: 'What to learn', filter: 'all' },
        { id: todolistID2, title: 'What to buy', filter: 'all' },
    ])

    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistID1]: [
            { id: v1(), title: 'HTML&CSS', isDone: true },
            { id: v1(), title: 'JS', isDone: true },
            { id: v1(), title: 'ReactJS', isDone: false },
        ],
        [todolistID2]: [
            { id: v1(), title: 'Rest API', isDone: true },
            { id: v1(), title: 'GraphQL', isDone: false },
        ],
    })

    const changeModeHandler = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light')
    }

    const removeTask = (todoId: string, taskId: string) => {
        setTasks({...tasks, [todoId]: tasks[todoId].filter(t => t.id !== taskId)})
    }

    const changeFilter = (todoId: string, filter: FilterValuesType) => {
        setTodolists(todolists.map(tl => tl.id === todoId ? {...tl, filter} : tl))
    }

    const addTask = (todoId: string, title: string) => {
        setTasks({...tasks, [todoId]: [...tasks[todoId], {id:v1(), title, isDone: false}]})
    }

    const changeTaskStatus = (todoId: string, taskId: string, isDone: boolean) => {
        setTasks({...tasks, [todoId]: tasks[todoId].map(t => t.id === taskId ? {...t, isDone} : t)})
    }

    const changeTaskTitle= (todoId: string, taskId: string, title: string) => {
        setTasks({...tasks, [todoId]: tasks[todoId].map(t => t.id === taskId ? {...t, title} : t)})
    }

    const removeTodolist = (todoId: string) => {
        setTodolists(todolists.filter(tl => tl.id !== todoId))
        delete tasks[todoId]
        setTasks(tasks)
    }

    const addTodolistCallback = (title: string) => {
        const todolistId = v1()
        setTodolists([{id: todolistId, title, filter: "all"}, ...todolists])
        setTasks({...tasks, [todolistId]: []})
    }

    const updateTodolist = (todoId: string, title: string) => {
        setTodolists(todolists.map(tl => tl.id === todoId ? {...tl, title} : tl))
    }

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
                        const allTodolistTasks = tasks[tl.id]
                        let tasksForTodolist = allTodolistTasks


                        if (tl.filter === 'active') {
                            tasksForTodolist = allTodolistTasks.filter(t => !t.isDone)
                        }

                        if (tl.filter === 'completed') {
                            tasksForTodolist = allTodolistTasks.filter(t => t.isDone)
                        }

                        return <Grid>
                            <Paper  sx={{ p: '0 20px 20px 20px' }}>
                                <Todolist key={tl.id}
                                          id={tl.id}
                                          title={tl.title}
                                          removeTodolist={removeTodolist}
                                          tasks={tasksForTodolist}
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

export default App;
