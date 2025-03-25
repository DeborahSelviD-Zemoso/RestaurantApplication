let tables = [];
let menu = [];
let selectedTable = {};

const dropIntoTable = (event) => {
    event.preventDefault();
    Promise.all([
        getId(event.dataTransfer.getData("text"), 4),
        getId(event.currentTarget.id, 5)
    ])
        .then((values) => addItemIntoTable(values[0], values[1]))
        .catch(error => console.error("Error:", error));
}

const allowDrop = (event) => {
    event.preventDefault();
}

const findTable = (tableId) => {
    return Promise.resolve(tables.find(table => table.id == tableId));
}

const displayTable = (tables) => {
    let tableContainer = document.getElementById("table-container");
    let tableList = document.createElement('ul');

    tables.forEach(table => {
        tableList.append(createTableItem(table));
    })
    tableContainer.append(tableList);
}

const clearTable = () => {
    let tableContainer = document.getElementById("table-container");
    let tableListElement = tableContainer.getElementsByTagName("ul");
    tableListElement[0].remove();
    return Promise.resolve(true);
}

const addItemIntoTable = async (menuId, tableId) => {
    findTable(tableId).then(table => {
        let selectedItem = table.items.find(item => item.id == menuId);
        if (selectedItem) {
            selectedItem.count += 1;
            table.totolPrice += Number(selectedItem.price);
        } else {
            let selectedMenu = menu.find(menu => menu.id == menuId);
            let selectedItem = JSON.parse(JSON.stringify(selectedMenu));
            selectedItem.count = 1;
            table.items.push(selectedItem);
            table.totalItems += 1;
            table.totolPrice += Number(selectedItem.price);
        }

        clearTable()
            .then(clear => displayTable(tables));
    });

}

const getId = (data, startIndex) => {
    return Promise.resolve(data.substring(startIndex, data.length));
}

const deleteItem = (index) => {
    selectedTable.totolPrice -= selectedTable.items[index].price;
    selectedTable.items.splice(index, 1);
    let tableElement = document.getElementById('order-table');
    tableElement.textContent = "";
    selectedTable.items.forEach((item, i) => {
        tableElement.append(createOrderData(item, i + 1));
    });
}

const calculateTotalPrice = (table) => {
    return new Promise ((resolve) => {
        let sum = Number(0);
        table.items.forEach(item => {
            sum = Number(sum) + Number(item.count) * Number(item.price);
        });
        resolve(sum);
    });   

}

const setTotalPrice = (totalPrice) => {
    let totalElement = document.getElementById("total");
    totalElement.textContent = `Total: ${totalPrice}`;
}


const incrementCount = (event, item) => {
    item.count = event.currentTarget.value;
    calculateTotalPrice(selectedTable)
    .then(sum => {
        selectedTable.totalPrice = sum;
        setTotalPrice(sum);
    });
}

const createOrderData = (item, index) => {
    let tableRow = document.createElement('tr');
    let indexColumnData = document.createElement('td');
    indexColumnData.textContent = index;
    tableRow.append(indexColumnData);
    let nameColumnData = document.createElement('td');
    nameColumnData.textContent = item.name;
    tableRow.append(nameColumnData);
    let priceColumnData = document.createElement('td');
    priceColumnData.textContent = item.price;
    tableRow.append(priceColumnData);
    let countColumnData = document.createElement('td');
    let countInput = document.createElement('input');
    countInput.type = "number";
    countInput.value = item.count;
    countInput.addEventListener("input", (event) => incrementCount(event, item))
    countColumnData.append(countInput);
    tableRow.append(countColumnData);
    let deleteData = document.createElement('td');
    let deleteIcon = document.createElement('i');
    deleteIcon.className = "material-icons";
    deleteIcon.textContent = "delete";
    deleteIcon.addEventListener("click", () => deleteItem(index - 1));
    deleteData.append(deleteIcon);
    tableRow.append(deleteData);
    return tableRow;
}

const showOrderDetails = (event) => {
    console.log(event.currentTarget.id);
    let orderDetailsElement = document.getElementById('order-details-wrapper');
    orderDetailsElement.style.display = "block";
    getId(event.currentTarget.id, 5)
        .then(tableId => findTable(tableId))
        .then(table => {
            selectedTable = table;
            let title = document.getElementById('order-title');
            title.textContent = `${table.name} | Order Details`;
            let tableElement = document.getElementById('order-table');
            tableElement.textContent = "";
            table.items.forEach((item, index) => {
                tableElement.append(createOrderData(item, index + 1));
            });
        })
        .then(table => calculateTotalPrice(selectedTable))
        .then(sum => {
            selectedTable.totalPrice = sum;
            setTotalPrice(sum);
        });
}

