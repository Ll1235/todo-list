interface Task {
    id: string;
    text: string;
    state: 'pending' | 'complited';
}

let taskInput = document.querySelector('#task') as HTMLInputElement | null;
let buttonAdd = document.querySelector('#add') as HTMLButtonElement | null;
buttonAdd.disabled = true;
let taskItem = document.querySelectorAll('.task-item') as NodeListOf<HTMLLIElement>;

let inputEl = document.querySelector('#task') as HTMLInputElement;
inputEl.addEventListener('input', inputLength);

function inputLength() {
    if (inputEl.value.length) {
        buttonAdd.disabled = false;
    } else {
        buttonAdd.disabled = true;
    }
}

class TaskManager {
    private task: Task[] = [];
    private todoStatus: 'all' | 'pending' | 'complited' = 'all';
    private count: number = 0;

    constructor() {
        this.loadTask();
    }

    todoStatusCheck(): void {
        if (this.todoStatus === 'all') this.drawTusk();
        else if (this.todoStatus === 'pending') this.drawTuskPending();
        else this.drawTuskComplited();
    }

    loadTask(): void {
        let tasks = localStorage.getItem('task');
        if (tasks) {
            this.task = JSON.parse(tasks);
            this.count = this.task.length;
            this.drawTusk();
        }
    }

    addTask(): void {
        const text = taskInput.value.trim();
        this.count = this.count + 1;
        let answer = this.checkMaxLenghtTask();
        console.log(answer);
        if (answer === false) {

        } else {
            this.saveTusk(text, 'pending');
        }

    }

    saveTusk(text, status): Task {
        let key: string = this.getRandomId();
        let newTask: Task = { id: key, text: text, state: status };
        this.task.push(newTask);
        this.saveAllTask();
        return newTask;
    }

    saveAllTask(): void {
        localStorage.setItem('task', JSON.stringify(this.task));
        this.todoStatusCheck();
    }

    drawTusk(): void {
        this.clearTask();
        let taskList = document.querySelector('#task-list') as HTMLUListElement;
        this.todoStatus = 'all';

        if (this.task) {
            for (let i = 0; i < this.task.length; i++) {

                let status = (this.task[i]['state'] === 'complited') ? 'complited' : 'pending';
                let isChecked = this.task[i]['state'] === 'complited';

                taskList.insertAdjacentHTML('beforeend', `
                <li class="task-item relative flex justify-between items-center pt-[10px] pb-[10px] custom-list">
                        <div class="flex items-center gap-x-[10px]">
                            <input type="checkbox" class="task-checkbox w-[17px] h-[17px] 
                            accent-[#9A1750] shrink-0" ${isChecked ? 'checked' : ''} data-id="${this.task[i]['id']}">
                            <span class='${status}'>${this.task[i]['text']}</span>
                        </div>
                        <button class="task-btn w-[25px] h-[25px] cursor-pointer shrink-0 ml-[10px]">
                            <img src="images/delete-1-svgrepo-com.svg" alt="">
                        </button>
                    </li>
                `)
            }
        }

    }

    drawTuskPending(): void {
        this.clearTask();
        let taskList = document.querySelector('#task-list') as HTMLUListElement;
        this.todoStatus = 'pending';

        if (this.task) {
            for (let i = 0; i < this.task.length; i++) {
                let status = (this.task[i]['state'] === 'complited') ? 'complited' : 'pending';
                let isChecked = this.task[i]['state'] === 'complited';

                if (status === 'pending') {
                    taskList.insertAdjacentHTML('beforeend', `
                    <li class="task-item relative flex justify-between items-center pt-[10px] pb-[10px] custom-list">
                        <div class="flex items-center gap-x-[10px]">
                            <input type="checkbox" class="task-checkbox w-[17px] h-[17px] 
                            accent-[#9A1750] shrink-0" ${isChecked ? 'checked' : ''} data-id="${this.task[i]['id']}">
                            <span class='${status}'>${this.task[i]['text']}</span>
                        </div>
                        <button class="task-btn w-[25px] h-[25px] cursor-pointer shrink-0 ml-[10px]">
                            <img src="images/delete-1-svgrepo-com.svg" alt="">
                        </button>
                    </li>
                    `);
                }
            }
        }
    }

