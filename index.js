const getModulesURL = "http://127.0.0.1:8000/modules/";
const postOrderURL = "http://127.0.0.1:8000/orders/";

//Fetched from the server or, if it's down, from ./testData.js
let formData;

const orderPageContainer = document.getElementById("orderPageContainer");
const confirmationPageContainer = document.getElementById("confirmationPageContainer");
const summaryPageContainer = document.getElementById("summaryPageContainer");

document.addEventListener("click", evt => {
    if (evt.target.nodeName === "button") {
        evt.preventDefault();
    }
    switch(evt.target.id) {
        case "resetBtn":
            resetCheckboxes();
            break;
        case "nextBtn":
            confirmationPageContainer.insertBefore(createConfirmationList(), confirmationPageContainer.children[1]);
            toggleHidden(orderPageContainer, confirmationPageContainer);
            break;
        case "backBtn":
            toggleHidden(orderPageContainer, confirmationPageContainer);
            orderList.innerHTML = "";
            break;
        case "submitBtn":
            toggleHidden(confirmationPageContainer, summaryPageContainer);
            makePost();
            break;
    }
});

(function init() {
    formData = fetchData() || testData;
    if (orderPageContainer) {
        orderPageContainer.insertBefore(createOrderForm(), orderPageContainer.children[2]);
    }
})();

function fetchData() {
    fetch(getModulesURL)
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error('Error:', err);
        });
}

/*
<div id="modulesList">
        {createModuleWithSubmodulesItem}
        ...
</div>
*/
function createOrderForm() {
    const modulesList = document.createElement("div");
    modulesList.id = "modulesList";
    formData.forEach(module => {
                        const moduleItem = createModuleWithSubmodulesItem(module);
                        modulesList.appendChild(moduleItem);
                    });
    return modulesList;
}

/*
<div class="modulesDiv">
    {createLabel()}
    <p class="submodules">Submodules of {module name}</p>
    {createLabel()}
    ...
</div>
*/
function createModuleWithSubmodulesItem(module) {
    const modulesDiv = document.createElement("div");
    modulesDiv.appendChild(createLabel(module));
    modulesDiv.className = "modulesDiv";
    if (module.submodules && module.submodules.length != 0) {
        const submodulesParagraph = createElementWithText("p", `Submodules of ${module.name}`);
        submodulesParagraph.classList.add("submodules");
        modulesDiv.appendChild(submodulesParagraph);
        module.submodules.forEach(submodule => modulesDiv.appendChild(createLabel(submodule)));
    }
    return modulesDiv;
}

/*
<label class="modules || submodules"
    {module name}
    <input type="checkbox" id={module id} value={module name}>
</label>
*/
function createLabel(module) {
    const checkbox = document.createElement("input");
    const label = createElementWithText("label", module.name);
    
    checkbox.type = "checkbox";
    checkbox.id = module.id;
    checkbox.value = module.name;
    
    label.className = module.submodules ? "modules" : "submodules";
    label.appendChild(checkbox);

    return label;
}

/*
<ul id="orderList">
    <h3>{section header}
    <li>{element with text}</li>
    ...
</ul>
*/
function createConfirmationList() {
    const orderList = document.createElement("ul");
    orderList.id = "orderList";
    const itemsByType = getCheckedCheckboxes("value");
    for (key in itemsByType) {
        const sectionHeader = createElementWithText("h3", key[0].toUpperCase() + key.slice(1));
        orderList.append(sectionHeader);
        itemsByType[key].forEach(item => {
            const li = createElementWithText("li", item);
            orderList.appendChild(li);
        });
    }
    return orderList;
}

/*
<{el}>
    {txt}
</{el}>
*/
function createElementWithText(el, txt) {
    const textNode = document.createTextNode(txt);
    const element = document.createElement(el);
    element.appendChild(textNode);
    return element;
}

/*
{
    modules: [{module value} || {module id}],
    submodules: [{module value} || {module id}]
}
*/
function getCheckedCheckboxes(content) {
    return Array.from(document.querySelectorAll("input[type=checkbox]"))
        .filter(item => item.checked)
        .reduce((acc, item) => {
            const moduleType = item.parentElement.className;
            const val = content === "id" ? Number(item[content]) : item[content];
            acc[moduleType].push(val);
            return acc;
        }, {modules: [], submodules: []});
}

function toggleHidden(...elements) {
    if (elements.length > 0) {
        elements.forEach(item => item.classList.toggle("hidden"));
    }
}

function resetCheckboxes() {
    document.querySelectorAll("input[type=\"checkbox\"").forEach(item => {
        item.checked = false;
    });
}

function makePost() {
    console.log(JSON.stringify(getCheckedCheckboxes("id")));
    fetch(postOrderURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(getCheckedCheckboxes("id"))
    })
    .then(res => res.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(err => {
        console.error('Error:', err);
    });
}