  const inputElement = document.querySelector(".new-task-input");
  const addTaskButton = document.querySelector(".new-task-button");
  const tasksContainer = document.querySelector(".tasks-container");

  //valida se o espaço estiver em branco, n deixa inserir tasks
  const validateInput = () => inputElement.value.trim().length > 0;

  //se o input n for valido ele fica vermelho e nao add tasks
  const handleAddTask = () => {
    const inputIsValid = validateInput();

    console.log(inputIsValid);

    if (!inputIsValid) {
      return inputElement.classList.add("error");
    }

    //div das tasks
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");

    //conteudo das tasks
    const taskContent = document.createElement("p");
    taskContent.innerText = inputElement.value;

    //insere a prox task como 'filha' de alguma existente, fica em ordem de insercao da primeria inserida e assim por diante
    taskContent.addEventListener("click", () => handleClick(taskContent));

    //valida qual item que o usuario quer excluir
    const deleteItem = document.createElement("i");
    deleteItem.classList.add("far");
    deleteItem.classList.add("fa-trash-alt");

    deleteItem.addEventListener("click", () =>
      handleDeleteClick(taskItemContainer, taskContent)
    );

    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(deleteItem);
    tasksContainer.appendChild(taskItemContainer);

    inputElement.value = "";

    updateLocalStorage();
};

//realiza um loop para marcar a tarefa clicada, ou seja, concluiu uma tarefa, quando clicar nela uma barrinha sobre a task é inserida
const handleClick = (taskContent) => {
  const tasks = tasksContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent);

    if (currentTaskIsBeingClicked) {
      task.firstChild.classList.toggle("completed");
    }
  }

  updateLocalStorage();
};

//analisa qual item o usuario clicou, se for o msm que o do clique, a exclusao é feita
const handleDeleteClick = (taskItemContainer, taskContent) => {
  const tasks = tasksContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent);

    if (currentTaskIsBeingClicked) {
      taskItemContainer.remove();
    }
  }

  updateLocalStorage();
};

//se o input passar a ser valido ele remove o erro em vermelho
const handleInputChange = () => {
  const inputIsValid = validateInput();

  if (inputIsValid) {
    return inputElement.classList.remove("error");
  }
};

//armazenador do conteudo, sempre que add algo, excluir ou atualizar a pg do browser, noss task list permanecerá intacto
const updateLocalStorage = () => {
  const tasks = tasksContainer.childNodes;

  const localStorageTasks = [...tasks].map((task) => {
    const content = task.firstChild;
    const isCompleted = content.classList.contains("completed");

    return { description: content.innerText, isCompleted };
  });

  localStorage.setItem("tasks", JSON.stringify(localStorageTasks));
};

//atualiza o local storage quandoa altera as tasks
const refreshTasksUsingLocalStorage = () => {
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));

  if (!tasksFromLocalStorage) return;

  for (const task of tasksFromLocalStorage) {
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");

    const taskContent = document.createElement("p");
    taskContent.innerText = task.description;

    if (task.isCompleted) {
      taskContent.classList.add("completed");
    }

    taskContent.addEventListener("click", () => handleClick(taskContent));

    const deleteItem = document.createElement("i");
    deleteItem.classList.add("far");
    deleteItem.classList.add("fa-trash-alt");

    deleteItem.addEventListener("click", () =>
      handleDeleteClick(taskItemContainer, taskContent)
    );

    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(deleteItem);

    tasksContainer.appendChild(taskItemContainer);
  }
};

refreshTasksUsingLocalStorage();

addTaskButton.addEventListener("click", () => handleAddTask());
inputElement.addEventListener("change", () => handleInputChange());