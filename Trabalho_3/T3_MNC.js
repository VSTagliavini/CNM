function Redimensionar() {
    n = parseInt(document.getElementById(`n`).value);
    if (isNaN(n)) {
        window.alert(`Insira um valor válido como número de variáveis.`);
        return;
    }
    if (n < 0 || n > 25) {
        window.alert(`Insira um valor válido como número de variáveis.`);
        return;
    }
    let Tabela = document.getElementById(`SistemaEquacoes`);
    Tabela.innerHTML = ``;
    let linha = document.createElement(`tr`);
    let celula = document.createElement(`th`);
    celula.innerText = `A`;
    linha.appendChild(celula);
    for (let i = 1; i <= n; i++) {
        celula = document.createElement(`th`);
        celula.innerText = `${i}`;
        linha.appendChild(celula);
    }
    celula = document.createElement(`th`);
    celula.innerText = `b`;
    linha.appendChild(celula);
    Tabela.appendChild(linha);

    for (let i = 1; i <= n; i++) {
        let linha = document.createElement(`tr`);
        celula = document.createElement(`th`);
        celula.innerText = `${i}`;
        linha.appendChild(celula);
        for (let j = 1; j <= n; j++) {
            celula = document.createElement(`th`);
            celula.innerHTML = `<input type="number" id="a${i}${j}">`;
            linha.appendChild(celula);
        }
        celula = document.createElement(`th`);
        celula.innerHTML = `<input type="number" id="b${i}">`;
        linha.appendChild(celula);
        Tabela.appendChild(linha);
    }
    Tabela = document.getElementById(`x`);
    Tabela.innerHTML = ``;
    linha = document.createElement(`tr`);
    celula = document.createElement(`th`);
    celula.innerText = `X`;
    linha.appendChild(celula);
    for (let i = 1; i <= n; i++) {
        celula = document.createElement(`th`);
        celula.innerText = `${i}`;
        linha.appendChild(celula);
    }
    Tabela.appendChild(linha);
    linha = document.createElement(`tr`);
    celula = document.createElement(`th`);
    linha.appendChild(celula);
    for (let i = 1; i <= n; i++) {
        celula = document.createElement(`th`);
        celula.id = `x${i}`;
        celula.innerText = `Calcule primeiro`;
        linha.appendChild(celula);
    }
    Tabela.appendChild(linha);
}
function MetodosDiretos() {
    document.getElementById(`MetodosIterativos`).innerHTML = ``;
}
function MetodosIterativos() {
    let n = document.getElementById(`n`).value;
    if (isNaN(n) || n < 1) {
        window.alert(`Insira um valor válido como número de variáveis.`);
        document.getElementById(`MGauss`).checked = true;
        return;
    }
    document.getElementById(`MetodosIterativos`).innerHTML = `<p>
    <label for="Iteracoes">Número de iteracoes:&ensp;&nbsp;</label>
    <input type="number" id="Iteracoes" min="10">
    &ensp;&nbsp;
    <label for="Erro">Erro máximo:&ensp;&nbsp;<label>
    <input type="number" id="Erro" max="0.001">
    <p>
    <p>Estimativa da solução</p>
    <table id="xEstimado"></table>`;
    let Estimativa = document.getElementById(`xEstimado`), linha = document.createElement(`tr`), celula;
    for (let i = 0; i < n; i++) {
        celula = document.createElement(`td`);
        celula.innerHTML = `<input type="number" id="xe${i}">`;
        linha.appendChild(celula);
    }
    Estimativa.appendChild(linha);
}