const createTableItem = (table) => {
    let listItem = document.createElement('li');
    listItem.setAttribute("id", `table${table.id}`);
    let nameElement = document.createElement('div');
    nameElement.textContent = table.name;
    nameElement.className = 'table-name';
    listItem.append(nameElement);
    let priceElement = document.createElement('div');
    priceElement.textContent = `Rs.${table.totolPrice} | Total items: ${table.totalItems}`;
    listItem.append(priceElement);
    listItem.addEventListener("drop", dropIntoTable);
    listItem.addEventListener("dragover", allowDrop);
    listItem.addEventListener("click", showOrderDetails);
    return listItem;
}

const dragMenu = (event) => {
    console.log(event.target.id);
    event.dataTransfer.setData("text", event.target.id);
}

const createItem = (id, name, price) => {
    let listItem = document.createElement('li');
    listItem.setAttribute("id", `menu${id}`);
    let nameElement = document.createElement('div');
    nameElement.textContent = name;
    nameElement.className = 'name-container';
    listItem.append(nameElement);
    let priceElement = document.createElement('div');
    priceElement.textContent = price;
    listItem.append(priceElement);
    listItem.setAttribute("draggable", "true");
    listItem.addEventListener("dragstart", dragMenu);
    return listItem;
}
const load = () => {
    tables = [
        {
            "id": 1,
            "name": "Table 1",
            "totolPrice": 0,
            "totalItems": 0,
            "items": []
        },
        {
            "id": 2,
            "name": "Table 2",
            "totolPrice": 0,
            "totalItems": 0,
            "items": []
        },
        {
            "id": 3,
            "name": "Table 3",
            "totolPrice": 0,
            "totalItems": 0,
            "items": []
        }
    ]


    displayTable(tables);


    menu = [
        {
            "id": 1,
            "name": "Bruschetta",
            "description": "Toasted bread topped with tomatoes, garlic, basil, and olive oil.",
            "price": 8.99,
            "course_type": "appetizer"
        },
        {
            "id": 2,
            "name": "Stuffed Mushrooms",
            "description": "Mushrooms filled with cream cheese, garlic, and herbs.",
            "price": 10.99,
            "course_type": "appetizer"
        },
        {
            "id": 3,
            "name": "Grilled Chicken Breast",
            "description": "Boneless chicken breast grilled to perfection, served with roasted vegetables.",
            "price": 18.99,
            "course_type": "main_course"
        },
        {
            "id": 4,
            "name": "Spaghetti Bolognese",
            "description": "Classic pasta with a rich beef and tomato sauce.",
            "price": 15.99,
            "course_type": "main_course"
        },
        {
            "id": 5,
            "name": "Vegetarian Lasagna",
            "description": "Layers of pasta, ricotta cheese, and tomato sauce with vegetables.",
            "price": 14.99,
            "course_type": "main_course"
        },
        {
            "id": 6,
            "name": "Garlic Mashed Potatoes",
            "description": "Creamy mashed potatoes with a hint of garlic.",
            "price": 4.99,
            "course_type": "side_dish"
        },
        {
            "id": 7,
            "name": "Caesar Salad",
            "description": "Fresh romaine lettuce, croutons, and Caesar dressing.",
            "price": 5.99,
            "course_type": "side_dish"
        },
        {
            "id": 8,
            "name": "Tiramisu",
            "description": "Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cheese.",
            "price": 6.99,
            "course_type": "dessert"
        },
        {
            "id": 9,
            "name": "Chocolate Lava Cake",
            "description": "Warm chocolate cake with a gooey center, served with vanilla ice cream.",
            "price": 7.99,
            "course_type": "dessert"
        },
        {
            "id": 10,
            "name": "House Red Wine",
            "description": "A smooth and rich red wine from California.",
            "price": 9.99,
            "course_type": "beverage"
        },
        {
            "id": 11,
            "name": "Lemonade",
            "description": "Freshly squeezed lemonade, served chilled.",
            "price": 3.99,
            "course_type": "beverage"
        }
    ]

    let menuContainer = document.getElementById("menu-container");
    let list = document.createElement('ul');

    menu.forEach(item => {
        list.append(createItem(item.id, item.name, item.price));
    });
    menuContainer.append(list);
}

const closeOrderDetails = () => {
    let orderDetailsElement = document.getElementById('order-details-wrapper');
    orderDetailsElement.style.display = "none";
    clearTable()
        .then(clear => displayTable(tables));
}