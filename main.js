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
  editor(); // Reattach event listeners to edit buttons
}

function deleter() {
  let deleteBtn = document.querySelectorAll('.delete');
  for (let item of deleteBtn) {
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

function editor() {
  let editBtn2 = document.querySelectorAll('.edit');
  let modal = document.querySelector('.modal');
  let elemId = [];
  
  for (let item of editBtn2) {
    item.onclick = async (e) => {
      e.preventDefault();
      modal.style.display = 'flex';

      let parentId = item.parentNode.id;
      elemId.push(parentId);
      
      let userDetails = await axios.get(`${URL}/${parentId}`);
      let data = userDetails.data;

      document.querySelector('.modalName').value = data.name;
      document.querySelector('.modalAge').value = 2024 - data.age; // Pre-fill modal inputs
      
      // Attach submit event listener
      let addingModal = document.forms.adding;
      addingModal.onsubmit = async (e) => {
        e.preventDefault();
        let user = {};
        let fm = new FormData(addingModal);
        fm.forEach((value, key) => {
          user[key] = value;
        });
        
        data.name = user.name;
        data.age = 2024 - user.age;
        
        await axios.patch(`${URL}/${parentId}`, data);
        let updatedTaskList = await axios.get(URL);
        reload(updatedTaskList);
        modal.style.display = 'none';
        elemId = []; // Reset elemId array
      };
    };
  }
}

let close = document.querySelector('.close');
close.onclick = () => {
  document.querySelector('.modal').style.display = 'none';
};

editor();