function Calcular() {
    n = parseInt(document.getElementById(`n`).value);
    if (isNaN(n)) {
        window.alert(`Insira um valor válido como número de variáveis.`);
        return;
    }
    let A = [], b = [], aux = [];
    for (let i = 1; i <= n; i++) {
        aux = [];
        for (let j = 1; j <= n; j++) {
            let aux2 = parseFloat(document.getElementById(`a${i}${j}`).value);
            if (isNaN(aux2)) {
                window.alert(`Insira valores válidos para o sistema.`);
                return;
            }
            aux.push(aux2);
        }
        let aux2 = parseFloat(document.getElementById(`b${i}`).value);
        if (isNaN(aux2)) {
            window.alert(`Insira valores válidos para o sistema.`);
            return;
        }
        b.push(aux2);
        A.push(aux);
    }
    let Metodo = document.getElementsByName(`Opcoes`);
    if (Metodo[0].checked) Gauss(A, b);
    else if (Metodo[1].checked) GaussCompacto(A, b);
    else if (Metodo[2].checked) GaussPivPar(A, b);
    else if (Metodo[3].checked) GaussPivTot(A, b);
    else if (Metodo[4].checked) LU(A, b);
    else if (Metodo[5].checked) Cholesky(A, b);
    else if (Metodo[6].checked) Jacobi(A, b);
    else if (Metodo[7].checked) GaussSeidel(A, b);
}

