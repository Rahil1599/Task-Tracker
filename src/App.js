import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/addTask";
import { useState, useEffect } from "react";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getFetchTask = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };
    getFetchTask();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    return data;
  };

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/task/${id}`);
    const data = await res.json();
    return data;
  };

  const toggleReminder = async (id) => {
    //fetch the task with id
      const taskToToggle = await fetchTask(id);
      //update the reminder in the fetched task
      const updtask = {...taskToToggle, reminder: !taskToToggle.reminder}

      //make an update request with the updated task
      const res = await fetch(`http://localhost:5000/tasks/${id}`,{
        method: 'PUT',
        headers:{
          'Content-type':'application/json'
        },
        body: JSON.stringify(updtask)
      })
      const data = await res.json();

      //update to display with setTasks
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  const addTask = async (task) => {
    const res = await fetch(`http://localhost:5000/tasks`, {
      method: 'POST',
      headers: {
        "Content-type": 'application/json',
      },
      body: JSON.stringify(task),
    });
    const data = await res.json();
    
    setTasks([...tasks, data]);
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });

    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="container">
      <Header
        onShowAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
      ) : (
        "No tasks"
      )}
    </div>
  );
}

export default App;
