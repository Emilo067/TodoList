import React, {memo, useCallback} from 'react';
import {FilterValuesType, TaskType} from "../App/App";
import {AddItemForm} from "../common/components/AddItemForm/AddItemForm";
import {EditableSpan} from "../common/components/EditableSpan/EditableSpan";
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import {filterButtonsContainerSx} from './Todolist.style'
import {ButtonWithMemo} from "../common/components/Button/ButtonWithMemo";
import {Task} from "./Task/Task";

type TodolistPropsType = {
    id: string
    title: string
    filter: FilterValuesType
    tasks: TaskType[]
    date?: Date
    removeTask: (todoId: string, taskId: string) => void
    changeFilter: (todoId: string, filter: FilterValuesType) => void
    addTask: (todoId: string, title: string) => void
    changeTaskStatus: (todoId: string, taskId: string, isDone: boolean) => void
    removeTodolist: (todoId: string) => void
    changeTaskTitle: (todoId: string, taskId: string, title: string) => void
    updateTodolist: (todoId: string, title: string) => void
}

export const Todolist = memo(({
                                  id,
                                  removeTodolist,
                                  title,
                                  date,
                                  tasks,
                                  removeTask,
                                  changeFilter,
                                  addTask,
                                  filter,
                                  changeTaskStatus,
                                  changeTaskTitle,
                                  updateTodolist
                              }: TodolistPropsType) => {

    console.log('Todolist called')

    let tasksForTodolist = tasks
    if (filter === 'active') {
        tasksForTodolist = tasks.filter(t => !t.isDone)
    } else if (filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.isDone)
    }


    const addTaskCallback = useCallback((title: string) => {
        addTask(id, title)
    }, [addTask, id])

    const removeTodolistHandler = () => {
        removeTodolist(id)
    }


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

    return (
        <div>
            <div className={'todolist-title-container'}>
                <h3>
                    <EditableSpan value={title} onChange={updateTodolistHandler}/>
                </h3>
                <IconButton onClick={removeTodolistHandler}>
                    <DeleteIcon/>
                </IconButton>
            </div>
            <div>
                <AddItemForm addItem={addTaskCallback}/>
            </div>
            {tasksForTodolist.length ?
                <List>
                    {tasksForTodolist.map(t => {


                            return <Task key={t.id} todolistId={id} task={t} removeTask={removeTask}
                                         changeTaskStatus={changeTaskStatus}
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