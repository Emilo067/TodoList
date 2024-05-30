import type {Meta, StoryObj} from '@storybook/react';
import {fn} from "@storybook/test";
import {Task} from "../Todolist/Task/Task";
import {useState} from "react";
import {action} from "@storybook/addon-actions";

// More on how to set up stories at:
// https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Task> = {
    title: 'TODOLISTS/Task',
    component: Task,
    parameters: {
        layout: ['centered']
    },
    // This component will have an automatically generated Autodocs entry:
    // https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes:
    args: {
        task: {id: 'taskId', title: 'JS', isDone: true},
        todolistId: 'totolistId',
        changeTaskStatus: fn(),
        changeTaskTitle: fn(),
        removeTask: fn()
    }
    // https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof Task>;

// More on component templates:
// https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const TaskIsDoneStory: Story = {
    args: {}
}
// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const TaskIsNotDoneStory: Story = {
    args: {
        task: {id: 'taskId', title: 'JS', isDone: false},
    }
}

export const TaskToggleStory: Story = {
    render: (args) => {
        const [task, setTask] = useState(args.task)

        function changeTaskStatus() {
            setTask({...task, isDone: !task.isDone})
        }

        function changeTaskTitle(todolistId: string, taskId: string, title: string) {
            setTask({...task, title})
        }

        return <Task task={task} todolistId={'todolistId'} changeTaskStatus={changeTaskStatus}
                     changeTaskTitle={changeTaskTitle} removeTask={action('removed')}/>
    }
}