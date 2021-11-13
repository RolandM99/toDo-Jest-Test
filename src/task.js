import Store from './storage.js';

const localStorage = new Store();

export default class Tasks {
  static getFromLocalStore() {
    let myTask;
    if (localStorage.getItem('task')) {
      myTask = JSON.parse(localStorage.getItem('task'));
    } else {
      myTask = [];
    }
    return myTask;
  }

  static addTask(task) {
    const storeElement = Tasks.getFromLocalStore();
    storeElement.push(task);
    localStorage.setItem('task', JSON.stringify(storeElement));
  }

  static addToLocalStore(arr) {
    localStorage.setItem('task', JSON.stringify(arr));
  }

  static addToPage(item) {
    const arrayOfElements = Tasks.getFromLocalStore();
    arrayOfElements.forEach((element) => Tasks.myTasksView(element, item));
    Tasks.addToLocalStore(arrayOfElements);
  }

  static deleteTask(target, index) {
    const storedBooks = Tasks.getFromLocalStore();
    storedBooks.splice(index, 1);
    Tasks.eventStatus(storedBooks);
    localStorage.setItem('task', JSON.stringify(storedBooks));
    target.parentElement.parentElement.parentElement.remove();
  }

  static removeCompletedTasks(target) {
    target.parentElement.parentElement.remove();
  }

  static myTasksView(element, item) {
    let checked = '';
    if (element.completed) {
      checked = 'checked';
    }
    const listElement = document.createElement('li');
    listElement.classList.add('flrow');
    listElement.innerHTML = `
      <div class="taskCheck">
        <input type="checkbox" class="hello" id="${element.index}" ${checked}>
        <label for="${element.index}">${element.myTask}</label>
        <textarea name="text" class="textarea hide" cols="30" rows="1" placeholder="${element.myTask}" maxlength="100"></textarea>
        <small class="hide"><i class="fas fa-check"></i></small>
      </div>
      <div>
        <div class="vdots"><i class="fas fa-ellipsis-v"></i></div>
        <span class="tras hide"><i class="far fa-trash-alt" id="${element.index} trash"></i></span>
      </div>`;
    item.appendChild(listElement);
  }

  static eventStatus(arr) {
    arr.forEach((task, index) => {
      task.index = index + 1;
    });
    return arr;
  }

  static lastElementsIndex(parent) {
    if (parent.childElementCount > 0) {
      return parent.childElementCount + 1;
    }
    return 1;
  }

  static checkButtons() {
    const tryCheck = Array.from(document.getElementsByClassName('hello'));
    return tryCheck;
  }

  static editFromTextarea(text, index) {
    const tasks = Tasks.getFromLocalStore();
    tasks[index].task = text;
    Tasks.addToLocalStore(tasks);
  }

  static clearAllCompletedTasks() {
    const checkBoxes = Tasks.checkButtons();
    checkBoxes.forEach((box) => {
      if (box.checked) {
        Tasks.removeCompletedTasks(box);
      }
    });
    Tasks.makeOrderIndex();
    const tasks = Tasks.getFromLocalStore();
    const tasksToDo = tasks.filter((task) => !task.completed);
    Tasks.eventStatus(tasksToDo);
    Tasks.addToLocalStore(tasksToDo);
  }

  static makeOrderIndex() {
    const elements = Tasks.checkButtons();
    elements.forEach((elem, index) => elem.setAttribute('id', `${index + 1}`));
  }

  static editTask(e) {
    const index = parseInt(e.srcElement.attributes.for.nodeValue, 10) - 1;
    const textarea = e.srcElement.nextElementSibling;
    const confirm = textarea.nextElementSibling;
    confirm.classList.remove('hide');
    textarea.classList.remove('hide');
    e.target.classList.add('hide');
    confirm.addEventListener('click', () => {
      if (textarea.value === '') {
        textarea.value = e.target.innerHTML;
      }
      Tasks.editFromTextarea(textarea.value, index);
      confirm.classList.add('hide');
      textarea.classList.add('hide');
      e.target.textContent = textarea.value;
      e.target.classList.remove('hide');
    });
  }

  static completedTaskStored(e) {
    const toChange = Tasks.getFromLocalStore();
    const i = parseInt(e.id, 10) - 1;
    toChange[i].completed = e.checked;
    Tasks.addToLocalStore(toChange);
  }
}