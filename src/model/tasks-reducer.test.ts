import {addTaskAC, changeTaskTitleAC, removeTaskAC, setTasksAC, tasksReducer, updateTaskAC} from './tasks-reducer'
import {TasksStateType} from '../App/App'
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";

let startState: TasksStateType

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1', title: 'CSS', status: TaskStatuses.New, description: 'test task',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: ''
            },
            {
                id: '2', title: 'JS', status: TaskStatuses.Completed, description: 'test task',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: ''
            },
            {
                id: '3', title: 'React', status: TaskStatuses.New, description: 'test task',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: ''
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', status: TaskStatuses.New, description: 'test task',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: ''
            },
            {
                id: '2', title: 'milk', status: TaskStatuses.Completed, description: 'test task',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: ''
            },
            {
                id: '3', title: 'tea', status: TaskStatuses.New, description: 'test task',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: ''
            }
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC('todolistId2', '2')

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1', title: 'CSS', status: TaskStatuses.New, description: 'test task',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: ''
            },
            {
                id: '2', title: 'JS', status: TaskStatuses.Completed, description: 'test task',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: ''
            },
            {
                id: '3', title: 'React', status: TaskStatuses.New, description: 'test task',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: ''
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', status: TaskStatuses.New, description: 'test task',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: ''
            },
            {
                id: '3', title: 'tea', status: TaskStatuses.New, description: 'test task',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: ''
            }
        ]
    })
})

test('correct task should be added to correct array', () => {

    const action = addTaskAC( {id: '1', title: 'juice', status: TaskStatuses.New, description: 'test task',
        completed: false,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: 'todolistId2',
        order: 0,
        addedDate: ''})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juice')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {

    const action = updateTaskAC('todolistId2', '2', {status: TaskStatuses.New})

    const endState = tasksReducer(startState, action)

    expect(startState['todolistId2'][1].status).toBe(TaskStatuses.Completed)
    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
})

test('title of specified task should be changed', () => {

    const newTitle = 'New Title'
    const action = changeTaskTitleAC('todolistId2', '2', newTitle)

    const endState = tasksReducer(startState, action)

    expect(startState['todolistId2'][1].title).toBe('milk')
    expect(endState['todolistId2'][1].title).toBe(newTitle)
})

test('new array should be added when new todolist is added', () => {

    const action = addTodolistAC('new todolist')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {

    const action = removeTodolistAC('todolistId2')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

test('empty arrays should be added when we set todolists', () => {

    const action = setTodolistsAC(
    [{id: 'todolistId1', title: 'What to learn', order: 0, addedDate: ''},
            {id: 'todolistId2', title: 'What to buy', order: 0, addedDate: ''}]
    )

    const endState = tasksReducer({}, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['todolistId1']).toStrictEqual([])
    expect(endState['todolistId2']).toStrictEqual([])
})

test('tasks should be added for todolists', () => {

    const action = setTasksAC('todolistId1', startState['todolistId1'])

    const endState = tasksReducer({
        'todolistId1': [],
        'todolistId2': []
    }, action)


    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toStrictEqual(0)
})


