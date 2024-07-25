import '/style.css';
import axios from 'axios';

const URL = 'http://localhost:3000/users';
let taskList = await axios.get(URL);

function reload(data) {
  const tasks = data.data;
  let tbody = document.querySelector('.tbody');
  let rows = '';
  let i = 1;
  for (let item of tasks) {
    rows += `
      <tr class="${item.id}">
        <td>${i}</td>
        <td>${item.name}</td>
        <td>${2024 - item.age}</td>
        <td class="icons" id="${item.id}">
          <img class="edit" src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" width="25px" height="25px" alt="edit">
          <img class="delete" src="https://cdn4.iconfinder.com/data/icons/linecon/512/delete-512.png" width="25px" height="25px" alt="dustbin">
        </td>
      </tr>
    `;
    i++;
  }
  tbody.innerHTML = rows;
  
  deleter();
}

function deleter() {
  let editBtn = document.querySelectorAll('.delete');
  for (let item of editBtn) {
    item.onclick = async (e) => {
      e.preventDefault();

      let parentId = item.parentNode.id;

      await axios.delete(`${URL}/${parentId}`);

      let updatedTaskList = await axios.get(URL);
      reload(updatedTaskList);
    };
  }
}

reload(taskList);

const addTask = document.forms.add;
addTask.onsubmit = async (e) => {
  e.preventDefault();
  let user = {};
  let fm = new FormData(addTask);
  fm.forEach((value, key) => {
    user[key] = value;
  });
  var id = "id" + Math.random().toString(16).slice(2);
  user['id'] = id;
  await axios.post(URL, user);
  let updatedTaskList = await axios.get(URL);
  reload(updatedTaskList);
};