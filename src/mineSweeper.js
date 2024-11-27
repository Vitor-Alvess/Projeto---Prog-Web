/* --------VARIÁVEIS-------*/
var rows, columns, bombs;
var matrix, board, gameMode = null;
var openedBlocks;
var diff;

let timer, seconds = 0, minutes = 0;
let timeElement;
let gamesPlayed = 0;
/*-------------------------*/

/*==========FUNÇÕES===========*/

/*---------CONFIGURA O TIMER DECRESCENTE---------*/
function setCountdown () { 
    timeElement.style.color = "red";
    if (gameMode === 'rivotril')
    {
        console.log('Modo rivotril');
        switch (parseInt(diff.value)) {
            case 0:
                seconds = 30;
                minutes = 1;
                break;
            case 1:
                seconds = 0;
                minutes = 3;
                break;
            case 2:
                seconds = 0;
                minutes = 7;
                break;
        }

        timer = setInterval(function() {
            seconds--;
            if (seconds < 0) 
            {
                minutes--;
                seconds = 59;
            }
            if (minutes < 0 && seconds < 0) 
            {
                stopTimer();
                alert('Você perdeu!');
                showBombs();
                restartModes();
                gamesPlayed++;
                document.getElementById('games-played').innerHTML = gamesPlayed;
            }
            else if (minutes === 0) timeElement.innerHTML = "00" + ":" + (seconds < 10 ? ('0' + seconds) : seconds);
            else timeElement.innerHTML = (minutes < 10 ? ('0' + minutes) : minutes) + ":" + (seconds < 10 ? ('0' + seconds) : seconds);
        }, 1000);
    }

    else if (gameMode === 'trapaca') {
        switch (parseInt(diff.value)) {
            case 0:
                seconds = 5;
                break;
            case 1:
                seconds = 7;
                break;
            case 2:
                seconds = 12;
                break;
        }

        showBombs();
        timer = setInterval(function() {
            console.log(seconds);
            timeElement.innerHTML = "00" + ":" + (seconds < 10 ? ('0' + seconds) : seconds);
            if (seconds === 0) { 
                stopTimer();
                hideBombs();
                resetTimer();
                setTimer();
            }
            seconds--;
        }, 1000);
    }
}
/*---------------------------------------------*/

/*--------CONFIGURA O TIMER CRESCENTE-----------*/
function setTimer () {
    timer = setInterval(function() {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        if (minutes === 0) timeElement.innerHTML = "00" + ":" + (seconds < 10 ? ('0' + seconds) : seconds);
        else timeElement.innerHTML = (minutes > 10 ? ('0' + minutes) : minutes) + ":" + (seconds < 10 ? ('0' + seconds) : seconds);
    }, 1000);
}
/*---------------------------------------------*/

/*--------REINICIA O TIMER-----------*/
function resetTimer () {
    clearInterval(timer);
    seconds = 0;
    minutes = 0;
    timeElement.style.color = "black";
    timeElement.innerHTML = '00:00';
}
/*---------------------------------------------*/

/*----------PAUSA O TIMER-----------*/
function stopTimer () {
    clearInterval(timer);
}
/*---------------------------------------------*/

/*-------CRIA A MATRIZ PARA DETERMINAR AS BOMBAS--------*/
function createMatrix (r, c) {
    matrix = [];
    var i;
    for (i = 0; i < r; i++)
        matrix[i] = new Array(c).fill(0);

    console.log(matrix);
}
/*---------------------------------------------*/

/*--------CRIA O GRID QUE VAI SER DISPOSTO NA TELA--------*/
function generateGrid (r, c) {
    createMatrix(r, c);
    var i, j, str = "";
    for (i = 0; i < r; i++) {
        for (j = 0; j < c; j++) {
            str += `<div class="game-block" row-index="${i}" column-index="${j}"></div>`;
        }
    }

    board.style.boxShadow = "5px 5px 5px 5px #996300";
    board.innerHTML = str;
}
/*---------------------------------------------*/

/*------EVENTO DE COLOCAR BANDEIRA--------*/
function flag (event) {
    event.preventDefault();
    var cell = event.target;

    if (cell.tagName === 'IMG') {
        cell = cell.parentElement;
    }

    // console.log(cell.classList);
    if (cell.className === 'game-block') {
        cell.classList.add('flag');
        cell.innerHTML = "<img src='assets/imgs/flag.png' width='30px' height='30px'></img>";
    }
    else if (cell.classList.contains('flag')) {
        cell.classList.remove('flag');
        cell.innerHTML = '';
    }

    endGame();
    return false;
}
/*---------------------------------------------*/

