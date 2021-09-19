// get data from server
const getResours = async () => {
    const res = await fetch('https://itrex-react-lab-files.s3.eu-central-1.amazonaws.com/react-test-api.json');

    return res.json();
}


const generationPosts = async () => {
    const data = await getResours();
    const pagination = document.querySelector('#pagination');

    const numPost = 20;
    const countPage = Math.ceil(data.length / numPost);
    const items = [];

    let showPage = (function () {
        let active;
        const table = document.querySelector('#table');
        return function (item) {

            if (active) {
                active.classList.remove('active');
            }
            active = item;
            item.classList.add('active');

            let pageNum = Number(item.innerHTML);
            let start = (pageNum - 1) * numPost;
            let end = start + numPost;
            let posts = data.slice(start, end);

            table.innerHTML = `
                <tr>
                    <th id="id1">id</th>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>State</th>
                </tr>
            `;
            posts.forEach((post) => {
                table.innerHTML += `
                        <tr class='post' data-id="${post.id}">
                            <td>${post.id}</td>
                            <td>${post.firstName}</td>
                            <td>${post.lastName}</td>
                            <td>${post.email}</td>
                            <td>${post.phone}</td>
                            <td>${post.adress.state}</td>
                        </tr>
                `
            });
        };
    }());

    for (let i = 1; i <= countPage; i++) {
        let a = document.createElement('a');
        a.innerHTML = i;
        pagination.appendChild(a);
        items.push(a);
    };
    showPage(items[0]);

    items.forEach(el => el.addEventListener('click', function () {
        showPage(el);
    }))

}
generationPosts();


//getting date-id, add class 
const getId = (event) => {
    event.preventDefault();
    const description = document.querySelector('#description');
    let profileId = 0;

    if (event.target.parentElement.classList.contains('post')) {
        profileId = event.target.parentElement.dataset.id;
    };

    if (event.target.tagName === 'TD') {
        description.classList.add('hide', 'style');
    } else {
        description.classList.remove('hide', 'style');
    };

    generatDiscriptionPost(profileId);

}
document.addEventListener('click', getId);

//get data from the server and write to the description
const generatDiscriptionPost = async (arg) => {
    const data = await getResours();
    const descript = document.querySelector('#description');
    descript.innerHTML = "";
    data.forEach((post, index) => {
        if (post.id == arg) {
            descript.innerHTML += `
            <p>Profile info: </p>
            <p>Selected profile: ${post.firstName} ${post.lastName}</p>
            <p>Discription: ${post.description}</p>
            <p>Address: ${post.adress.streetAddress}</p>
            <p>City: ${post.adress.city}</p>
            <p>State: ${post.adress.state}</p>
            <p>Index: ${post.adress.zip}</p>
        `
        };
    });
};

// table search
const displaySearchTasks = async (allTasks) => {
    const searchTasks = document.querySelector('#table');
    searchTasks.innerHTML = `
        <tr>
            <th id="id1">id</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>State</th>
        </tr>
      `;
    allTasks.forEach((post) => {
        searchTasks.innerHTML += `
            <tr class='post' data-id="${post.id}">
                <td>${post.id}</td>
                <td>${post.firstName}</td>
                <td>${post.lastName}</td>
                <td>${post.email}</td>
                <td>${post.phone}</td>
                <td>${post.adress.state}</td>
            </tr>
      `
    })
}

const inputSearchTasks = async (event) => {
    const searchValue = event.target.value.toLowerCase().trim();
    const allTasks = await getResours();

    const filterTasks = allTasks.filter((task) => {
        if (task.firstName[0].toLowerCase().trim() === searchValue[0] || searchValue === "") {
            return task.firstName.toLowerCase().includes(searchValue)
        };
    });

    displaySearchTasks(filterTasks);
};


// input search
if (document.querySelector(".search-input")) {
    document.querySelector(".search-input").addEventListener("input", inputSearchTasks);
};


// select
const selectFunc = async () => {
    const option = document.querySelector('.select').value;
    const allTasks = await getResours();

    const filterTasks = allTasks.filter((task) => {
        if (task.adress.state === option) {
            return task.adress.state;
        };
    });

    displaySearchTasks(filterTasks);

}
document.querySelector('.select').addEventListener('change', selectFunc);

// sort table
const sortTable = (index) => {
    let i, x, y, shouldSwitch, switchcount = 0;
    const table = document.querySelector("#table");
    let switching = true;
    let dir = "asc";

    while (switching) {
        switching = false;
        const rows = table.querySelectorAll("tr");

        for (i = 1; i < (rows.length - 1); i++) {

            shouldSwitch = false;

            x = rows[i].querySelectorAll("td")[index];
            y = rows[i + 1].querySelectorAll("td")[index];

            if (index === 0 && dir == "asc") {
                if (Number(x.innerHTML) > Number(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {

            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;

            switchcount++;
        } else {

            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


document.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.tagName === 'TH') {

        const order = (event.target.dataset.order = -(event.target.dataset.order || -1));

        const index = [...event.target.parentNode.cells].indexOf(event.target);

        for (const cell of event.target.parentNode.cells) {
            cell.classList.toggle('sorted', cell === event.target);
        };

        sortTable(index);
    }
})
