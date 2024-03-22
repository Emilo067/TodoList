import React, {useState} from 'react';
import './App.css';
import {v1} from "uuid";
import {Todolist} from "./Todolist";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type FilterValuesType = 'all' | 'active' | 'completed'

function App() {

    const [tasks, setTasks] = useState<TaskType[]>([
        {id: v1(), title: 'HTML&CSS', isDone: true},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'ReactJS', isDone: false}
    ])

    const [filter, setFilter] = useState<FilterValuesType>('all')

    let tasksForTodolist = tasks

    if(filter === 'active') {
        tasksForTodolist = tasks.filter(t => !t.isDone)
    }

    if(filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.isDone)
    }

    const removeTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id))
    }

    const changeFilter =(filter: FilterValuesType) => {
        setFilter(filter)
    }

    const addTask = (title: string) => {
        setTasks([{id: v1(), title, isDone: false}, ...tasks])
    }

    const changeTaskStatus = (id: string, isDone: boolean) => {
        setTasks(tasks.map(t => t.id === id ? {...t, isDone} : t))
    }

    return (
        <div className="App">
            <Todolist title={'React'}
                      tasks={tasksForTodolist}
                      filter={filter}
                      removeTask={removeTask}
                      changeFilter={changeFilter}
                      addTask={addTask}
                      changeTaskStatus={changeTaskStatus}
            />
        </div>
    );
}

export default App;
