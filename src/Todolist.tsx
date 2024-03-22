import React, {ChangeEvent, useState} from 'react';
import {FilterValuesType, TaskType} from "./App";
import {Button} from './components/Button/Button';

type TodolistPropsType = {
    title: string
    filter: FilterValuesType
    tasks: TaskType[]
    date?: Date
    removeTask: (id: string) => void
    changeFilter: (filter: FilterValuesType) => void
    addTask: (title: string) => void
    changeTaskStatus: (id: string, isDone: boolean) => void
}

export const Todolist = ({title, date, tasks, removeTask, changeFilter, addTask, filter, changeTaskStatus}: TodolistPropsType) => {

    const [taskTitle, setTaskTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const removeTaskHandler = (id: string) => {
        removeTask(id)
    }

    const changeTaskStatusHandler = (id: string, isDone: boolean) => {
        changeTaskStatus(id, isDone)
    }

    const addTaskHandler = (title: string) => {
        if (title.trim() !== '') {
            addTask(title.trim())
            setTaskTitle('')
        } else {
            setError('Title is required')
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(e.currentTarget.value)
    }

    const onKeyUpHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.code === 'Enter') {
            addTaskHandler(taskTitle)
        }
    }

    return (
        <div>
            <h3>{title}</h3>
            <div>
                <input onKeyUp={(e) => onKeyUpHandler(e)}
                       className={error ? 'error' : ''} onChange={(e) => onChangeHandler(e)} value={taskTitle}
                       type={'text'}/>
                <Button onClick={() => addTaskHandler(taskTitle)} title={'+'}/>
                {error ? <div className={'error-message'}>{error}</div> : null}
            </div>
            {tasks.length ?
                <ul>
                    {tasks.map(t => {
                            return <li className={t.isDone ? 'is-done' : ''} key={t.id}>
                                <input onChange={(e)=>changeTaskStatusHandler(t.id, e.currentTarget.checked)} type={'checkbox'} checked={t.isDone}/>
                                <span>{t.title}</span>
                                <Button title={'X'} onClick={() => removeTaskHandler(t.id)}/>
                            </li>
                        }
                    )}
                </ul>
                : <div>Тасок нет</div>
            }
            <div>
                <Button className={filter === 'all' ? 'active-filter' : ''}
                        title={'All'}
                        onClick={() => changeFilter('all')}/>
                <Button className={filter === 'active' ? 'active-filter' : ''}
                        title={'Active'}
                        onClick={() => changeFilter('active')}/>
                <Button className={filter === 'completed' ? 'active-filter' : ''}
                        title={'Completed'}
                        onClick={() => changeFilter('completed')}/>
            </div>
            {date ? <div>{date.toLocaleDateString('ru-RU')}</div> : null}
        </div>
    );
};