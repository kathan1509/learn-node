const fs = require("fs").promises;
const readline = require("readline");

const TODO_FILE = "todos.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function loadTodos() {
  try {
    const data = await fs.readFile(TODO_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveTodos(todos) {
  await fs.writeFile(TODO_FILE, JSON.stringify(todos, null, 2));
}

async function addTodo() {
  return new Promise((resolve) => {
    rl.question("Enter the todo: ", async (todo) => {
      const todos = await loadTodos();
      todos.push({ id: Date.now(), text: todo, done: false });
      await saveTodos(todos);
      console.log("Todo added successfully!");
      resolve();
    });
  });
}

async function deleteTodo() {
  const todos = await loadTodos();
  console.log("Current todos:");
  todos.forEach((todo, index) => {
    console.log(`${index + 1}. ${todo.text} ${todo.done ? "(Done)" : ""}`);
  });

  return new Promise((resolve) => {
    rl.question("Enter the number of the todo to delete: ", async (num) => {
      const index = parseInt(num) - 1;
      if (index >= 0 && index < todos.length) {
        todos.splice(index, 1);
        await saveTodos(todos);
        console.log("Todo deleted successfully!");
      } else {
        console.log("Invalid todo number.");
      }
      resolve();
    });
  });
}

async function markTodoAsDone() {
  const todos = await loadTodos();
  console.log("Current todos:");
  todos.forEach((todo, index) => {
    console.log(`${index + 1}. ${todo.text} ${todo.done ? "(Done)" : ""}`);
  });

  return new Promise((resolve) => {
    rl.question(
      "Enter the number of the todo to mark as done: ",
      async (num) => {
        const index = parseInt(num) - 1;
        if (index >= 0 && index < todos.length) {
          todos[index].done = true;
          await saveTodos(todos);
          console.log("Todo marked as done!");
        } else {
          console.log("Invalid todo number.");
        }
        resolve();
      }
    );
  });
}

async function displayMenu() {
  console.log("\n--- Todo List CLI ---");
  console.log("1. Add a todo");
  console.log("2. Delete a todo");
  console.log("3. Mark a todo as done");
  console.log("4. Exit");

  return new Promise((resolve) => {
    rl.question("Choose an option: ", (choice) => {
      resolve(choice);
    });
  });
}

async function main() {
  while (true) {
    const choice = await displayMenu();

    switch (choice) {
      case "1":
        await addTodo();
        break;
      case "2":
        await deleteTodo();
        break;
      case "3":
        await markTodoAsDone();
        break;
      case "4":
        console.log("Goodbye!");
        rl.close();
        return;
      default:
        console.log("Invalid choice. Please try again.");
    }
  }
}

main();
