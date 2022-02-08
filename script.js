//audio elements
  var audio_gameover = new Audio('.//audio/gameover.wav');
  var audio_slap= new Audio('.//audio/tik.mp3');
  var audio_line = new Audio('.//audio/lineDone.wav');
  var audioTetris = new Audio('.//audio/tetris.mp3');
//elements from html
  const scoreText = document.querySelector('#score-display')
  const gridArea =  document.querySelector('#grid')
  const levelText = document.querySelector('#level-display')
  const btnStart = document.querySelector('button')
 

// costant values
const rows = 18;
const columns = 10;
const rxc = columns*rows; //numero di quadratini
const strtBlockIdx = [3,4,5,6,13,14,15,16];

//----definizione blocchi----//

//tipi di blocchi
const square =  [0,1,1,0,0,1,1,0];
const z_left =  [1,1,0,0,0,1,1,0];
const z_right = [0,0,1,1,0,1,1,0];
const line =    [1,1,1,1,0,0,0,0];
const pyramid = [0,1,0,0,1,1,1,0];
const l_left =  [1,1,1,0,1,0,0,0];
const l_right = [0,1,1,1,0,0,0,1];

const blockTypes = [square, line, z_left, z_right, pyramid, l_left, l_right];
const blockNames = ['square', 'line', 'z_left', 'z_right', 'pyramid', 'l_left', 'l_right'];

//initialized values
let timeInt = 10500;//show new block time
let deltaLevel = 250;//show new block time
let score = 0; //nr of lines done
let foundStop = 0;  //found bottom of brick status

// variables
let cell = [];
let lockedCells = [];
let cells  = [];
let blockname = [];
let configNr = [];
let lines2remove = [];

//inizializazione griglia
for(let i = 0; i<rxc;i++){
    const cell = document.createElement('div'); //elemento quadrato da aggiungere
    //cell.innerText = i;
    cells.push(cell); //aggiungo l'elemento del ciclo i
    gridArea.appendChild(cell);
    lockedCells.push(cell);
}

scoreText.innerText = 0;
levelText.innerText = 1;
//creaprimo brick
document.addEventListener('keydown',moveBrickbyKey);

//document.getElementById("btnStart").addEventListener("click", function() {
  

   //audioTetris.play(); //non funziona se prima non interagisco con la pagina
   
    //appare primo blocco
    new_brick();
    //sposto in basso
    oneRowDown();

 // }, false);



//-------- --------- --------//
//-------- FUNCTIONS --------//
//-------- --------- --------//

function new_brick(){
    
// -- entrata del nuovo brick -- ok! --//

    let nrRand = Math.floor(Math.random()*blockTypes.length);
    
    let block_type = blockTypes[nrRand];
    blockname = blockNames[nrRand];
    configNr = 'config1';
    cell = [];
    for(let i = 0; i<strtBlockIdx.length;i++){
        //for (let j = 0; j<block_type.length;j++){
                if (block_type[i] == 1){
                    cells[strtBlockIdx[i]].classList.add('brick'); //elemento quadrato da aggiungere 
                    cells[strtBlockIdx[i]].classList.add(blockname); //elemento quadrato da aggiungere 
                    cells[strtBlockIdx[i]].classList.add(configNr); //elemento quadrato da aggiungere 
                    cell[i] = strtBlockIdx[i];
                }else{
                    cell[i] = Math.min(strtBlockIdx);
                }
        //}
    }     
    
    moveDown_IntVal = setInterval(oneRowDown, timeInt/15);
}
function oneRowDown(){  
    // -- movimento in basso del brick  -- ok! --//
    // -- si blocca al raggiungimento dell'ultima riga o di un altro blocco  -- ok! --//

    blockname = deleteBrick();
    //last row to reach
    minEl = (rows-1)*columns;
    maxEl = minEl+columns-1;
     let allowToContinue = 1;
        for (let i=0; i < cell.length; i++){ 
            if (typeof cells[cell[i]] != "undefined"){
                if ( ((cell[i]+10) < maxEl)  && (!lockedCells[cell[i]+10].classList.contains('locked')) ){     
                     allowToContinue++;  
                    }else if(lockedCells[cell[i]+10].classList.contains('locked')){   
                              foundStop = 1;
                                for (let i=0; i < cell.length; i++){ 
                                    if (typeof lockedCells[cell[i]] != "undefined"){   
                                        audio_slap.play();
                                        lockedCells[cell[i]].classList.add('locked');
                                        flagBottom = 1;                             
                                    }
                                }
                             showBrick();
                                if(flagBottom==1){
                                    lineCompleted();
                                    clearInterval(moveDown_IntVal);
                                    //clearInterval(brickApparenceTimer);
                                                    
                                    if (cell[i]<columns){
                                        //sono nella prima riga, ho perso
                                        console.log('GAME OVER');
                                        audio_gameover.play();
                                        javascript_abort();

                                        return;
                                        }

                                    new_brick();
                                    return;     
                                    }
                            }
                    }else{
                        allowToContinue++;     
                        }
                if (allowToContinue == cell.length){
                    for (let j=0; j < cell.length; j++){   
                        if (typeof cell[j] != "undefined"){    
                        cell[j]=cell[j] + 10; //lo faccio spostare 
                        }
                    }
                    showBrick();  
                        
                        flagBottom=0;
                        let maxVal=[]; 
                        for (let i=0; i < cell.length; i++){ 
                            maxVal = Math.max(cell[i]);                                          
                            if (maxVal>=minEl){   
                                foundStop = 1;   
                                for (let i=0; i < cell.length; i++){     
                                    if (typeof lockedCells[cell[i]] != 'undefined'){  
                                        audio_slap.play();
                                        lockedCells[cell[i]].classList.add('locked');
                                        flagBottom=1;
                                    }                                                                                         
                                }
                                if(flagBottom==1){
                                    lineCompleted();
                                    clearInterval(moveDown_IntVal);
                                    //clearInterval(brickApparenceTimer);
                                    
                                    new_brick();
                                return;     
                                }
                            }                                            
                        }    
                }
        }
}

