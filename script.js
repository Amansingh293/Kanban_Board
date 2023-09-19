const mainContainer = document.querySelector('.main-container');

const modalConatainer = document.querySelector('.modal-container');

const headerSection = document.querySelector('.header');

const toolColors = headerSection.querySelectorAll('.colors');

const modalButtons = document.querySelectorAll('.modal-button');

const deleteBtn = headerSection.querySelector('.delete');

const uid = new ShortUniqueId({ length: 6 });

const ticketHolderArray = [];

const fixedColors = ['red' , 'yellow' , 'green' , 'grey'];

let creationMode = false;

let deleteCheck = false;

let currentSelectedColor;

let lockButton = true;

let isAnyColorSelected = false;

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
function createTicket(color = 'red', task) {

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

headerSection.addEventListener('click' , (e)=>{

    const element = e.target;
    
    // //console.log(element);
    
    if(creationMode){
        return;
    }

    if( element.classList.contains('fa-plus')){

        if( deleteCheck){
            alert('First Turn Off Delete Button !!');
            return;
        }
        currentSelectedColor = 'red';
        
        modalConatainer.style.display = 'flex';

        const ticketColor = modalConatainer.children[1].children[0];

        classRemover(modalButtons,'selector');

        ticketColor.classList.add('selector');

        creationMode = true;

        modalConatainer.children[0].focus();

    }
   
    if(element.classList.contains('fa-trash')){

        if( ticketHolderArray.length === 0){
            alert("No Tickets To Delete !!");
            return;
        }
        if( deleteCheck === false){
            deleteCheck = true;
            element.style.color = 'red';
        }
        else{
            deleteCheck = false;
            element.style.color = 'black';
        }
    }

    if( element.parentElement.classList.contains('toolBox-container')){

        const clickedColor = element.classList[1];

        // //console.log(clickedColor)
        const toolColors = element.parentElement.children;
        
        //console.log(toolColors);

        const totalTickets = document.querySelectorAll('.ticket-container');

        //console.log(totalTickets);

        filterFunc(totalTickets , clickedColor);

    }

});

/************************Opening Modal Click*************************/


modalConatainer.addEventListener('click' , (e)=>{

    const target = e.target;

    //console.log(target)

    if( target.localName !== 'button' ){
        return;
    }
    classRemover(target.parentElement.children , 'selector');

    target.classList.add('selector');

    if( target.classList.contains('modal-button') ){
        currentSelectedColor = target.classList[1];
    }

    
})

/************************Submiting Modal Container*************************/


modalConatainer.addEventListener('keypress' , (e)=>{

    const element = e.target;
    // //console.log(e);

    if( e.key !== 'Enter' ){
        return;
    }
    else if( e.key === 'Enter' && e.shiftKey === true){
        return
    }

    modalConatainer.style.display = 'none';

    const textValue = modalConatainer.children[0].value;

    if( !textValue ){
        return;
    }

   modalConatainer.children[0].value = '';

    const createdTicket = createTicket(currentSelectedColor , textValue);

    mainContainer.append(createdTicket);

    creationMode = false;
});



/********************************Working on created ticket******************************/


/********************************Changing Colors of ticket on click******************************/

mainContainer.addEventListener('click' , (e)=>{ 

    const element = e.target;

    if(deleteCheck){
        const delTicket = element.parentElement;
        const delId = element.parentElement.children[1].innerText;
        // //console.log(delTicket);
        if( confirm('Ticket Selected Now Will Be Deleted !!')){
            delTicket.remove();
            ticketArrRemover(delId);
        }
        if(ticketHolderArray.length === 0){
            deleteCheck = false;
            deleteBtn.style.color = 'inherit';
        }
        return;
    }

    if(element.classList.contains('ticket-color')){
        const currentColor = element.classList[1];

        for(let i=0; i<fixedColors.length;i++){
    
            let indexCalibrator = fixedColors[(i+1)%fixedColors.length];
            
            if(currentColor === fixedColors[i]){
                //console.log(indexCalibrator)
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
        //console.log(textEditable);
        return;
    }
    
    if(element.classList.contains('fa-unlock')){
        element.classList.remove('fa-unlock');
        element.classList.add('fa-lock');
        textEditable = element.parentElement.parentElement.children[2];
        //console.log(textEditable);
        textEditable.disabled = true;
        const currentId = element.parentElement.parentElement.children[1].innerText;
        ticketArrUpdater(currentId ,textEditable.value);
        //console.log(ticketHolderArray);
        return
    }

   
});


/********************************making ticket editable******************************/



/********************************ticket updater in array******************************/
function ticketArrUpdater( tId , text){

    for(let i=0; i<ticketHolderArray.length; i++){

        if( ticketHolderArray[i].ticketId === tId){
            //console.log(ticketHolderArray[i]);
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

    if( value === null){

        for(let i=0 ; i<array.length; i++){
            const currentValue = array[i].classList[1];
            array[i].classList.remove(currentValue);
        }
        return;
    }
    for(let i = 0; i<array.length; i++ ){
        array[i].classList.remove(value);
    }

}


function filterFunc(arr , currentColor){

    for(let i=0; i<arr.length ; i++){

        const currentElemColor = arr[i].children[0].classList[1];

        const currentElem = arr[i];

        if( currentElemColor === currentColor){
            currentElem.style.display = 'flex';
        }
        else{
            currentElem.style.display = 'none';
        }
    }
    return;
}