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

test("Add exactly one 'li' element", () => {
  expect(createList.childElementCount).toBe(1);
});

Tasks.addTask(elementToAdd);
describe('Test remove an add methods in Build class', () => {
  test('Add elements properties to LocalStorage', () => {
    expect(Tasks.getFromLocalStore()[0].task).toBe('Graduate from Microverse');
  });
  test('Remove element from DOM and from LocalStorage', () => {
    const target = document.getElementById('1 trash');
    const childcount = createList.childElementCount;
    Tasks.deleteTask(target, 0);
    expect(createList.childElementCount).toBeLessThan(childcount);
  });
  test('Remove element from DOM and from LocalStorage', () => {
    expect(Tasks.getFromLocalStore()).toBeDefined();
  });
});