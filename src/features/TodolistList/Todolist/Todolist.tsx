import React, {memo, useCallback, useEffect} from 'react';
import {AddItemForm} from "../../../common/components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../common/components/EditableSpan/EditableSpan";
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import {filterButtonsContainerSx} from './Todolist.style'
import {ButtonWithMemo} from "../../../common/components/Button/ButtonWithMemo";
import {Task} from "./Task/Task";
import {FilterValuesType} from "../../../model/todolists-reducer";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {fetchTasksThunk} from "../../../model/tasks-reducer";
import {useAppDispatch} from "../../../model/store";
import {RequestStatusType} from "../../../App/app-reducer";

type TodolistPropsType = {
    id: string
    title: string
    filter: FilterValuesType
    tasks: TaskType[]
    date?: Date
    removeTask: (todoId: string, taskId: string) => void
    changeFilter: (todoId: string, filter: FilterValuesType) => void
    addTask: (todoId: string, title: string) => void
    changeTaskStatus: (todoId: string, taskId: string, status: TaskStatuses) => void
    removeTodolist: (todoId: string) => void
    changeTaskTitle: (todoId: string, taskId: string, title: string) => void
    updateTodolist: (todoId: string, title: string) => void
    entityStatus: RequestStatusType
}

export const Todolist = memo(({
                                  id,
                                  removeTodolist,
                                  title,
                                  date,
                                  tasks,
                                  removeTask,
                                  changeFilter,
                                  entityStatus,
                                  addTask,
                                  filter,
                                  changeTaskStatus,
                                  changeTaskTitle,
                                  updateTodolist
                              }: TodolistPropsType) => {

    console.log('Todolist called')

    // useEffect(() => {
    //     dispatch(fetchTasksThunk(id))
    // }, []);

    let tasksForTodolist = tasks
    if (filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    } else if (filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }


    const addTaskCallback = useCallback((title: string) => {
        addTask(id, title)
    }, [id])

    const removeTodolistHandler = () => {
        removeTodolist(id)
    }

    // const changeTaskTitleHandler = () => {
    //     changeTaskTitle()
    // }

    const updateTodolistHandler = useCallback((title: string) => {
        updateTodolist(id, title)
    }, [updateTodolist, id])

    const changeFilterAllHandler = () => {
        changeFilter(id, "all")
    }
    const changeFilterActiveHandler = () => {
        changeFilter(id, "active")
    }
    const changeFilterCompletedHandler = () => {
        changeFilter(id, "completed")
    }

    const removeTaskHandler = useCallback((todolistId: string, taskId: string) => {
        removeTask(todolistId, taskId)
    }, [removeTask])

    const changeTaskStatusHandler = useCallback((todolistId: string, taskId: string, status: TaskStatuses) => {
        changeTaskStatus(todolistId, taskId, status)
    }, [])

    return (
        <div>
            <div className={'todolist-title-container'}>
                <h3>
                    <EditableSpan disabled={entityStatus === 'loading'} value={title} onChange={updateTodolistHandler}/>
                </h3>
                <IconButton onClick={removeTodolistHandler} disabled={entityStatus === 'loading'}>
                    <DeleteIcon/>
                </IconButton>
            </div>
            <div>
                <AddItemForm addItem={addTaskCallback} disabled={entityStatus === 'loading'}/>
            </div>
            {tasksForTodolist.length ?
                <List>
                    {tasksForTodolist.map(t => {
                            return <Task key={t.id} todolistId={id} task={t} removeTask={removeTaskHandler}
                                         entityStatus={entityStatus}
                                         changeTaskStatus={changeTaskStatusHandler}
                                         changeTaskTitle={changeTaskTitle}/>
                        }
                    )}
                </List>
                : <div>Тасок нет</div>
            }
            <Box sx={filterButtonsContainerSx}>
                <ButtonWithMemo
                    variant={filter === 'all' ? 'outlined' : 'text'}
                    color={'inherit'}
                    onClick={changeFilterAllHandler}
                >
                    All
                </ButtonWithMemo>
                <ButtonWithMemo
                    variant={filter === 'active' ? 'outlined' : 'text'}
                    color={'primary'}
                    onClick={changeFilterActiveHandler}
                >
                    Active
                </ButtonWithMemo>
                <ButtonWithMemo
                    variant={filter === 'completed' ? 'outlined' : 'text'}
                    color={'secondary'}
                    onClick={changeFilterCompletedHandler}
                >
                    Completed
                </ButtonWithMemo>
            </Box>
            {date ? <div>{date.toLocaleDateString('ru-RU')}</div> : null}
        </div>
    );
})