// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';
import Tasks from './task.js';

const dom = new JSDOM(`<!DOCTYPE html><body><ul id="addList"></body>`); // eslint-disable-line

global.document = dom.window.document;
global.window = dom.window;

const createList = document.getElementById('addList');
const elementToAdd = {
  task: 'Graduate from Microverse',
  completed: false,
  index: 1,
};

Tasks.myTasksView(elementToAdd, createList);

test("Add exactly one 'li' element to the list of tasks", () => {
  expect(createList.childElementCount).toBe(1);
});

Tasks.addTask(elementToAdd);
describe('Test part1: Test remove and add methods in the Tasks Class', () => {
  test('Add elements properties to LocalStorage', () => {
    expect(Tasks.getFromLocalStore()[0].task).toBe('Graduate from Microverse');
  });
  test('Remove element from the DOM and from the localstorage', () => {
    const target = document.getElementById('1 trash');
    const childcount = createList.childElementCount;
    Tasks.deleteTask(target, 0);
    expect(createList.childElementCount).toBeLessThan(childcount);
  });
  test('Add element to the DOM and to LocalStorage', () => {
    expect(Tasks.getFromLocalStore()).toBeDefined();
  });
});

const editText = document.querySelector('textarea');
describe('Test part2 : Edit tasks, Update and delete all completed', () => {
  test('edit task with click event call', () => {
    Tasks.myTasksView(elementToAdd, createList);
    expect(editText.className).toBe('textarea hide');
    const editTarget = document.querySelector('label');
    const clickConfirm = document.querySelector('i');
    editText.value = 'helllo';
    editTarget.click((e) => {
      Tasks.editTask(e);
      clickConfirm.click();
      expect(editTarget.innerText).toBe('helllo');
    });
  });
  test('complete status update', () => {
    Tasks.myTasksView(elementToAdd, createList);
    Tasks.addTask(elementToAdd);
    const checkbox = document.querySelector('input');
    checkbox.checked = true;
    Tasks.completedTaskStored(checkbox);
    expect((Tasks.getFromLocalStore())[0].completed).toBe(true);
  });
  test('clear all completed tasks at once by click', () => {
    Tasks.myTasksView(elementToAdd, createList);
    Tasks.addTask(elementToAdd);
    const checkbox = document.querySelector('input');
    checkbox.checked = true;
    Tasks.completedTaskStored(checkbox);
    const childcount = createList.childElementCount;
    Tasks.clearAllCompletedTasks();
    expect(createList.childElementCount).toBeLessThan(childcount);
  });
});