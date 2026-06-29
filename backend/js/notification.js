
function fetchNotifications() {
  const studentId = localStorage.getItem('student_id');
  if (!studentId) {
    alert("لم يتم العثور على معرف الطالب في التخزين المحلي");
    return;
  }

  axios.get(`http://127.0.0.1:8000/api/notifications?student_id=${studentId}`)
    .then(response => {
      console.log(response.data)
      if (Array.isArray(response.data)) {
        localStorage.setItem('cachedNotifications', JSON.stringify(response.data));
        displayNotifications(response.data);
      } else {
        loadFromLocalStorage();
      }
    })
    .catch(() => {
      loadFromLocalStorage();
    });
}

function loadFromLocalStorage() {
  const cached = JSON.parse(localStorage.getItem('cachedNotifications')) || [];
  displayNotifications(cached);
}

function displayNotifications(notifications) {
  const side2 = document.querySelector('.side2');
  side2.querySelectorAll('.text').forEach(e => e.remove());
  notifications.forEach(notification => {
    console.log(notification.notification_id);
    const div = document.createElement('div');
    div.className = 'text';
    div.setAttribute('data-category', notification.title || 'غير مصنف');
    div.setAttribute('data-id', notification.notification_id);

    div.innerHTML = `
      <input type="checkbox">
      <i class="fa-regular fa-star ${notification.is_favorite ? 'saved' : ''}"></i>
      <span class="content">${notification.message || ''}</span>
      <span class="time">${new Date(notification.notification_date).toLocaleString()}</span>
    `;
    console.log(div)
    side2.appendChild(div);
  });
  const countEl = document.querySelector('.counter .count');
  if (countEl) {
    countEl.textContent = notifications.length;
      countEl.style.display = notifications.length === 0 ? 'none' : 'inline-block';

  }


  rebindActions();
}

function setupCategoryFilter() {
  const filterButtons = document.querySelectorAll('.btn button');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const category = this.textContent.trim();
      document.querySelectorAll('.side2 .text').forEach(message => {
        if (category === 'الجميع') {
          message.style.display = '';
        } else {
          const messageCategory = message.getAttribute('data-category');
          message.style.display = messageCategory === category ? '' : 'none';
        }
      });
    });
  });
}

function setupSearch() {
  const searchInput = document.querySelector('.search input');
  searchInput.addEventListener('input', function () {
    const filter = searchInput.value.toLowerCase();
    document.querySelectorAll('.side2 .text').forEach(message => {
      const content = message.querySelector('.content').textContent.toLowerCase();
      message.style.display = filter === '' || content.includes(filter) ? '' : 'none';
    });
  });
}

function setupDelete() {
  const deleteBtn = document.querySelector('.ico .fa-trash');
  deleteBtn.addEventListener('click', function () {
    const selectedIds = Array.from(document.querySelectorAll('.side2 .text'))
      .filter(msg => msg.querySelector("input[type='checkbox']")?.checked)
      .map(msg => msg.getAttribute('data-id'));

    const cached = JSON.parse(localStorage.getItem('cachedNotifications')) || [];
    const deleted = JSON.parse(localStorage.getItem('deletedNotifications')) || [];

    const toDelete = cached.filter(n => selectedIds.includes(String(n.notification_id)));

    const updatedDeleted = [...deleted, ...toDelete];
    localStorage.setItem('deletedNotifications', JSON.stringify(updatedDeleted));

    const remaining = cached.filter(n => !selectedIds.includes(String(n.notification_id)));
    localStorage.setItem('cachedNotifications', JSON.stringify(remaining));

    displayNotifications(remaining);
  });
}




function setupBookmark() {
  const bookmarkBtn = document.querySelector('.ico .fa-bookmark');
  bookmarkBtn.addEventListener('click', function () {
    let cached = JSON.parse(localStorage.getItem('cachedNotifications')) || [];

    document.querySelectorAll('.side2 .text').forEach(msg => {
      const checkbox = msg.querySelector("input[type='checkbox']");
      const id = msg.getAttribute('data-id');
      if (checkbox && checkbox.checked) {
        const item = cached.find(n => n.id == id);
        if (item) item.is_favorite = true;
      }
    });

    localStorage.setItem('cachedNotifications', JSON.stringify(cached));
    displayNotifications(cached);
    alert('تم حفظ الرسائل المحددة كمفضلة');
  });
}

function rebindActions() {
  setupCategoryFilter();
  setupSearch();
  setupDelete();
  setupBookmark();
}

document.addEventListener('DOMContentLoaded', function () {
  fetchNotifications();
  rebindActions();

});

const toggle = document.querySelector(".toggle");
const sidebar = document.querySelector(".sidebar");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

sidebar.addEventListener("click", (e) => {
  if (e.target === sidebar) {
    sidebar.classList.remove("active");
  }
});

function filterByType(type) {
  const cached = JSON.parse(localStorage.getItem('cachedNotifications')) || [];
  const deleted = JSON.parse(localStorage.getItem('deletedNotifications')) || [];

  let filtered = [];

  if (type === 'all') {
    filtered = cached;
  } else if (type === 'favorites') {
    filtered = cached.filter(n => n.is_favorite);
  } else if (type === 'archive') {
    filtered = deleted;
  } else if (type === 'sent') {
    filtered = cached.filter(n => n.type === 'sent');
  } else if (type === 'unknown') {
    filtered = cached.filter(n => !n.title);
  }

  displayNotifications(filtered);
}