/*------GERA AS BOMBAS DO TABLUEIRO---------*/
function generateBombs () {
    var aux = 0;
    var row_aux, column_aux;
    while (aux < bombs) {
        row_aux = Math.floor(Math.random() * rows);
        column_aux = Math.floor(Math.random() * columns);

        if (matrix[row_aux][column_aux] === 0) 
        {
            matrix[row_aux][column_aux] = -1;
            // console.log(`Bomba ${aux} -> linha ${row_aux} coluna ${column_aux}`);
            aux++;
        }
    }
}
/*---------------------------------------------*/

/*---CONTA AS BOMBAS ADJACENTES-------*/
function countAdjacentBombs (r, c) {
    var count = 0;
    let i, j;
    for (i = r - 1; i <= r + 1; i++) 
        for (j = c - 1; j <= c + 1; j++)
            if (i >= 0 && i < matrix.length && j >= 0 && j < matrix[0].length)
                if (!(i === r && j === c) && matrix[i][j] === -1) count++;
            
    
    // console.log(`Elemento ${r}x${c}: ${count}`)
    matrix[r][c] = count;
}
/*---------------------------------------------*/

/*-----GERA OS NUMEROS NO TABULEIRO----------*/
function generateNumbers () {
    let i, j;
    // console.log(`linhas: ${rows}\ncolunas: ${columns}`)
    for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
            if (matrix[i][j] !== -1) countAdjacentBombs(i, j);
        }
    }
}
/*---------------------------------------------*/

/*------VARRE O TABLUEIRO ATÉ ENCONTRAR UMA BOMBA*/
function clearBoard(r_cell, c_cell) {
    // console.log("entrou")
    var i, j;
    for (i = r_cell - 1; i <= r_cell + 1; i++)
        for(j = c_cell - 1; j <= c_cell + 1; j++)
            if (i >= 0 && i < rows && j >= 0 && j < columns)
            {
                var cell = document.querySelector(`div[row-index="${i}"][column-index="${j}"]`);
                if (!cell.classList.contains('empty')) 
                {
                    switch (matrix[i][j]) {
                        case -1:
                            break;
                        case 0:
                            cell.innerHTML = '';
                            cell.classList.add('empty');
                            clearBoard(i, j);
                            break;
                        default:
                            cell.innerHTML = matrix[i][j];
                            cell.classList.add(`num${matrix[i][j]}`);
                    }
                }
            }   
}
/*---------------------------------------------*/

/*-----FIM DE JOGO------*/
function endGame() {
    console.log("endGame foi chamada");

    // Seleciona bandeiras e células abertas
    const cellsFlag = document.querySelectorAll('.flag');
    const cellsOpened = document.querySelectorAll('.empty, .num1, .num2, .num3, .num4, .num5, .num6, .num7, .num8');

    let correctFlags = 0;

    // Conta as bandeiras corretas
    cellsFlag.forEach(cell => {
        const r = parseInt(cell.getAttribute('row-index'));
        const c = parseInt(cell.getAttribute('column-index'));
        if (matrix[r][c] === -1) correctFlags++;
    });

    console.log(`Bandeiras corretas: ${correctFlags}, Bombas: ${bombs}, Células abertas: ${cellsOpened.length}, Total esperado: ${rows * columns - bombs}`);

    // Verificar condição de vitória
    if (correctFlags === bombs && cellsOpened.length === rows * columns - bombs) {
        console.log("Condição de vitória alcançada");

        gamesPlayed++;
        stopTimer();
        restartModes();

        // Atualiza o contador de jogos jogados
        document.getElementById('games-played').innerHTML = gamesPlayed;

        // Solicitar o nome do jogador
        const usuario = prompt("Digite seu nome de usuário para salvar no ranking:");

        if (usuario) {
            const tempoTotal = minutes * 60 + seconds; // Tempo total em segundos
            console.log(`Usuário: ${usuario}, Tempo total: ${tempoTotal}s`);
            
            // Salvar o ranking enviando o nome do usuário
            salvarRankingPorUsuario(usuario, gameMode, tempoTotal, `${rows}x${columns}`);
        } else {
            console.log("Nome de usuário não fornecido. O resultado não será salvo.");
        }
    } else {
        console.log("Condição de vitória não foi alcançada.");
    }
}

/*---------------------------------------------*/

/*------------SALVA RANKING POR USUARIO--------------*/

