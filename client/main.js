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

const populateList = (categories, todos, categoryID) => {
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
                populateList(categories, todos, categoryID)
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
    populateList(categories, todos, activeCategory)
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
        showCategoryList(categories, todos, currentCategory)
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
                    categoryName: newCategory,
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

    categoryInput.value = ''
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