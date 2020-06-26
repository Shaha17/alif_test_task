'use strict';

const contacts = [];
let nextId = 1;

function Contact(id, name, surname, phoneNumbers, emails) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.phoneNumbers = phoneNumbers;
    this.emails = emails;
    this.tags = []
        .concat(name, surname, phoneNumbers, emails)
        .map(o => o.toLowerCase());
}

function makeContactEl(contact) {
    const contactItemDiv = document.createElement('div');
    contactItemDiv.dataset.type = 'contact-item';
    contactItemDiv.id = contact.id;
    contactItemDiv.textContent = `${contact.name} ${contact.surname}`;

    contactItemDiv.onclick = evt => {
        evt.preventDefault();
        if (contactAddForm.parentElement) {
            contactView.replaceChild(contactEditForm, contactAddForm);
        }
        removeChilds(phoneNumberEditListEl);
        removeChilds(emailEditListEl);

        contactEditForm.id = Number(evt.currentTarget.id);
        nameEditInputEl.value = contact.name;
        surnameEditInputEl.value = contact.surname;

        contact.phoneNumbers.forEach(num =>
            renderPhoneInput(phoneNumberEditListEl, num)
        );
        contact.emails.forEach(email =>
            renderPhoneInput(emailEditListEl, email)
        );
    };

    return contactItemDiv;
}

function removeChilds(elementToDelChilds) {
    Array.from(elementToDelChilds.children).forEach(o =>
        elementToDelChilds.removeChild(o)
    );
}

function renderContacts(contactsListEl, contactsArr) {
    removeChilds(contactsListEl);
    contactsArr.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    });
    contactsArr.map(makeContactEl).forEach(o => contactsListEl.appendChild(o));
}

function inputCheck(inputElement) {
    const input = inputElement.value.trim();
    messageEl.textContent = '';
    if (input === '') {
        messageEl.textContent = `Заполните поле ${inputElement.placeholder}`;
        inputElement.focus();
        return;
    }
    return input;
}

function renderPhoneInput(parentElement, phoneNumber) {
    const numberDivEl = document.createElement('div');
    parentElement.appendChild(numberDivEl);

    const phoneInputEl = document.createElement('input');
    phoneInputEl.type = 'tel';
    phoneInputEl.placeholder = 'Телефон';
    if (phoneNumber) {
        phoneInputEl.value = phoneNumber;
    }
    phoneInputEl.style.width = '200px';
    numberDivEl.appendChild(phoneInputEl);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить номер';
    numberDivEl.appendChild(delBtn);
    delBtn.onclick = evt => {
        evt.preventDefault();
        parentElement.removeChild(numberDivEl);
    };
}
function renderEmailInput(parentElement, emailAdress) {
    const emailDivEl = document.createElement('div');
    parentElement.appendChild(emailDivEl);

    const emailInputEl = document.createElement('input');
    emailInputEl.type = 'email';
    emailInputEl.placeholder = 'Email';
    if (emailAdress) {
        emailInputEl.value = emailAdress;
    }
    emailInputEl.style.width = '200px';
    emailDivEl.appendChild(emailInputEl);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить email';
    emailDivEl.appendChild(delBtn);
    delBtn.onclick = () => {
        parentElement.removeChild(emailDivEl);
    };
}

const contactList = document.getElementById('contact-list');

const searchInputEl = document.createElement('input');
searchInputEl.placeholder = 'Поиск';
searchInputEl.style.width = '170px';
contactList.appendChild(searchInputEl);

const addNewContactBtn = document.createElement('button');
addNewContactBtn.textContent = 'Добавить новый контакт';
contactList.appendChild(addNewContactBtn);
addNewContactBtn.onclick = evt => {
    evt.preventDefault();
    if (!contactAddForm.parentElement) {
        contactView.replaceChild(contactAddForm, contactEditForm);
    }
    contactAddForm.reset();
    removeChilds(phoneNumberListEl);
    removeChilds(emailListEl);

    renderPhoneInput(phoneNumberListEl);
    renderEmailInput(emailListEl);

    messageEl.textContent = '';
};

const searchResultEl = document.createElement('div');
contactList.appendChild(searchResultEl);

searchInputEl.oninput = () => {
    const searchRequest = searchInputEl.value.trim().toLowerCase();
    if (searchRequest === '') {
        renderContacts(searchResultEl, contacts);
        return;
    }
    const searchResContacts = contacts.filter(item =>
        item.tags.some(o => o.includes(searchRequest))
    );

    renderContacts(searchResultEl, searchResContacts);
};

///
const contactView = document.getElementById('contact-view');

const contactAddForm = document.createElement('form');
contactAddForm.dataset.id = 'contact-form';
contactView.appendChild(contactAddForm);

const nameInputEl = document.createElement('input');
nameInputEl.placeholder = 'Имя';
contactAddForm.appendChild(nameInputEl);

const surnameInputEl = document.createElement('input');
surnameInputEl.placeholder = 'Фамилия';
contactAddForm.appendChild(surnameInputEl);

const phoneNumberListEl = document.createElement('div');
phoneNumberListEl.dataset.id = 'phone-numbers';
contactAddForm.appendChild(phoneNumberListEl);

const addPhoneNumberBtn = document.createElement('button');
addPhoneNumberBtn.textContent = 'Добавить номер телефона';
addPhoneNumberBtn.onclick = evt => {
    evt.preventDefault();
    renderPhoneInput(phoneNumberListEl);
};
contactAddForm.appendChild(addPhoneNumberBtn);