    drawTuskComplited(): void {
        this.clearTask();
        let taskList = document.querySelector('#task-list') as HTMLUListElement;
        this.todoStatus = 'complited';

        if (this.task) {
            for (let i = 0; i < this.task.length; i++) {
                let status = (this.task[i]['state'] === 'complited') ? 'complited' : 'pending';
                let isChecked = this.task[i]['state'] === 'complited';

                if (status === 'complited') {
                    taskList.insertAdjacentHTML('beforeend', `
                    <li class="task-item relative flex justify-between items-center pt-[10px] pb-[10px] custom-list">
                        <div class="flex items-center gap-x-[10px]">
                            <input type="checkbox" class="task-checkbox w-[17px] h-[17px] 
                            accent-[#9A1750] shrink-0" ${isChecked ? 'checked' : ''} data-id="${this.task[i]['id']}">
                            <span class='${status}'>${this.task[i]['text']}</span>
                        </div>
                        <button class="task-btn w-[25px] h-[25px] cursor-pointer shrink-0 ml-[10px]">
                            <img src="images/delete-1-svgrepo-com.svg" alt="">
                        </button>
                    </li>
                    `);
                }
            }
        }
    }

    getRandomId(): string {
        return String(Math.floor(Math.random() * 10000));
    }

    changeStatus(id: string, check: boolean): void {
        let tasks: Task[] = JSON.parse(localStorage.getItem('task'));
        let status: string = check ? 'complited' : 'pending';
        const updateTask = tasks.map(el => (el.id === id)
            ? { ...el, state: status }
            : el
        )

        localStorage.setItem('task', JSON.stringify(updateTask));

        this.task = this.task.map(el =>
            (el.id === id) ? { ...el, state: check ? 'complited' : 'pending' } : el
        );

        this.todoStatusCheck();
    }

    clearTask(): void {
        let taskList = document.querySelector('#task-list') as HTMLUListElement;
        taskList.innerHTML = '';
    }

    clearAllTask(): void {
        this.task.length = 0;
        localStorage.setItem('task', '');
        this.count = 0;
        this.clearTask();
    }

    remove(id: string): void {
        let tasks: Task[] = JSON.parse(localStorage.getItem('task'));
        const updateTask = tasks.filter(task => task.id !== id);;
        localStorage.setItem('task', JSON.stringify(updateTask));
        this.task = this.task.filter(task => task.id !== id);
        this.count = this.count - 1;
        this.todoStatusCheck();
    }

    checkMaxLenghtTask(): boolean {
        console.log(this.count);
        if (this.count > 10) {
            this.count = 11;
            return false;
        } else {

            return true;
        }
    }
}

const task = new TaskManager;
buttonAdd.addEventListener('click', newTask);

function newTask(): void {
    let value = inputEl.value.trim();

    if (!value) {
        return;
    }

    task.addTask();
    inputEl.value = '';
    inputLength();
}

const buttonClear = document.querySelector('#clear') as HTMLButtonElement | null;
buttonClear.addEventListener('click', removeTask);

function removeTask(): void {
    task.clearAllTask();
}

let taskList = document.querySelector('#task-list') as HTMLUListElement;
taskList.addEventListener('change', (event) => {

    let taskEl = event.target as HTMLInputElement;
    if (taskEl.classList.contains('task-checkbox')) {
        const id = taskEl.dataset.id;
        const check = taskEl.checked;
        if (id) {
            task.changeStatus(id, check);
        }
    }
});

taskList.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    let button: HTMLButtonElement | null = null;

    if (target.tagName === 'IMG') {
        button = target.parentElement as HTMLButtonElement;
    } else if (target.classList.contains('task-btn')) {
        button = target as HTMLButtonElement;
    }

    if (button) {
        let taskItem = button.closest('.task-item') as HTMLLIElement;

        if (taskItem) {
            const id = taskItem.querySelector('.task-checkbox') as HTMLInputElement;
            if (id) {
                task.remove(id.dataset.id);
            }
        }
    }

});

let buttonPending = document.querySelector('#pending');
let buttonAll = document.querySelector('#all');
let buttonComplited = document.querySelector('#complited');
buttonPending.addEventListener('click', () => {
    buttonAll.classList.remove('custom-before');
    buttonComplited.classList.remove('custom-before');
    buttonPending.classList.add('custom-before');
    task.drawTuskPending();
});
buttonAll.addEventListener('click', () => {
    buttonAll.classList.add('custom-before');
    buttonComplited.classList.remove('custom-before');
    buttonPending.classList.remove('custom-before');
    task.drawTusk();
});
buttonComplited.addEventListener('click', () => {
    buttonAll.classList.remove('custom-before');
    buttonComplited.classList.add('custom-before');
    buttonPending.classList.remove('custom-before');
    task.drawTuskComplited();
});