function Gauss(A, b) {
    for (let i = 0; i < n; i++) {
        let pivo = A[i][i];
        if (pivo == 0) {
            window.alert(`Não é possível resolver o sistema através do método de Gauss pois o pivô A[${i+1}][${i+1}] torna-se nulo.`);
            return;
        }
        for (let j = i+1; j < n; j++) {
            let a = A[j][i]/pivo;
            for (let k = i; k < n; k++) {
                A[j][k] -= A[i][k] * a;
            }
            b[j] -= b[i]*a
        }
    }
    let x = [];
    for (let j = 0; j < n; j++) {
        x.push(null);
    }
    for (let i = n-1; i > -1; i--) {
        let aux = b[i];
        for (let j = i+1; j < n; j++) {
            aux -= A[i][j] * x[j];
        }
        x[i] = aux / A[i][i];
    }
    for (let i = 1; i <= n; i++) {
        document.getElementById(`x${i}`).innerText = x[i-1];
    }
}
function GaussCompacto(A, b) {
    for (let i = 0; i < n; i++) {
        let pivo = A[i][i];
        if (pivo == 0) {
            window.alert(`Não é possível resolver o sistema através do método de Gauss compacto pois o pivô A[${i+1}][${i+1}] torna-se nulo.`);
            return;
        }
        for (let j = i+1; j < n; j++) {
            let a = A[j][i]/pivo;
            A[j][i] = a;
            for (let k = i+1; k < n; k++) {
                A[j][k] -= A[i][k] * a;
            }
        }
    }
    for (let i = 0; i < n; i++) {
        for (let j = i-1; j > -1; j--) {
            b[i] -= b[j]*A[i][j];
        }
    }
    let x = new Array(n);
    for (let i = n-1; i > -1; i--) {
        let aux = b[i];
        for (let j = i+1; j < n; j++) {
            aux -= A[i][j] * x[j];
        }
        x[i] = aux / A[i][i];
    }
    for (let i = 1; i <= n; i++) {
        document.getElementById(`x${i}`).innerText = x[i-1];
    }
}
function GaussPivPar(A, b) {
    for (let i = 0; i < n; i++) {
        let linha_escolhida = i;
        for (let j = i+1; j < n; j++) {
            if (Math.abs(A[j][i]) > Math.abs(A[linha_escolhida][i])) {
                linha_escolhida = j;
            }
        }
        if (linha_escolhida != i) {
            let aux = b[i];
            b[i] = b[linha_escolhida];
            b[linha_escolhida] = aux;
            for (let k = i; k < n; k++) {
                aux = A[linha_escolhida][k];
                A[linha_escolhida][k] = A[i][k];
                A[i][k] = aux;
            }
        }
        for (let j = i+1; j < n; j++) {
            let m = A[j][i]/A[i][i];
            for (let k = i; k < n; k++) {
                A[j][k] -= A[i][k] * m;
            }
            b[j] -= b[i] * m;
        }
    }
    let x = [];
    for (let i = 0; i < n; i++) {
        x.push(null);
    }
    for (let i = n-1; i > -1; i--) {
        let aux = b[i];
        for (let j = i+1; j < n; j++) {
            aux -= A[i][j] * x[j];
        }
        x[i] = aux/A[i][i];
    }
    for (let i = 1; i <= n; i++) {
        document.getElementById(`x${i}`).innerText = x[i-1];
    }
}
function GaussPivTot(A, b) {
    let posicoesx = [];
    for (let i = 0; i < n; i++) {
        posicoesx.push(i);
    }
    for (let i = 0; i < n; i++) {
        let linha_escolhida = i, coluna_escolhida = i;
        for (let j = i+1; j < n; j++) {
            for (let k = i+1; k < n; k++) {
                if (Math.abs(A[j][k]) > Math.abs(A[linha_escolhida][coluna_escolhida])) {
                    linha_escolhida = j;
                    coluna_escolhida = k;
                }
            }
        }

        if (linha_escolhida != i) {
            let aux;
            aux = b[i];
            b[i] = b[coluna_escolhida];
            b[coluna_escolhida] = aux;
            for (let j = i; j < n; j++) {
                aux = A[i][j];
                A[i][j] = A[linha_escolhida][j];
                A[linha_escolhida][j] = aux;
            }
        }
        if (coluna_escolhida != i) {
            let aux;
            aux = posicoesx[i];
            posicoesx[i] = posicoesx[coluna_escolhida];
            posicoesx[coluna_escolhida] = aux;
            for (let j = 0; j < n; j++) {
                aux = A[j][i];
                A[j][i] = A[j][coluna_escolhida];
                A[j][coluna_escolhida] = aux;
            }
        }
        for (let j = i+1; j < n; j++) {
            let m = A[j][i]/A[i][i];
            for (let k = i; k < n; k++) {
                A[j][k] -= A[i][k] * m;
            }
            b[j] -= b[i] * m;
        }
    }
    for (let i = 0; i < n; i++) {
        if (A[i][i] == 0) {
            window.alert(`Não é possível resolver o sistema através do método de Gauss com pivotamento total pois o pivô A[${i+1}][${i+1}] torna-se nulo.`);
            return;
        }
    }
    let x = [];
    for (let i = 0; i < n; i++) {
        x.push(null);
    }
    for (let i = n-1; i > -1; i--) {
        let resultado = b[i];
        for (let j = i+1; j < n; j++) {
            resultado -= x[posicoesx[j]] * A[i][j];
        }
        x[posicoesx[i]] = resultado/A[i][i];
    }
    for (let i = 1; i <= n; i++) {
        document.getElementById(`x${i}`).innerText = x[i-1];
    }
}
function LU(A, b) {
    let L = [];
    for(let i = 0; i < n; i++) {
        L[i] = new Array(n);
    }
    for (let i = 0; i < n; i++) {
        L[i][i] = 1;
    }
    for (let i = 0; i < n; i++) {
        let pivo = A[i][i];
        if (pivo == 0) {
            window.alert(`Não é possível resolver o sistema através do método de decomposição L U pois o pivô A[${i+1}][${i+1}] torna-se nulo.`);
            return;
        }
        for (let j = i+1; j < n; j++) {
            let a = A[j][i]/pivo;
            for (let k = i; k < n; k++) {
                A[j][k] -= A[i][k] * a;
            }
            L[j][i] = a;
        }
    }
    let z = new Array(n);
    for (let i = 0; i < n; i++) {
        let aux = b[i];
        for (let j = i-1; j > -1; j--) {
            aux -= z[j]*L[i][j];
        }
        z[i] = aux;
    }
    let x = new Array(n);
    for (let i = n-1; i > -1; i--) {
        let aux = z[i];
        for (let j = i+1; j < n; j++) {
            aux -= A[i][j] * x[j];
        }
        x[i] = aux / A[i][i];
    }
    for (let i = 1; i <= n; i++) {
        document.getElementById(`x${i}`).innerText = x[i-1];
    }
}
function Cholesky(A, b) {
    for (let i = 0; i < n; i++) {
        for (let j = i+1; j < n; j++) {
            if (A[i][j] != A[j][i]) {
                window.alert(`A matriz A não é simétrica e por isso não é possível utilizar o método de Cholesky na resolução do sistema.`);
                return;
            }
        }
    }
    let L = [];
    for(let i = 0; i < n; i++) {
        L[i] = new Array(n);
    }
    for (let i = 0; i < n; i++) {
        L[i][i] = 1;
    }
    for (let i = 0; i < n; i++) {
        let pivo = A[i][i];
        if (pivo == 0) {
            window.alert(`Não é possível resolver o sistema através do método de Cholesky pois o pivô A[${i+1}][${i+1}] torna-se nulo.`);
            return;
        }
        for (let j = i+1; j < n; j++) {
            let a = A[j][i]/pivo;
            for (let k = i; k < n; k++) {
                A[j][k] -= A[i][k] * a;
            }
            L[j][i] = a;
        }
    }
    let z = new Array(n);
    for (let i = 0; i < n; i++) {
        let aux = b[i];
        for (let j = i-1; j > -1; j--) {
            aux -= z[j]*L[i][j];
        }
        z[i] = aux;
    }
    let x = new Array(n);
    for (let i = n-1; i > -1; i--) {
        let aux = z[i];
        for (let j = i+1; j < n; j++) {
            aux -= A[i][j] * x[j];
        }
        x[i] = aux / A[i][i];
    }
    for (let i = 1; i <= n; i++) {
        document.getElementById(`x${i}`).innerText = x[i-1];
    }
}
function Jacobi(A, b) {
    let xestimado = new Array(n), iteracoes = parseInt(document.getElementById(`Iteracoes`).value), erro = parseFloat(document.getElementById(`Erro`).value);
    if (isNaN(iteracoes) || isNaN(erro)) {
        window.alert(`Insira valores válidos para o número de iterações e o erro máximo.`);
        return;
    }
    for (let i = 0; i < n; i++) {
        xestimado[i] = parseFloat(document.getElementById(`xe${i}`).value);
        if (isNaN(xestimado[i])) {
            window.alert(`Insira valores válidos para a estimativa da solução.`);
            return;
        }
    }
    let xaux = new Array(n), aux;
    for (; iteracoes > 0; iteracoes--) {
        for (let i = 0; i < n; i++) {
            xaux[i] = xestimado[i];
        }
        for (let i = 0; i < n; i++) {
            aux = b[i];
            for (let j = 0; j < n; j++) {
                if (j != i) {
                    aux -= xaux[j] * A[i][j];
                }
            }
            xestimado[i] = aux/A[i][i];
        }
        aux = 0;
        for (let i = 0; i < n; i++) {
            aux = Math.max(aux, Math.abs(xestimado[i] - xaux[i]));
        }
        if (aux < erro) {
            break;
        }
    }
    for (let i = 1; i <= n; i++) {
        document.getElementById(`x${i}`).innerText = xestimado[i-1];
    }
}
function GaussSeidel(A, b) {
    let xestimado = new Array(n), iteracoes = parseInt(document.getElementById(`Iteracoes`).value), erro = parseFloat(document.getElementById(`Erro`).value);
    if (isNaN(iteracoes) || isNaN(erro)) {
        window.alert(`Insira valores válidos para o número de iterações e o erro máximo.`);
        return;
    }
    for (let i = 0; i < n; i++) {
        xestimado[i] = parseFloat(document.getElementById(`xe${i}`).value);
        if (isNaN(xestimado[i])) {
            window.alert(`Insira valores válidos para a estimativa da solução.`);
            return;
        }
    }
    let xaux = new Array(n), aux;
    for (; iteracoes > 0; iteracoes--) {
        for (let i = 0; i < n; i++) {
            xaux[i] = xestimado[i];
        }
        for (let i = 0; i < n; i++) {
            aux = b[i];
            for (let j = 0; j < i; j++) {
                aux -= A[i][j] * xestimado[j];
            }
            for (let j = i+1; j < n; j++) {
                aux -= A[i][j] * xaux[j];
            }
            xestimado[i] = aux/A[i][i];
        }
        aux = 0;
        for (let i = 0; i < n; i++) {
            aux = Math.max(aux, Math.abs(xestimado[i] - xaux[i]));
        }
        if (aux < erro) {
            break;
        }
    }
    for (let i = 1; i <= n; i++) {
        document.getElementById(`x${i}`).innerText = xestimado[i-1];
    }
}