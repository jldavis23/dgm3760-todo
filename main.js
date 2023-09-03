let todos = [
    {
        id: 1,
        name: "do homework",
        isComplete: false,
        category: "school",
        dueDate: "2023-09-23"
    },
    {
        id: 2,
        name: "submit report",
        isComplete: false,
        category: "work",
        dueDate: "2023-09-04"
    },
    {
        id: 3,
        name: "go grocery shopping",
        isComplete: true,
        category: "home",
        dueDate: "none"
    }
]
let id = todos.length + 1

// DISPLAY THE TODO LIST ------------------------------
const todoList = document.querySelector('.todo-list')

const populateList = () => {
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }

    todos.forEach(todo => {
        let todoElement = document.createElement('li')
        todoElement.classList.add('todo')
        todoElement.textContent = todo.name

        if (todo.isComplete) {
            todoElement.classList.add("completed")
        }
        todoElement.addEventListener('click', () => completeTodo(todo))

        todoList.appendChild(todoElement)
    })
}

populateList()

// ADD A NEW TODO ------------------------------
const todoForm = document.querySelector('.todo-form')
const todoInput = document.querySelector('.todo-input')

const addTodo = (event) => {
    event.preventDefault()

    todos = [...todos, 
        {
            id: id++,
            name: todoInput.value,
            isComplete: false,
            category: 'none',
            dueDate: 'none'
        }
    ]

    todoInput.value = ''
    populateList()
}

todoForm.addEventListener('submit', addTodo)

// COMPLETE A TODO ------------------------------
const completeTodo = (todo) => {
    todo.isComplete = !todo.isComplete
    populateList()
}