let Pontos;

function Redimensionar() {
    let n = parseInt(document.getElementById(`NumPontos`).value);
    if (isNaN(n) || n < 1) {
        window.alert(`Insira um valor válido para n.`);
        return;
    }
    let Tabela = document.getElementById(`Pontos`);
    Tabela.innerHTML = ``;
    let linhas = new Array(3), celulas = new Array(3);
    for (let i = 0; i < 3; i++) {
        linhas[i] = document.createElement(`tr`);
        celulas[i] = document.createElement(`th`);
    }
    celulas[0].innerText = `i`;
    celulas[1].innerText = `x`;
    celulas[2].innerText = `y`;
    for (let i = 0; i < 3; i++) linhas[i].appendChild(celulas[i]);
    for (let i = 0; i < n; i++) {
        celulas[0] = document.createElement(`th`);
        celulas[0].innerText = i+1;
        for (let j = 1; j < 3; j++) {
            celulas[j] = document.createElement(`td`);
            celulas[j].innerHTML = `<input type="number" id="P${i}${j}">`;
        }
        for (let j = 0; j < 3; j++) linhas[j].appendChild(celulas[j]);
    }
    for (let i = 0; i < 3; i++) Tabela.appendChild(linhas[i]);
}
function OrdenaPontos() {
    let n = parseInt(document.getElementById(`NumPontos`).value);
    let pontos = new Array(n), x, y;
    for (let i = 0; i < n; i++) {
        pontos[i] = new Array(2);
        x = parseFloat(document.getElementById(`P${i}${1}`).value);
        y = parseFloat(document.getElementById(`P${i}${2}`).value);
        if (isNaN(x) || isNaN(y)) {
            window.alert(`Insira valores reais como abscissa e ordenada do ponto ${i+1}.`);
            return false;
        }
        pontos[i][0] = x;
        pontos[i][1] = y;
    }
    for (let i = 1; i < n; i++) {
        if (pontos[i][0] <= pontos[i-1][0]) {
            window.alert(`Favor inserir pontos ordenados.`);
            return false;
        }
    }
    for (let i = 0; i < n; i++) {
        document.getElementById(`P${i}${1}`).value = pontos[i][0];
        document.getElementById(`P${i}${2}`).value = pontos[i][1];
    }
    return true;
}

function Calcular() {
    let n = parseInt(document.getElementById(`NumPontos`).value);
    let k = parseInt(document.getElementById(`GrauPoli`).value);
    
    if (isNaN(n) || isNaN(k)) {
        window.alert(`Insira valores válidos para n e k.`);
        return;
    }
    if (n < 1 || k < 1 || n < k) {
        window.alert(`Insira valores válidos para n e k.`);
        return;
    }
    if (!OrdenaPontos()) return;
    Pontos = new Array(k);
    let xaux, yaux;
    if (n == k) {
        for (let i = 0; i < n; i++) {
            Pontos[i] = new Array(2);
            xaux = parseFloat(document.getElementById(`P${i}${1}`).value);
            yaux = parseFloat(document.getElementById(`P${i}${2}`).value);
            Pontos[i][0] = xaux;
            Pontos[i][1] = yaux;
        }
    } else {
        let z = parseInt(document.getElementById(`PontoRef`).value);
        if (isNaN(z) || z < 1 || z > n) {
            window.alert(`Insira um valor válido para z.`);
            return;
        }
        let auxesq = z, auxdir = z;
        let aux = 1;
        while (aux < k) {
            if (auxesq > 1) {
                auxesq--;
                aux++;
            }
            if (auxdir < n && aux < k) {
                auxdir++;
                aux++;
            }
        }
        for (let i = 0; i < k; i++) {
            Pontos[i] = new Array(2);
            xaux = parseFloat(document.getElementById(`P${auxesq-1}${1}`).value);
            yaux = parseFloat(document.getElementById(`P${auxesq-1}${2}`).value);
            auxesq++;
            Pontos[i][0] = xaux;
            Pontos[i][1] = yaux;
        }
    }
    let Metodo = document.getElementsByName(`Opcoes`);
    let polinomio;
    if (Metodo[0].checked) polinomio = MSisLin();
    else if (Metodo[1].checked) polinomio = MNew();
    else polinomio = MNewGre();
    document.getElementById(`pRes`).innerText = polinomio;
}

function MSisLin() {
    let n = Pontos.length;
    let A = new Array(n);
    for (let i = 0; i < n; i++) {
        A[i] = new Array(n);
        for (let j = 0; j < n; j++) A[i][j] = Pontos[i][0] ** j;
    }
    let b = new Array(n);
    for (let i = 0; i < n; i++) b[i] = Pontos[i][1];
    let a = GaussCompacto(A, b, n);
    let resultado = `${a[0]}`;
    if (n > 1) {
        resultado += ` + (${a[1]}*x)`;
        if (n > 2) {
            for (let i = 2; i < n; i++) {
                resultado += ` + (${a[i]}*x^${i})`;
            }
        }
    }
    return resultado;
}
function MNew() {
    let n = Pontos.length;
    let deltas = new Array(n-1);
    for (let i = 0; i < n; i++) {
        deltas[i] = new Array(n-i-1);
    }
    for (let i = 0; i < n-1; i++) {
        deltas[0][i] = (Pontos[i+1][1] - Pontos[i][1])/(Pontos[i+1][0] - Pontos[i][0]);
    }
    for (let i = 1; i < n-1; i++) {
        for (let j = 0; j < n-i-1; j++) {
            deltas[i][j] = (deltas[i-1][j+1] - deltas[i-1][j])/(Pontos[j+i+1][0] - Pontos[j][0]);
        }
    }
    let resultado = `${Pontos[0][1]} + (x-(${Pontos[0][0]}))*`;
    for (let i = 0; i < n-2; i++) resultado += `(${deltas[i][0]} + (x-(${Pontos[i+1][0]}))*`;
    resultado += `${deltas[n-2][0]}`;
    for (let i = 0; i < n-2; i++) resultado += `)`;
    return resultado;
}
function MNewGre() {
    let n = Pontos.length;
    let h = Pontos[1][0] - Pontos[0][0];
    for (let i = 2; i < n; i++) {
        if (Pontos[i][0] - Pontos[i-1][0] != h) {
            window.alert(`Favor inserir pontos igualmente espaçados.`);
            return `Não é possível interpolar uma curva com os pontos inseridos.`;
        }
    }
    let deltas = new Array(n-1);
    for (let i = 0; i < n; i++) deltas[i] = new Array(n-i-1);
    for (let i = 0; i < n-1; i++) deltas[0][i] = Pontos[i+1][1] - Pontos[i][1];
    for (let i = 1; i < n-1; i++) for (let j = 0; j < n-i-1; j++) deltas[i][j] = deltas[i-1][j+1] - deltas[i-1][j];
    let fatoriais = new Array(n-1);
    fatoriais[0] = 1;
    fatoriais[1] = 2;
    for (let i = 2; i < n; i++) {
        fatoriais[i] = fatoriais[i-1] * (i+1);
    }
    let resultado = `${Pontos[0][1]} + (x-(${Pontos[0][0]}))*`;
    for (let i = 0; i < n-2; i++) resultado += `(${deltas[i][0]/(fatoriais[i]*h**(i+1))} + (x-(${Pontos[i+1][0]}))*`;
    resultado += `${deltas[n-2][0]/(fatoriais[n-2]/h**(n-2))}`;
    for (let i = 0; i < n-2; i++) resultado += `)`;
    return resultado;
}

function GaussCompacto(A, b, n) {
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
    return x;
}