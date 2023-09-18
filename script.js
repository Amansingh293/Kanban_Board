const mainContainer = document.querySelector('.main-container');

const modalConatainer = document.querySelector('.modal-container');

const createBtn = document.querySelector('.crudButtons');

const modalButtons = document.querySelectorAll('.modal-button');

const uid = new ShortUniqueId({ length: 6 });

const ticketHolderArray = [];

const fixedColors = ['red' , 'yellow' , 'green' , 'grey'];

let deleteCheck = false;

let currentSelectedColor;

let lockButton = true;

const lockUnlockButton = mainContainer.querySelector('ticket-editable>div');

function createElement(elementType = 'div' , properties , ...children){

    const element = document.createElement(elementType);

    for(let key in properties){
        element[key] = properties[key];
    }

    children.forEach((child) => {
        element.append(child);
    });

    return element;

}
function createTicket(color , task) {

    const id = uid.rnd();

    const ticketColor = createElement('div' , {className: `ticket-color ${color}`});

    const ticketId = createElement('p' , {className: 'ticket-id' , textContent: id});

    const textBox = createElement('textarea' , {className: `ticket-task-area` , textContent: `${task}` , disabled: true});

    const lock = createElement('i' , {className: 'fa-solid fa-lock'});
    
    const lockHolder = createElement('div' , {className: 'ticket-editable'} , lock);

    const mainTicket = createElement('div' , {className: 'ticket-container'} , ticketColor , ticketId, textBox , lockHolder);

    let ticket = {
        ticketId: id,
        ticketColor: color,
        ticketTask: task
    };

    ticketHolderArray.push(ticket);

    return mainTicket;

}

/**************************Creating Ticket*************************/

createBtn.addEventListener('click' , (e)=>{

    const element = e.target;
    
    // console.log(element);
    
    if( element.classList.contains('fa-plus')){

        if( deleteCheck){
            alert('First Turn Off Delete Button !!');
            return;
        }

        modalConatainer.style.display = 'inherit';
        const ticketColor = modalConatainer.children[1].children[0];
        classRemover(modalButtons,'selector');
        ticketColor.classList.add('selector');
    }
   
    if(element.classList.contains('fa-trash')){

        if( deleteCheck === false){
            deleteCheck = true;
            element.style.color = 'red';
        }
        else{
            deleteCheck = false;
            element.style.color = 'flex';
            element.style.color = 'black';
        }
    }
    // console.log(ticketColor)
   
});

/************************Opening Modal Click*************************/


modalConatainer.addEventListener('click' , (e)=>{

    const target = e.target;

    // console.log(target)

    if( target.localName !== 'button'){
        return;
    }
    classRemover(target.parentElement.children , 'selector');

    target.classList.add('selector');
    // console.log(target.classList)
    currentSelectedColor = target.classList[1];

    console.log(target.parentElement.previousElementSibling);
})

/************************Submiting Modal Container*************************/


modalConatainer.addEventListener('keypress' , (e)=>{

    const element = e.target;
    // console.log(element);
    if( e.key !== 'Enter' && e.shiftKey !== true){
        return;
    }

    modalConatainer.style.display = 'none';

    const textValue = modalConatainer.children[0].value;

    if( !textValue ){
        return;
    }

   modalConatainer.children[0].value = '';

    let selectedByUserColor;

    if(currentSelectedColor){
        selectedByUserColor = currentSelectedColor;
    }
    else{
        selectedByUserColor = 'red';
    }
    const createdTicket = createTicket(selectedByUserColor , textValue);

    mainContainer.append(createdTicket);

});



/********************************Working on created ticket******************************/


/********************************changing colors of ticket on click******************************/

mainContainer.addEventListener('click' , (e)=>{

    const element = e.target;

    if(deleteCheck){
        const delTicket = element.parentElement;
        const delId = element.parentElement.children[1].innerText;
        // console.log(delTicket);
        if( confirm('Ticket Selected Now Will Be Deleted !!')){
            delTicket.remove();
            ticketArrRemover(delId);
        }
        return;
    }

    if(element.classList.contains('ticket-color')){
        const currentColor = element.classList[1];

        for(let i=0; i<fixedColors.length;i++){
    
            let indexCalibrator = fixedColors[(i+1)%fixedColors.length];
            
            if(currentColor === fixedColors[i]){
                console.log(indexCalibrator)
                element.classList.remove(currentColor);
                element.classList.add(indexCalibrator);
                break;
            }
        }
        return;
    }

    let textEditable;

    if( element.classList.contains('fa-lock') ){
        element.classList.remove('fa-lock');
        element.classList.add('fa-unlock');
        textEditable = element.parentElement.parentElement.children[2];
        textEditable.disabled = false;
        console.log(textEditable);
        return;
    }
    
    if(element.classList.contains('fa-unlock')){
        element.classList.remove('fa-unlock');
        element.classList.add('fa-lock');
        textEditable = element.parentElement.parentElement.children[2];
        console.log(textEditable);
        textEditable.disabled = true;
        const currentId = element.parentElement.parentElement.children[1].innerText;
        ticketArrUpdater(currentId ,textEditable.value);
        console.log(ticketHolderArray);
        return
    }

   
});


/********************************making ticket editable******************************/



/********************************ticket updater in array******************************/
function ticketArrUpdater( tId , text){

    for(let i=0; i<ticketHolderArray.length; i++){

        if( ticketHolderArray[i].ticketId === tId){
            console.log(ticketHolderArray[i]);
            ticketHolderArray[i].ticketTask = text;
            break;
        }
    }

    return;
}



function ticketArrRemover(id){

    for(let i=0; i<ticketHolderArray.length; i++){

        if( ticketHolderArray[i].ticketId === id){
            ticketHolderArray.splice(i,1);
        }
    }
    return;
}






function classRemover(array , value){
    for(let i = 0; i<array.length; i++ ){
        array[i].classList.remove(value);
    }
}