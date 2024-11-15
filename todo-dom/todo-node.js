const fs = require("fs").promises;
const { program } = require("commander");
const path = require("path");

const TODO_FILE = path.join(__dirname, "todos.json");

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

program.version("1.0.0").description("A command-line todo list application");

program
  .command("add <todo>")
  .description("Add a new todo")
  .action(async (todo) => {
    const todos = await loadTodos();
    todos.push({ id: Date.now(), text: todo, done: false });
    await saveTodos(todos);
    console.log("Todo added successfully!");
  });

program
  .command("list")
  .description("List all todos")
  .action(async () => {
    const todos = await loadTodos();
    if (todos.length === 0) {
      console.log("No todos found.");
    } else {
      todos.forEach((todo, index) => {
        console.log(`${index + 1}. [${todo.done ? "X" : " "}] ${todo.text}`);
      });
    }
  });

program
  .command("delete <index>")
  .description("Delete a todo")
  .action(async (index) => {
    const todos = await loadTodos();
    const todoIndex = parseInt(index) - 1;
    if (todoIndex >= 0 && todoIndex < todos.length) {
      todos.splice(todoIndex, 1);
      await saveTodos(todos);
      console.log("Todo deleted successfully!");
    } else {
      console.log("Invalid todo number.");
    }
  });

program
  .command("done <index>")
  .description("Mark a todo as done")
  .action(async (index) => {
    const todos = await loadTodos();
    const todoIndex = parseInt(index) - 1;
    if (todoIndex >= 0 && todoIndex < todos.length) {
      todos[todoIndex].done = true;
      await saveTodos(todos);
      console.log("Todo marked as done!");
    } else {
      console.log("Invalid todo number.");
    }
  });

program.parse(process.argv);

// If no arguments, display help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