function salvarRankingPorUsuario(usuario, modo, tempo, tamanho) {
    const data = new URLSearchParams();
    data.append("usuario", usuario); // Nome do usuário
    data.append("modo_jogo", modo); // Modo de jogo
    data.append("tempo", tempo); // Tempo total em segundos
    data.append("tamanho_tabuleiro", tamanho); // Ex.: '10x10'

    fetch("salvar_ranking.php", {
        method: "POST",
        body: data,
    })
    .then(response => response.text())
    .then(result => {
        console.log("Resposta do servidor:", result);
        if (result.includes("sucesso")) {
            alert("Resultado salvo no ranking com sucesso!");
        } else {
            alert(result); // Mostra a mensagem de erro do servidor
        }
    })
    .catch(error => {
        console.error("Erro ao salvar no ranking:", error);
        alert("Erro ao salvar o resultado no ranking. Tente novamente.");
    });
}



/*---------------------------------------------*/

/*------EXIBE AS BOMBAS NA TELA-------*/
function showBombs () {
    board.onclick = undefined;
    board.oncontextmenu = undefined;
    
    var i;
    const cells = document.querySelectorAll('.game-block');
    var row_cell, col_cell;
    for (i = 0; i < cells.length; i++) {
        row_cell = parseInt(cells[i].getAttribute('row-index'));
        col_cell = parseInt(cells[i].getAttribute('column-index'));
        if (matrix[row_cell][col_cell] === -1)
        {
            cells[i].innerHTML = "<img src='assets/imgs/bomb.png' width='30px' height='30px'></img>";
        }
    }
}
/*---------------------------------------------*/

/*-------ESCONDE AS BOMBAS--------*/
function hideBombs () {
    board.onclick = checkFor_bomb;
    board.oncontextmenu = flag;
    
    var i;
    const cells = document.querySelectorAll('.game-block');
    var row_cell, col_cell;
    for (i = 0; i < cells.length; i++) {
        row_cell = parseInt(cells[i].getAttribute('row-index'));
        col_cell = parseInt(cells[i].getAttribute('column-index'));
        if (matrix[row_cell][col_cell] === -1)
        {
            cells[i].innerHTML = "";
        }
    }
}
/*------------------------------*/

/*----VERIFICA SE O BLOCO TEM UMA BOMBA------*/
function checkFor_bomb(event) {
    event.preventDefault();
    var cell = event.target;
    if (!cell.classList.contains('flag'))
    {
        // console.log(cell.getAttribute('row-index'));
        var row_cell = cell.getAttribute('row-index');

        // console.log(cell.getAttribute('column-index'));
        var col_cell = cell.getAttribute('column-index');

        switch (matrix[row_cell][col_cell])
        {
            case -1:
                showBombs();
                cell.style.backgroundColor = "red";
                gamesPlayed++;
                alert('Você perdeu!');
                stopTimer();
                restartModes();
                document.getElementById('games-played').innerHTML = gamesPlayed;
                break;
            case 0:
                cell.classList.add('empty')
                clearBoard(row_cell, col_cell);
                break;
            default:
                cell.innerHTML = matrix[row_cell][col_cell];
                cell.classList.add(`num${matrix[row_cell][col_cell]}`);
                openedBlocks++;
        }
    }

    endGame();
}
/*------------------------------*/

/*------INICIA O JOGO COM TODAS AS FUNCIONALIDADES------*/
function init() {
    while (gameMode === null) {
        alert("Escolha um modo de jogo!");
        return;
    }
    timeElement = document.getElementById('time');
    diff = document.forms["board-size"]["index"];
    board = document.getElementById("game-grid");
    
    board.oncontextmenu = flag;
    board.onclick = checkFor_bomb;

    openedBlocks = 0;
    switch (parseInt(diff.value)) 
    {
        case 0:
            rows = 10;
            columns = 10;
            bombs = 12;
            board.style.width="400px";
            board.style.height="400px";
            board.style.margin="10% auto";
            break;
        case 1:
            rows = 15;
            columns = 15;
            bombs = 38;
            board.style.width="600px";
            board.style.height="600px";
            board.style.margin="5% auto";
            break;
        case 2:
            rows = 20;
            columns = 20;
            bombs = 100;
            board.style.width="800px";
            board.style.height="800px";
            board.style.margin="5% auto";
            break;
    }
    resetTimer();
    generateGrid(rows, columns);
    generateBombs();
    generateNumbers();
    switch (gameMode) 
    {
        case 'normal':
            setTimer();
            break;
        case 'trapaca':
            setCountdown();
            break;
        case 'rivotril':
            setCountdown();
            break;
        default: 
            board.oncontextmenu = undefined;
            board.onclick = undefined;
    }
}
/*--------------------------------------*/

/*------ALTERA O MODO DE JOGO--------*/
function changeMode(mode) {
    var buttons = document.querySelectorAll('button');
    var i;
    if (mode === 'normal') gameMode = mode;
    else if (mode === 'trapaca') gameMode = mode;
    else if (mode === 'rivotril') gameMode = mode;

    console.log('game mode: ' + gameMode);
    for (i = 0; i < buttons.length; i++) {
        if (buttons[i].className === gameMode) buttons[i].classList.add('active');
        else buttons[i].disabled = true;
    }
}
/*--------------------------------------*/

