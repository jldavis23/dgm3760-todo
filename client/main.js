const getTodos = async () => {
    const res = await fetch('/api/todos')
    return res.json()
}

const getCategories = async () => {
    const res = await fetch('/api/categories')
    return res.json()
}

const initializeApp = async () => {
    const categories = await getCategories()
    const todos = await getTodos()

    showCategoryList(categories, todos, null)
}
initializeApp()



// DISPLAY THE TODO LIST ------------------------------
const todoList = document.querySelector('.todo-list')

const populateList = (categories, todos) => {
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }

    // let filteredTodos
    // if (categoryID) {
    //     filteredTodos = todos.filter(todo => todo.category === categoryID)
    // } else {
    //     filteredTodos = todos
    // }


    todos.forEach(todo => {
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
                populateList(categories, todos)
            })
        }


        todoButtons.appendChild(editBtn)
        todoButtons.appendChild(deleteBtn)
        todoElement.appendChild(todoButtons)


        todoList.appendChild(todoElement)
    })

    // NUMBER OF TODOS LEFT TO COMPLETE
    const leftToComplete = document.querySelector('.items-left')
    let itemsLeft = todos.filter(todo => !todo.isComplete)
    leftToComplete.textContent = `${itemsLeft.length} item(s) total left to complete`
}

// DISPLAY CATEGORIES LIST ------------------------------
let currentCategory
const categoryList = document.querySelector('.categories-list')
const categorySelect = document.querySelector('.category-select')

const showCategoryList = (categories, todos, activeCategory) => {
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
            span.addEventListener('click', () => displayByCategory(category.id))
            li.appendChild(span)

            editBtn.textContent = 'edit'
            editBtn.addEventListener('click', () => {
                category.editMode = true
                showCategoryList(categories, todos, currentCategory)
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
    populateList(categories, todos)
}

// ADD A NEW TODO ------------------------------
const todoForm = document.querySelector('.todo-form')
const todoInput = document.querySelector('.todo-input')

const addTodo = async (event) => {
    event.preventDefault()

    try {
        const res = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: todoInput.value,
                category: parseInt(categorySelect.value)
            })
        })
        const todos = await res.json()
        const categories = await getCategories()
        // showCategoryList(categories, todos, currentCategory)
        displayByCategory(parseInt(categorySelect.value))
    } catch (err) {
        console.log(err)
    }

    todoInput.value = ''
    categorySelect.value = ''
}

todoForm.addEventListener('submit', addTodo)

// ADD A NEW CATEGORY ------------------------------
const categoryForm = document.querySelector('.category-form')
const categoryInput = document.querySelector('.category-input')

const addCategory = async (event) => {
    event.preventDefault()

    const newCategory = categoryInput.value.toLowerCase()
    let currentCategories = await getCategories()

    if (!currentCategories.some(category => category.categoryName === newCategory)) {
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    categoryName: newCategory
                })
            })
            const categories = await res.json()
            const todos = await getTodos()
            showCategoryList(categories, todos, currentCategory)
        } catch (err) {
            console.log(err)
        }
    }

    categoryInput.value = ''
}

categoryForm.addEventListener('submit', addCategory)

// COMPLETE A TODO ------------------------------
const completeTodo = async (todo) => {
    try {
        const res = await fetch(`/api/todos/${todo.id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                name: todo.name,
                isComplete: !todo.isComplete,
                category: todo.category,
                editMode: todo.editMode
            })
        })

        const todos = await res.json()
        const categories = await getCategories()

        populateList(categories, todos)
    } catch (err) {
        console.log(err)
    }
}

// EDIT OR SAVE TODO ------------------------------
const saveTodo = async (event, todo, input, select) => {
    event.preventDefault()

    try {
        const res = await fetch(`/api/todos/${todo.id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                name: input.value,
                isComplete: todo.isComplete,
                category: parseInt(select.value),
                editMode: !todo.editMode
            })
        })

        const todos = await res.json()
        const categories = await getCategories()

        populateList(categories, todos)
    } catch (err) {
        console.log(err)
    }
}

// EDIT OR SAVE CATEGORY ------------------------------
const saveCategory = async (event, category, input) => {
    event.preventDefault()

    try {
        const res = await fetch(`/api/categories/${category.id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                categoryName: input.value,
                editMode: !category.editMode
            })
        })

        const categories = await res.json()
        const todos = await getTodos()

        console.log(categories)

        showCategoryList(categories, todos, currentCategory)
    } catch (err) {
        console.log(err)
    }
}

// DELETE A TODO ------------------------------
const deleteTodo = async (id) => {
    try {
        const res = await fetch(`/api/todos/${id}`, {
            method: 'DELETE'
        })

        const todos = await res.json()
        const categories = await getCategories()

        populateList(categories, todos)
    } catch (err) {
        console.log(err)
    }
}

// DELETE A CATEGORY ------------------------------
const deleteCategory = async (id) => {
    try {
        const res = await fetch(`/api/categories/${id}`, {
            method: 'DELETE'
        })

        const categories = await res.json()
        let todos = await getTodos()

        todos.forEach(todo => {
            if (todo.category === id) {
                fetch(`/api/todos/${todo.id}`, {method:'DELETE'})
            }
        })

        todos = await getTodos()

        showCategoryList(categories, todos, currentCategory)
    } catch (err) {
        console.log(err)
    }
}

// DISPLAY TODOS BY CATEGORY ------------------------------
const displayByCategory = async (categoryID) => {
    try {
        let todos
        if (categoryID) {
            const res = await fetch(`/api/categories/${categoryID}/todos`)
            todos = await res.json()
        } else {
            todos = await getTodos()
        }
        const categories = await getCategories()

        showCategoryList(categories, todos, categoryID)
    } catch (err) {
        console.log(err)
    }
}

// CLEAR COMPLETED TODOS ------------------------------
const clearCompleted = async () => {
    let todos = await getTodos()
    todos.forEach(todo => {
        if (todo.isComplete) {
            fetch(`/api/todos/${todo.id}`, {method:'DELETE'})
        }
    })
    todos = await getTodos()
    let categories = await getCategories()

    populateList(categories, todos)
}

const clearBtn = document.querySelector('.clear-btn')
clearBtn.addEventListener('click', clearCompleted)