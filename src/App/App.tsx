import React, {useEffect, useState} from 'react';
import '../App.css';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import {MenuButton} from "../common/components/MenuButton/MenuButton";
import {createTheme, ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Switch from '@mui/material/Switch'
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType, useAppSelector} from "../model/store";
import {TaskType} from "../api/todolist-api";
import {CircularProgress, LinearProgress} from "@mui/material";
import {RequestStatusType} from "./app-reducer";
import {ErrorSnackbar} from "../common/components/ErrorSnackbar/ErrorSnackbar";
import {Outlet} from "react-router-dom";
import {initializeAppTC, logoutTC} from "../features/Login/auth-reducer";

export type TasksStateType = {
    [key: string]: TaskType[]
}

type ThemeMode = 'dark' | 'light'

function App() {

    const [themeMode, setThemeMode] = useState<ThemeMode>('light')
    const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)

    const theme = createTheme({
        palette: {
            mode: themeMode === 'light' ? 'light' : 'dark',
            primary: {
                main: '#087EA4',
            },
        },
    })

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const changeModeHandler = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light')
    }

    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    if (!isInitialized) {
        return (
            <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <ErrorSnackbar/>
            <CssBaseline/>
            <AppBar position="static" sx={{mb: '30px'}}>
                <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <IconButton color="inherit">
                        <MenuIcon/>
                    </IconButton>
                    <div>
                        <MenuButton>Login</MenuButton>
                        <MenuButton onClick={logoutHandler}>Logout</MenuButton>
                        <MenuButton>Faq</MenuButton>
                        <Switch color={'default'} onChange={changeModeHandler}/>
                    </div>
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Outlet/>
            </Container>
            {/*<TodolistsList/>*/}
        </ThemeProvider>
    );
}

export default App;