const emailListEl = document.createElement('div');
emailListEl.dataset.id = 'email';
contactAddForm.appendChild(emailListEl);

const addEmailBtn = document.createElement('button');
addEmailBtn.textContent = 'Добавить email адресс';
addEmailBtn.style.marginRight = '200px';
addEmailBtn.onclick = evt => {
    evt.preventDefault();
    renderEmailInput(emailListEl);
};
contactAddForm.appendChild(addEmailBtn);

renderPhoneInput(phoneNumberListEl);
renderEmailInput(emailListEl);

const messageEl = document.createElement('div');
messageEl.textContent = '';
contactView.insertBefore(messageEl, contactView.firstElementChild);

const addBtn = document.createElement('button');
addBtn.textContent = 'Сохранить контакт';
contactAddForm.appendChild(addBtn);

addBtn.onclick = evt => {
    evt.preventDefault();

    const name = inputCheck(nameInputEl);
    if (!name) {
        return;
    }
    const surname = surnameInputEl.value.trim();

    const numbers = [];
    const numberNodes = phoneNumberListEl.querySelectorAll('[type="tel"]');
    for (const node of numberNodes) {
        const num = inputCheck(node);
        if (!num) {
            return;
        }
        numbers.push(num);
    }

    const emails = [];
    const emailNodes = emailListEl.querySelectorAll('[type="email"]');
    for (const node of emailNodes) {
        const email = inputCheck(node);
        if (!email) {
            return;
        }
        emails.push(email);
    }
    contacts.push(new Contact(nextId++, name, surname, numbers, emails));
    searchInputEl.oninput();

    contactAddForm.reset();
    removeChilds(phoneNumberListEl);
    removeChilds(emailListEl);

    renderContacts(searchResultEl, contacts);

    renderPhoneInput(phoneNumberListEl);
    renderEmailInput(emailListEl);
};

const contactEditForm = document.createElement('form');
contactEditForm.dataset.id = 'contact-edit-form';

const nameEditInputEl = document.createElement('input');
nameEditInputEl.placeholder = 'Имя';
contactEditForm.appendChild(nameEditInputEl);

const surnameEditInputEl = document.createElement('input');
surnameEditInputEl.placeholder = 'Фамилия';
contactEditForm.appendChild(surnameEditInputEl);

const phoneNumberEditListEl = document.createElement('div');
phoneNumberEditListEl.dataset.id = 'phone-numbers';
contactEditForm.appendChild(phoneNumberEditListEl);

const addEditPhoneNumberBtn = document.createElement('button');
addEditPhoneNumberBtn.textContent = 'Добавить номер телефона';
addEditPhoneNumberBtn.onclick = evt => {
    evt.preventDefault();
    renderPhoneInput(phoneNumberEditListEl);
};
contactEditForm.appendChild(addEditPhoneNumberBtn);

const emailEditListEl = document.createElement('div');
emailEditListEl.dataset.id = 'email';
contactEditForm.appendChild(emailEditListEl);

const addEditEmailBtn = document.createElement('button');
addEditEmailBtn.textContent = 'Добавить email адресс';
addEditEmailBtn.style.marginRight = '200px';
addEditEmailBtn.onclick = evt => {
    evt.preventDefault();
    renderEmailInput(emailEditListEl);
};
contactEditForm.appendChild(addEditEmailBtn);

const saveEditBtn = document.createElement('button');
saveEditBtn.textContent = 'Сохранить изменения';
contactEditForm.appendChild(saveEditBtn);
saveEditBtn.onclick = evt => {
    evt.preventDefault();
    const contactId = contactEditForm.id;
    const contactIndex = contacts.findIndex(o => (o.id = contactId));

    const editedName = inputCheck(nameEditInputEl);
    if (!editedName) {
        return;
    }
    const editedSurname = surnameEditInputEl.value.trim();

    const editedNumbers = [];
    const editedNumberNodes = phoneNumberEditListEl.querySelectorAll(
        '[type="tel"]'
    );
    for (const node of editedNumberNodes) {
        const num = inputCheck(node);
        if (!num) {
            return;
        }
        editedNumbers.push(num);
    }

    const editedEmails = [];
    const editedEmailNodes = emailEditListEl.querySelectorAll('[type="email"]');
    for (const node of editedEmailNodes) {
        const email = inputCheck(node);
        if (!email) {
            return;
        }
        editedEmails.push(email);
    }
    console.log();
    contacts[contactIndex].name = editedName;
    contacts[contactIndex].surname = editedSurname;
    contacts[contactIndex].phoneNumbers = editedNumbers;
    contacts[contactIndex].emails = editedEmails;

    renderContacts(searchResultEl, contacts);
};

const cancelEditBtn = document.createElement('button');
cancelEditBtn.textContent = 'Отменить';
contactEditForm.appendChild(cancelEditBtn);
cancelEditBtn.onclick = evt => {
    evt.preventDefault();
    contactView.replaceChild(contactAddForm, contactEditForm);
    messageEl.textContent = '';
};

const deleteContactBtn = document.createElement('button');
deleteContactBtn.textContent = 'Удалить контакт';
contactEditForm.appendChild(deleteContactBtn);
deleteContactBtn.onclick = evt => {
    evt.preventDefault();
    contactView.replaceChild(contactAddForm, contactEditForm);
    const idToDelete = contactEditForm.id;

    const indexToDelete = contacts.findIndex(o => (o.id = idToDelete));
    contacts.splice(indexToDelete, 1);

    searchInputEl.oninput();
};
