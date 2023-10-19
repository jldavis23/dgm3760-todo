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
        categoryName: 'all',
        editMode: false
    },
    {
        id: 1,
        categoryName: 'home',
        editMode: false
    },
    {
        id: 2,
        categoryName: 'work',
        editMode: false
    },
    {
        id: 3,
        categoryName: 'school',
        editMode: false
    }
]
let categoriesID = categories.length

// NUMBER OF TODOS LEFT TO COMPLETE
const leftToComplete = document.querySelector('.items-left')

const updateItemsLeft = () => {
    let itemsLeft = todos.filter(todo => !todo.isComplete)
    leftToComplete.textContent = `${itemsLeft.length} item(s) total left to complete`
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

            let select = document.createElement('select')
            categories.forEach(category => {
                let option = document.createElement('option')
                option.value = category.id
                option.textContent = category.categoryName
                if (category.id === todo.category) option.selected = true
                if (category.id) select.appendChild(option)
            })

            form.addEventListener('submit', () => saveTodo(event, todo, input, select))

            form.appendChild(input)
            form.appendChild(select)
            todoLabel.appendChild(form)

            editBtn.textContent = 'save'
            editBtn.addEventListener('click', () => saveTodo(event, todo, input, select))
        } else {
            let name = document.createElement('span')
            name.textContent = todo.name

            if (todo.isComplete) {
                name.className = 'completed'
            }
            todoLabel.appendChild(name)

            let categoryLabel = document.createElement('span')
            categoryLabel.className = 'category-label'
            const category = categories.filter(category => category.id === todo.category)
            categoryLabel.textContent = `(${category[0].categoryName})`
            todoLabel.appendChild(categoryLabel)

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

// DISPLAY CATEGORIES LIST ------------------------------
let currentCategory
const categoryList = document.querySelector('.categories-list')
const categorySelect = document.querySelector('.category-select')

const showCategoryList = (activeCategory) => {
    while (categoryList.firstChild) {
        categoryList.removeChild(categoryList.firstChild);
    }

    while (categorySelect.firstChild) {
        categorySelect.removeChild(categorySelect.firstChild);
    }

    categories.forEach(category => {
        //Create the category select-----------
        let option = document.createElement('option')
        option.value = category.id
        if (category.id) {
            option.textContent = category.categoryName
        } else {
            option.textContent = "Category"
            option.selected = true
            option.disabled = true
            option.value = ''
        }
        categorySelect.appendChild(option)

        //Create the category sidebar-----------
        let li = document.createElement('li')

        let div = document.createElement('div')
        div.className = 'category-actions'

        let editBtn = document.createElement('button')

        let deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'delete'
        deleteBtn.addEventListener('click', () => deleteCategory(category.id))

        if (category.editMode) {
            let form = document.createElement('form')

            let input = document.createElement('input')
            input.type = 'text'
            input.value = category.categoryName

            form.addEventListener('submit', () => saveCategory(event, category, input))
            form.appendChild(input)

            li.appendChild(form)

            editBtn.textContent = 'save'
            editBtn.addEventListener('click', () => saveCategory(event, category, input))
        } else {
            if (activeCategory === category.id) {
                li.className = 'category-btn active-category'
            } else {
                li.className = 'category-btn'
            }
    
            let span = document.createElement('span')
            span.textContent = category.categoryName
            span.addEventListener('click', () => showCategoryList(category.id))
            li.appendChild(span)

            editBtn.textContent = 'edit'
            editBtn.addEventListener('click', () => {
                category.editMode = true
                showCategoryList(currentCategory)
            })
        }

        div.appendChild(editBtn)
        div.appendChild(deleteBtn)
        li.appendChild(div)

        categoryList.appendChild(li)

        if (!category.id) {
            li.removeChild(li.lastChild)
        }
    })

    currentCategory = activeCategory
    populateList(activeCategory)
}

// Shows the category list and populates the todo list on inital load
showCategoryList(null)

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
            category: parseInt(categorySelect.value),
            dueDate: 'none'
        }
    ]

    todoInput.value = ''
    showCategoryList(parseInt(categorySelect.value))
    categorySelect.value = ''
}

todoForm.addEventListener('submit', addTodo)

// ADD A NEW CATEGORY ------------------------------
const categoryForm = document.querySelector('.category-form')
const categoryInput = document.querySelector('.category-input')

const addCategory = (event) => {
    event.preventDefault()

    const newCategory = categoryInput.value.toLowerCase()

    if (!categories.some(category => category.categoryName === newCategory)) {
        categories = [...categories,
            {
                id: categoriesID++,
                categoryName: newCategory,
                editMode: false
            }
        ]
    }

    categoryInput.value = ''
    showCategoryList(currentCategory)
}

categoryForm.addEventListener('submit', addCategory)

// COMPLETE A TODO ------------------------------
const completeTodo = (todo) => {
    todo.isComplete = !todo.isComplete
    populateList(currentCategory)
}

// EDIT OR SAVE TODO ------------------------------
const saveTodo = (event, todo, input, select) => {
    event.preventDefault()

    todo.editMode = !todo.editMode
    todo.name = input.value
    todo.category = parseInt(select.value)

    populateList(currentCategory)
}

// EDIT OR SAVE CATEGORY ------------------------------
const saveCategory = (event, category, input) => {
    event.preventDefault()

    category.editMode = !category.editMode
    category.categoryName = input.value

    showCategoryList(currentCategory)
}

// DELETE A TODO ------------------------------
const deleteTodo = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id)
    todos = newTodos
    populateList(currentCategory)
}

// DELETE A CATEGORY ------------------------------
const deleteCategory = (id) => {
    const newCategories = categories.filter(category => category.id !== id)
    categories = newCategories

    const newTodos = todos.filter(todo => todo.category !== id)
    todos = newTodos

    showCategoryList(currentCategory)
}

// CLEAR COMPLETED TODOS ------------------------------
const clearCompleted = () => {
    const newTodos = todos.filter(todo => !todo.isComplete)
    todos = newTodos
    populateList(currentCategory)
}

const clearBtn = document.querySelector('.clear-btn')
clearBtn.addEventListener('click', clearCompleted)