/*-------REINICIA OS MODOS----------*/
function restartModes() {
    var buttons = document.querySelectorAll('button');
    var i;
    for (i = 0; i < buttons.length; i++) {
        if (buttons[i].classList.contains('active')) buttons[i].classList.remove('active');
        buttons[i].disabled = false;
    }
    gameMode = null;
}
/*--------------------------------*/

/*-----VERIFICA O MELHOR TEMPO------*/
function timeRecord () {
    var cells = document.querySelectorAll('#best');
    if (gameMode === 'normal')
    {
        var sec_cell = parseInt(cells[0].getAttribute('seconds'));
        var min_cell = parseInt(cells[0].getAttribute('minutes'));

        // console.log(sec_cell);
        // console.log(min_cell);
        if (min_cell === 0 && sec_cell === 0)
        {
            cells[0].setAttribute('minutes', minutes);
            cells[0].setAttribute('seconds', seconds);
        }
        else if (min_cell > minutes)
        {
            cells[0].setAttribute('minutes', minutes);
            cells[0].setAttribute('seconds', seconds);
        }
        else if (min_cell === minutes) 
        {
            if (sec_cell === 0) cells[0].setAttribute('seconds', seconds);
            else cells[0].setAttribute('seconds', (sec_cell > seconds) ? seconds : sec_cell);
        }

        sec_cell = parseInt(cells[0].getAttribute('seconds'));
        min_cell = parseInt(cells[0].getAttribute('minutes'));
        
        if (min_cell === 0) cells[0].innerHTML = `Normal -> 00:${(sec_cell < 10 ? '0' + sec_cell : sec_cell)}`;
        else cells[0].innerHTML = `Normal -> ${(min_cell < 10 ? '0' + min_cell : min_cell)}:${(sec_cell < 10 ? '0' + sec_cell : sec_cell)}`;
    }
    else if (gameMode === 'trapaca')
    {
        var sec_cell = parseInt(cells[1].getAttribute('seconds'));
        var min_cell = parseInt(cells[1].getAttribute('minutes'));

        // console.log(sec_cell);
        // console.log(min_cell);

        if (min_cell > minutes) 
        {
            cells[1].setAttribute('minutes', minutes);
            cells[1].setAttribute('seconds', seconds);
        }
        else if (min_cell === minutes)
        {
            if (sec_cell === 0) cells[1].setAttribute('seconds', seconds);
            else cells[1].setAttribute('seconds', (sec_cell > seconds) ? seconds : sec_cell);
        }

        sec_cell = parseInt(cells[1].getAttribute('seconds'));
        min_cell = parseInt(cells[1].getAttribute('minutes'));

        if (min_cell === 0) cells[1].innerHTML = `Trapaça -> 00:${(sec_cell < 10 ? '0' + sec_cell : sec_cell)}`;
        else cells[1].innerHTML = `Trapaça -> ${(min_cell < 10 ? '0' + min_cell : min_cell)}:${(sec_cell < 10 ? '0' + sec_cell : sec_cell)}`;
    }
    else if (gameMode === 'rivotril')
    {
        var sec_cell = parseInt(cells[2].getAttribute('seconds'));
        var min_cell = parseInt(cells[2].getAttribute('minutes'));

        // console.log(sec_cell);
        // console.log(min_cell);
        if (min_cell === 0 && sec_cell === 0)
        {
            cells[2].setAttribute('minutes', minutes);
            cells[2].setAttribute('seconds', seconds);
        }
        else if (min_cell < minutes)
        {
            cells[2].setAttribute('minutes', minutes);
            cells[2].setAttribute('seconds', seconds);
        }
        else if (min_cell === minutes) 
        {
            if (sec_cell === 0) cells[2].setAttribute('seconds', seconds);
            else cells[2].setAttribute('seconds', (sec_cell < seconds) ? seconds : sec_cell);
        }

        sec_cell = parseInt(cells[2].getAttribute('seconds'));
        min_cell = parseInt(cells[2].getAttribute('minutes'));
        
        if (min_cell === 0) cells[2].innerHTML = `Rivotril -> 00:${(sec_cell < 10 ? '0' + sec_cell : sec_cell)}`;
        else cells[2].innerHTML = `Rivotril -> ${(min_cell < 10 ? '0' + min_cell : min_cell)}:${(sec_cell < 10 ? '0' + sec_cell : sec_cell)}`;
    }
}
/*------------------------------*/
