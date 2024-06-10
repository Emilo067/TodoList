import type { Meta, StoryObj } from "@storybook/react";
import { Task } from "features/TodolistList/ui/Todolist/TasksList/Task/Task";
import { useState } from "react";
import { TaskPriorities, TaskStatuses } from "common/enums/enums";

// More on how to set up stories at:
// https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Task> = {
  title: "TODOLISTS/Task",
  component: Task,
  parameters: {
    layout: ["centered"],
  },
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes:
  args: {
    task: {
      id: "taskId",
      title: "JS",
      status: TaskStatuses.Completed,
      description: "test task",
      completed: false,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: "todolistId1",
      order: 0,
      addedDate: "",
    },
    todolistId: "totolistId",
  },
  // https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof Task>;

// More on component templates:
// https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const TaskIsDoneStory: Story = {
  args: {},
};
// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const TaskIsNotDoneStory: Story = {
  args: {
    task: {
      id: "taskId",
      title: "JS",
      status: TaskStatuses.New,
      description: "test task",
      completed: false,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: "todolistId1",
      order: 0,
      addedDate: "",
    },
  },
};

export const TaskToggleStory: Story = {
  render: (args) => {
    const [task, setTask] = useState(args.task);

    function changeTaskStatus() {
      setTask({ ...task, status: task.status === TaskStatuses.New ? TaskStatuses.Completed : TaskStatuses.New });
    }

    function changeTaskTitle(todolistId: string, taskId: string, title: string) {
      setTask({ ...task, title });
    }

    return <Task entityStatus={"idle"} task={task} todolistId={"todolistId"} />;
  },
};
