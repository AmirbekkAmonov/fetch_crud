const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

const form = document.getElementById('form');
const userTable = document.getElementById('tbody');
const isLoading = document.getElementById('table-loading');
let selectedId;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoading(true);
    const newUser = {
        id: Date.now(),
        name: form.name.value,
        email: form.email.value,
        age: form.age.value,
    };

    if (selectedId) {
        const res = await fetch(`http://localhost:3000/users/${selectedId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
        if (res.ok) {
            Toastify({
                text: "Foydalanuvchi muovaffaqiyatli tahrirlandi",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                background: "linear-gradient(to right, #00b09b, #96c93d)"
            }).showToast();
            form.reset();
            const data = await getUsers();
            renderUsers(data);
            setLoading(false);
        } else {
            Toastify({
                text: "Xatolik yuz berdi",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                background: "linear-gradient(to right, #00b09b, #96c93d)"
            }).showToast();
            setLoading(false);
        }
    } else {
        const res = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
        if (res.ok) {
            Toastify({
                text: "Foydalanuvchi muovaffaqiyatli qo'shildi",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                background: "linear-gradient(to right, #00b09b, #96c93d)"
            }).showToast();
            form.reset();      
            const data = await getUsers();
            renderUsers(data);
            setLoading(false);
        } else {
            Toastify({
                text: "Xatolik yuz berdi",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                background: "linear-gradient(to right, #00b09b, #96c93d)"
            }).showToast();
            setLoading(false);
        }

    }
});

async function getUsers() {
    setLoading(true)
    const res = await fetch('http://localhost:3000/users');
    const data = await res.json();

    if (res.status !== 200 || res.ok !== true) {
        throw new Error("Xatolik yuz berdi");
    }

    return data;
}
getUsers()
    .then((data) => {
        renderUsers(data);
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        setLoading(false);
    });

function renderUsers(users) {
    userTable.innerHTML = '';
    if (users.length) {
        users.map((user) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.age}</td>            
            <td>
                <button class="edit" onclick='editUser(${JSON.stringify(user)})' ><span>Edit</span><img src="./icons/edit.png" alt=""></button>
                <button class="delete" onclick='deleteUser(${user.id})'><span>Delete</span><img src="./icons/delete.png" alt=""></button>
            </td>
        `;
        userTable.appendChild(tr);
        });
    }
}


function editUser(user) {
    selectedId = user.id;
    form.name.value = user.name;
    form.email.value = user.email;
    form.age.value = user.age;
}

async function deleteUser(id) {
    try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            Toastify({
                text: "Foydalanuvchi muovaffaqiyatli o'chirildi",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                background: "linear-gradient(to right, #00b09b, #96c93d)"
            }).showToast();
            setLoading(false);
            const data = await getUsers();
            renderUsers(data);
        } else {
            throw new Error("Xatolik yuz berdi");
        }
    } catch (error) {
        Toastify({
            text: `${error.message}`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            background: "linear-gradient(to right, #ff0000, #ff7f7f)"
        }).showToast();
    } finally {
        setLoading(false); 
    }
}


function setLoading(loading) {
    isLoading.style.display = loading ? 'flex' : 'none';
}

openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