function javascript_abort(){
   throw new Error('This is not an error. This is just to abort javascript');
}

function moveBrickbyKey(event){
    //movimento brick in risposta alle frecce sinistra e destra -- ok!
    let posbrick = null;  
    
    //check  quale tasto ho cliccato
    if(event.code == "ArrowRight"){
        posbrick = 1;
    }else if(event.code == "ArrowLeft"){
        posbrick = -1;   
    }else if(event.code == "Space"){  
        //go down until you can   
        while (foundStop == 0 ){
            oneRowDown();
        }
        foundStop = 0;
    }else if(event.code == "ArrowUp"){  
        //rotate      
                    switch (blockname) {                        
                        case 'line':    //ok per blocco ai lati                 
                            if (cell[0] >20 && typeof cells[cell[0]] != "undefined" &&  cells[cell[0]].classList.contains('config1')){  

                                if  (((cell[0]%10 != 0) && (cell[3]%10 == 9)) || ((cell[0]%10 == 0) && (cell[3]%10 != 9)) || (((cell[0]%10 != 0) && (cell[0]%10 != 9)))){        
                                    deleteBrick();  
                                    cell[0] = cell[0] - ((columns*2) - 2);
                                    cell[1] = cell[1] - (columns - 1);                                
                                    cell[3] = cell[3] + (columns - 1);  
                                    configNr = 'config2';         
                                }
                            }else if (typeof cells[cell[0]] != "undefined" &&  cells[cell[0]].classList.contains('config2')){           
                                if  ( (cell[0]%10 != 0)  && (cell[0]%10 != 1)  && (cell[0]%10 != 9) ){      
                                    deleteBrick();   
                                    cell[0] = cell[0] + ((columns*2) - 2);                                      
                                    cell[1] = cell[1] + (columns - 1);    
                                    cell[3] = cell[3] - (columns - 1); 
                                    configNr = 'config1';     
                                }
     
                            }                            
                            break;
                        case 'z_left': //ok per blocco ai lati      
                            if (typeof cells[cell[0]] != "undefined" &&  cells[cell[0]].classList.contains('config1')){   
                               // orizzontale
                                deleteBrick();  
                                cell[0] = cell[0] - (columns - 2);                      
                                cell[6] = cell[6] - columns;                                   
                                configNr = 'config2';
                            }else if (typeof cells[cell[0]] != "undefined" &&  cells[cell[0]].classList.contains('config2')){           
                                //verticale
                               if  ( (cell[0]%10 != 1) ){   
                                deleteBrick();  
                                cell[0] = cell[0] + (columns - 2);                       
                                cell[6] = cell[6] + columns;
                                configNr = 'config1';         
                            }           
                            }                     
                        break;

                        case 'z_right':  //ok per blocco ai lati 
                            if (typeof cells[cell[2]] != "undefined" &&  cells[cell[2]].classList.contains('config1')){
                                console.log(cell[3]%10 )        
                                
                                    deleteBrick();   
                                cell[2] = cell[2] - 1;                      
                                cell[3] = cell[3] + ((columns*2)-1);                                   
                                configNr = 'config2';
                               
                            }else if (typeof cells[cell[2]] != "undefined" &&  cells[cell[2]].classList.contains('config2')){           
                                if  ( (cell[2]%10 != 8) ){                                  
                                    deleteBrick();
                                cell[2] = cell[2] + 1;                       
                                cell[3] = cell[3] - ((columns*2)-1); 
                                configNr = 'config1';      
                            }              
                            }                     
                        break;

                        case 'pyramid'://ok per blocco ai lati 
                            if (typeof cells[cell[4]] != "undefined" &&  cells[cell[4]].classList.contains('config1')){          
                                
                                    deleteBrick();          
                                cell[4] = cell[4] - ((columns*2)-1);      
                                cell[6] = cell[6] - columns;                                  
                                configNr = 'config2';
                                
                            }else if (typeof cells[cell[4]] != "undefined" &&  cells[cell[4]].classList.contains('config2')){           
                                if  ( (cell[4]%10 != 0) ){                                  
                                
                                deleteBrick();                         
                                cell[4] = cell[4] + (columns - 1);   
                                configNr = 'config3';      
                            }              
                            }else if (typeof cells[cell[4]] != "undefined" &&  cells[cell[4]].classList.contains('config3')){           
                                
                               
                                    deleteBrick();                  
                                cell[6] = cell[6] - (columns + 1); 
                                configNr = 'config4';           
                                   
                            }else if (typeof cells[cell[4]] != "undefined" &&  cells[cell[4]].classList.contains('config4')){           
                                if  ( (cell[6]%10 != 9) ){                                  
                                    deleteBrick();               
                                cell[4] = cell[4] + columns;               
                                cell[6] = cell[6] + ((columns*2)+1);  
                                configNr = 'config1';  
                            }                        
                            }    
                            break;
                            case 'l_left':
                            if (typeof cells[cell[0]] != "undefined" &&  cells[cell[0]].classList.contains('config1')){          
                             
                                    deleteBrick();                           
                                cell[2] = cell[2]  + (columns - 1);   
                                cell[4] = cell[4]  + (columns + 1);;          
                                                                
                                configNr = 'config2';
                            }else if (typeof cells[cell[0]] != "undefined" &&  cells[cell[0]].classList.contains('config2')){           
                                                              
                              
                                    deleteBrick();               
                                cell[2] = cell[2]  - (columns - 1);   
                                cell[4] = cell[4]  - ((columns*3) -1);       
                                configNr = 'config3';              
                            
                            }else if (typeof cells[cell[0]] != "undefined" &&  cells[cell[0]].classList.contains('config3')){           
                               
                                    deleteBrick();                                    
                                cell[0] = cell[0] + (columns + 1);                   
                                cell[2] = cell[2] - (columns + 1);     
                                cell[4] = cell[4] + (columns*2);      
                                configNr = 'config4';                    
                            }else if (typeof cells[cell[0]] != "undefined" &&  cells[cell[0]].classList.contains('config4')){           
                                if  ( (cell[2]%10 != 0) ){    
                                    deleteBrick();                         
                                cell[0] = cell[0] - (columns + 1);        
                                cell[2] = cell[2] + (columns + 1); ;   
                                cell[4] = cell[4] - 2;    
                                configNr = 'config1'; 
                                }                   
                            }    
                            break;

                            case 'l_right':
                            if (typeof cells[cell[1]] != "undefined" &&  cells[cell[1]].classList.contains('config1')){          
                               
                                    deleteBrick();                             
                                cell[1] = cell[1]  - (columns - 1); 
                                cell[3] = cell[3]  + (columns - 1);          
                                cell[7] = cell[7]  -2;                                                                
                                configNr = 'config2';
                            }else if (typeof cells[cell[1]] != "undefined" &&  cells[cell[1]].classList.contains('config2')){           
                                if  ( (cell[2]%10 != 9) ){    
                                   
                                 deleteBrick();                
                                cell[1] = cell[1]  + ((columns*2) + 1);        
                                cell[2] = cell[2]  -1;     
                                configNr = 'config3';     
                                }               
                            }else if (typeof cells[cell[1]] != "undefined" &&  cells[cell[1]].classList.contains('config3')){           
                                                      
                                   
                                 deleteBrick();                            
                                cell[1] = cell[1]  - ((columns*2)+ 1);    
                                cell[3] = cell[3]  - ((columns*2) + 1);  
                                configNr = 'config4';                    
                            }else if (typeof cells[cell[1]] != "undefined" &&  cells[cell[1]].classList.contains('config4')){           
                                 
                                if  (cell[2]%10 != 9 && cell[1]%10 != 9 && cell[3]%10 != 9 && cell[7]%10 != 9){  
                                deleteBrick(); 
                                cell[1] = cell[1]  + (columns-1) ;       
                                cell[2] = cell[2]  + 1 ;          
                                cell[3] = cell[3]  + (columns + 2);          
                                cell[7] = cell[7]  + 2;   
                                configNr = 'config1';      
                                }              
                            }    
                            break;

                        default:
                        break;

                        } 
                }
                showBrick();   
                
    //check se non si è bloccato il brick
    for (let i = 0 ; i<cell.length;i++){
        if (typeof cells[cell[i]] != "undefined") {  
            //se il blocco corrente è già fissato
            if (lockedCells[cell[i]].classList.contains('locked')) { 
                return;
            }
            //se spostandomi troverei un blocco già fissato
            if (lockedCells[cell[i]+posbrick].classList.contains('locked')) { 
                return;
            }
        }
    }    

    actMovement_leftRight(posbrick);
}
function actMovement_leftRight(posbrick){
    //movimento a destra o sinistra del brick -- ok!
    
    //check se ho raggiunto il bordo
    for(let j = 0;j < cell.length; j++){
        if ( (cell[j]%10 == 0) && posbrick == -1){
            return; 
        }else if ( (cell[j]%10 == 9) && posbrick == 1){
            return; 
        }
    }

    deleteBrick();

    for(let j = 0;j < cell.length;j++){
        if (typeof cell[j] != "undefined"){
            if (typeof cells[cell[j] + posbrick] != "undefined" ){
                cell[j] = cell[j] + posbrick;
            }
        }
    }

   showBrick();
}
function showBrick(){
    //appare Brick corrente-- ok
    for(let i = 0; i<cell.length; i++){
        if (typeof cells[cell[i]] != "undefined"){
            
            cells[cell[i]].classList.add("brick",configNr,blockname);
        }
    }
}
function deleteBrick(){
    //rimozione Brick corrente-- ok
    for(let i = 0; i < cell.length; i++){
        if (typeof cells[cell[i]] != "undefined" && !lockedCells[cell[i]].classList.contains('locked')){         
                    cells[cell[i]].classList.remove("brick",configNr,blockname);
        }            
    }
    return blockname;
}
function lineCompleted(){
    //check se ho compleato una linea
        
    let idx = [];
    const bricksLocations = document.querySelectorAll('#grid > div')

    for (let r = 0; r<rows; r++){        
        let idxLocked = 0;
        for (let c = 0; c< columns; c++){
            idx = (r*10)+c;                
            string = bricksLocations[idx].classList;  

            if (string.length == 4){
                for (let k=0; k<string.length;k++){
                    if (string[k]=='locked'){
                        idxLocked++;
                    }
                }                    
            }

        }            
        if (idxLocked == columns){
            lines2remove = r;
            audio_line.play();
            for (let c = 0; c< columns; c++){                                
                idx = (r * 10) + c;
                listClass = bricksLocations[idx].classList.length;

                for (let nr = 0; nr<listClass; nr++){
                        bricksLocations[idx].classList.remove(bricksLocations[idx].classList[0]);
                    }

            }               

            score++;
            if (score%10 == 0){ //se ho passato di livello

                levelText.innerText = ( score/10 ) +1 ;

                timeInt = timeInt - 250*(score/10);//show new block time
                console.log(timeInt);
                
            }
            scoreText.innerText = score; 
            dropDown_afterLine();
        }
    }
}

function dropDown_afterLine(){    
            for (let r = ((lines2remove-1)*columns)+columns; r>0; r--){  
                
                    if (cells[r].classList.contains('brick') ){
                        cells[r+columns].classList = cells[r].classList;
                        cells[r].classList = '';
                    }
                
            }  

}