let todos = [
    {
        id: 1,
        name: "do homework",
        isComplete: false,
        category: 3,
        dueDate: "2023-09-23",
        editMode: false
    },
    {
        id: 2,
        name: "submit report",
        isComplete: false,
        category: 2,
        dueDate: "2023-09-04",
        editMode: false
    },
    {
        id: 3,
        name: "go grocery shopping",
        isComplete: true,
        category: 1,
        dueDate: "none",
        editMode: false
    }
]
let id = todos.length + 1

let categories = [
    {
        id: null,
        categoryName: 'all'
    },
    {
        id: 1,
        categoryName: 'home'
    },
    {
        id: 2,
        categoryName: 'work'
    },
    {
        id: 3,
        categoryName: 'school'
    }
]
let categoriesID = categories.length

// NUMBER OF TODOS LEFT TO COMPLETE
const leftToComplete = document.querySelector('.items-left')

const updateItemsLeft = () => {
    let itemsLeft = todos.filter(todo => !todo.isComplete)
    leftToComplete.textContent = `${itemsLeft.length} item(s) left to complete`
}

// DISPLAY THE TODO LIST ------------------------------
const todoList = document.querySelector('.todo-list')

const populateList = (categoryID) => {
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }

    let filteredTodos
    if (categoryID) {
        filteredTodos = todos.filter(todo => todo.category === categoryID)
    } else {
        filteredTodos = todos
    }
    

    filteredTodos.forEach(todo => {
        // const li = `
        //     <li class="todo">
        //         <div class="todo-label">
        //             <input type="checkbox">
        //             <span>${todo.name}</span>
        //         </div>
        //         <div class="todo-buttons">
        //             <button>edit</button>
        //             <button>delete</button>
        //         </div>
        //     </li>
        // `
        
        // todoList.insertAdjacentHTML('beforeend', li)
        

        let todoElement = document.createElement('li')
        todoElement.classList.add('todo')

        let todoLabel = document.createElement('div')
        todoLabel.className = 'todo-label'

        let checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        if (todo.isComplete) checkbox.checked = true
        checkbox.addEventListener('click', () => completeTodo(todo))

        todoLabel.appendChild(checkbox)
        todoElement.appendChild(todoLabel)

        let todoButtons = document.createElement('div')
        todoButtons.className = 'todo-buttons'

        let editBtn = document.createElement('button')

        let deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'delete'
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id))

        if (todo.editMode) {
            let form = document.createElement('form')

            let input = document.createElement('input')
            input.type = 'text'
            input.value = todo.name

            form.addEventListener('submit', () => saveTodo(event, todo, input))

            form.appendChild(input)
            todoLabel.appendChild(form)

            editBtn.textContent = 'save'
            editBtn.addEventListener('click', () => saveTodo(event, todo, input))
        } else {
            let span = document.createElement('span')
            span.textContent = todo.name

            if (todo.isComplete) {
                span.className = 'completed'
            }
            todoLabel.appendChild(span)

            editBtn.textContent = 'edit'
            editBtn.addEventListener('click', () => {
                todo.editMode = true
                populateList(categoryID)
            })
        }

        
        todoButtons.appendChild(editBtn)
        todoButtons.appendChild(deleteBtn)
        todoElement.appendChild(todoButtons)

        
        todoList.appendChild(todoElement)
    })

    updateItemsLeft()
}

populateList(null)

// DISPLAY CATEGORIES LIST ------------------------------
let currentCategory
const categoryList = document.querySelector('.categories-list')

const showCategoryList = (activeCategory) => {
    while (categoryList.firstChild) {
        categoryList.removeChild(categoryList.firstChild);
    }

    categories.forEach(category => {
        let p = document.createElement('p')
        p.textContent = category.categoryName

        if (activeCategory === category.id) {
            p.className = 'category-btn active-category'
        } else {
            p.className = 'category-btn'
        }

        p.addEventListener('click', () => showCategoryList(category.id))

        categoryList.appendChild(p)
    })

    currentCategory = activeCategory
    populateList(activeCategory)
}

showCategoryList(null)

// ADD A NEW TODO ------------------------------
const todoForm = document.querySelector('.todo-form')
const todoInput = document.querySelector('.todo-input')
const categoryInput = document.querySelector('.category-input')

const addTodo = (event) => {
    event.preventDefault()

    todos = [...todos, 
        {
            id: id++,
            name: todoInput.value,
            isComplete: false,
            category: parseInt(categoryInput.value),
            dueDate: 'none'
        }
    ]

    todoInput.value = ''
    showCategoryList(parseInt(categoryInput.value))
    categoryInput.value = ''
}

todoForm.addEventListener('submit', addTodo)

// COMPLETE A TODO ------------------------------
const completeTodo = (todo) => {
    todo.isComplete = !todo.isComplete
    populateList(currentCategory)
}

// EDIT OR SAVE ------------------------------
const saveTodo = (event, todo, input) => {
    event.preventDefault()

    todo.editMode = !todo.editMode
    todo.name = input.value

    populateList(currentCategory)
}

// DELETE A TODO ------------------------------
const deleteTodo = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id)
    todos = newTodos
    populateList(currentCategory)
}

// CLEAR COMPLETED TODOS ------------------------------
const clearCompleted = () => {
    const newTodos = todos.filter(todo => !todo.isComplete)
    todos = newTodos
    populateList(currentCategory)
}

const clearBtn = document.querySelector('.clear-btn')
clearBtn.addEventListener('click', clearCompleted)