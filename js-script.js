// get data from server
const getResours = async () => {
    const res = await fetch('https://itrex-react-lab-files.s3.eu-central-1.amazonaws.com/react-test-api.json');

    return res.json();
}
let data = []


const generationPosts = async () => {
    const data = await getResours();
    //allData = await getResours();

    filterDefaultByName(data);

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
                        <tr class='post' data-id="${post.id}" data-num="${post.firstName}">
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

    const pagination = document.querySelector('#pagination');
    const numPost = 20;
    const countPage = Math.ceil(data.length / numPost);
    const items = [];

    for (let i = 1; i <= countPage; i++) {
        let a = document.createElement('a');
        a.innerHTML = i;
        pagination.appendChild(a);
        items.push(a);
    };
    showPage(items[0]);

    items.forEach(el => el.addEventListener('click', function () {
        showPage(el);
    }));

    // generation discription
    const generatDiscriptionPost = async (arg, arg2) => {

        const description = document.querySelector('#description');
        description.innerHTML = "";

        data.forEach((post) => {
            if (post.id == arg2 && post.firstName == arg) {

                description.innerHTML += `
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

    const getId = async (event) => {
        event.preventDefault();
        const description = document.querySelector('#description');
        let profileNum;
        let profileId = 0;

        if (event.target.parentElement.classList.contains('post')) {
            profileNum = event.target.parentElement.dataset.num;
        };

        if (event.target.parentElement.classList.contains('post')) {
            profileId = event.target.parentElement.dataset.id;
        };

        if (event.target.tagName === 'TD') {
            description.classList.add('style')
        } else { description.classList.remove('style') }

        generatDiscriptionPost(profileNum, profileId);

    }
    document.addEventListener('click', getId);


    // select
    const selectFunc = async () => {

        const option = document.querySelector('.select').value;
        const filterTasks = data.filter((task) => {
            if (task.adress.state === option) {
                return task.adress.state;
            };
        })
        console.log(filterTasks)
        filterTasks.forEach(e => {

            table.innerHTML = `
                <tr>
                <th id="id1">id</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>State</th>
                </tr>
            `
            filterTasks.forEach((post) => {
                table.innerHTML += `
                <tr class='post' data-id="${post.id}" data-num="${post.firstName}">
                    <td>${post.id}</td>
                    <td>${post.firstName}</td>
                    <td>${post.lastName}</td>
                    <td>${post.email}</td>
                    <td>${post.phone}</td>
                    <td>${post.adress.state}</td>
                </tr>
        `
            });
        })
        console.log(filterTasks)

        filterByName(filterTasks)
    }

    document.querySelector('.select').addEventListener('change', selectFunc);


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
}

function filterByName(filterTasks) {

    document.querySelector(".search-input").addEventListener('input', (event) => {

        const searchValue = event.target.value.toLowerCase().trim();

        let searsh = [];
        const table = document.querySelector('#table');
        if (event.target.value && event.target.value !== '') {
            searsh = [...filterTasks].filter(i => {

                return i.firstName.toLowerCase().includes(searchValue)
            })

            searsh.forEach(e => {
                table.innerHTML = `
            <tr>
                <th id="id1">id</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>State</th>
            </tr>
        `
                searsh.forEach((post) => {
                    table.innerHTML += `
                    <tr class='post' data-id="${post.id}" data-num="${post.firstName}">
                        <td>${post.id}</td>
                        <td>${post.firstName}</td>
                        <td>${post.lastName}</td>
                        <td>${post.email}</td>
                        <td>${post.phone}</td>
                        <td>${post.adress.state}</td>
                    </tr>
            `
                });
            })

        }

    })
}

function filterDefaultByName(filterTasks) {
    document.querySelector(".search-input").addEventListener('input', (event) => {
        let currentData = filterTasks;
        const table = document.querySelector('#table');
        table.innerHTML = '';

        const searchValue = event.target.value.toLowerCase().trim();
        currentData = filterTasks.filter(i => {
            return i.firstName.toLowerCase().includes(searchValue)
        })

        currentData.forEach((post) => {
            table.innerHTML += `
                    <tr class='post' data-id="${post.id}" data-num="${post.firstName}">
                        <td>${post.id}</td>
                        <td>${post.firstName}</td>
                        <td>${post.lastName}</td>
                        <td>${post.email}</td>
                        <td>${post.phone}</td>
                        <td>${post.adress.state}</td>
                    </tr>
            `
        });

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
                let posts = currentData.slice(start, end);

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
                        <tr class='post' data-id="${post.id}" data-num="${post.firstName}">
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


        const pagination = document.querySelector('#pagination');
        const numPost = 20;
        const countPage = Math.ceil(currentData.length / numPost);
        const items = [];

        pagination.innerHTML = '';

        for (let i = 1; i <= countPage; i++) {
            let a = document.createElement('a');
            a.innerHTML = i;
            pagination.appendChild(a);
            items.push(a);
        };
        showPage(items[0]);

        items.forEach(el => el.addEventListener('click', function () {
            showPage(el);
        }));
    })
}

generationPosts();


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
