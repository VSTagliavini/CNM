let n, error, iterations, equations, estimate;

function Redimensionar() {
    n = parseInt(document.getElementById(`numfun`).value);
    error = parseFloat(document.getElementById(`maxerr`).value);
    iterations = parseInt(document.getElementById(`maxite`).value);
    if (isNaN(n) || n < 1) {
        window.alert(`Favor inserir um número natural maior que zero como número de equações.`);
        return;
    }
    if (isNaN(error) || error <= 0) {
        window.alert(`Favor inserir um número real maior que zero como erro máximo.`);
        return;
    }
    if (isNaN(iterations) || iterations < 0) {
        window.alert(`Favor inserir um número natural maior que zero como número máximo de iterações.`);
        return;
    }
    let Table = document.getElementById(`system`);
    Table.innerHTML = ``;
    let line = document.createElement(`tr`);
    let element, textos = [``, `Equações`, `Resultados`];
    for (let i = 0; i < 3; i++) {
        element = document.createElement(`th`);
        element.innerText = textos[i];
        line.appendChild(element);
    }
    Table.appendChild(line);
    for (let i = 0; i < n; i++) {
        line = document.createElement(`tr`);
        element = document.createElement(`th`);
        element.innerText = i+1;
        line.appendChild(element);
        element = document.createElement(`td`);
        element.innerHTML = `<input id="equation${i}" size="150">`;
        line.appendChild(element);
        element = document.createElement(`td`);
        element.innerHTML = `<input id="b${i}" size="20">`;
        line.appendChild(element);
        Table.appendChild(line);
    }
    Table = document.getElementById(`aux1`);
    Table.innerText = ``;
    Table = document.getElementById(`estimate`);
    Table.innerHTML = ``;
    line = document.createElement(`tr`);
    for (let i = 0; i < n; i++) {
        element = document.createElement(`th`);
        element.innerText = `x[${i}]`;
        line.appendChild(element);
    }
    Table.appendChild(line);
    line = document.createElement(`tr`);
    for (let i = 0; i < n; i++) {
        element = document.createElement(`td`);
        element.innerHTML = `<input type="number" id="est${i}" size="20">`;
        line.appendChild(element);
    }
    Table.appendChild(line);
    document.getElementById(`solution`).innerText = `Calcule primeiro`;
}
function CorrigeFuncao(funcao) {
    Funcoes_velhas = [`^`, `sin(`, `cos(`, `tan(`, `cotan(`, `cossec(`, `sec(`, `sinh`, `cosh`, `tanh`, `log`, `ln`, `e`, `pi`, ` `];
    Funcoes_corretas = [`**`, `Math.sin(`, `Math.cos(`, `Math.tan(`, `1/Math.tan(`, `1/Math.sin(`, `1/Math.cos(`, `Math.sinh`, `Math.cosh`, `Math.tanh`, `Math.log10`, `Math.log`, `Math.E`, `Math.PI`, ``];
    for (let i = 0; i < Funcoes_velhas.length; i++) {
        funcao = funcao.replaceAll(Funcoes_velhas[i], Funcoes_corretas[i]);
    }
    return funcao;
}
function Calcular() {
    equations = new Array(n);
    estimate = new Array(n);
    for (let i = 0; i < n; i++) {
        let eq = document.getElementById(`equation${i}`).value, b = document.getElementById(`b${i}`).value;
        if (!eq) {
            window.alert(`Favor inserir uma expressão no espaço para a equação ${i+1}.`);
            return;
        }
        if (!b) {
            window.alert(`Favor inserir uma expressão como resultado da expressão ${i+1}.`);
            return;
        }
        equations[i] = new Function(`x`, `return ` + CorrigeFuncao(eq) + `-(` + CorrigeFuncao(b) + `);`);
        estimate[i] = parseFloat(document.getElementById(`est${i}`).value);
        if (isNaN(estimate[i])) {
            window.alert(`Favor inserir um número real como estimativa inicial do x[${i}]`);
            return;
        }
    }
    document.getElementById(`solution`).innerText = gauss_method();
}

function gauss_method() {
    let estimate_aux, aux;
    estimate = subtract_vector(estimate, total_pivoting_gauss(gradient_matrix(), F()));
    do {
        estimate_aux = [...estimate];
        estimate = subtract_vector(estimate, total_pivoting_gauss(gradient_matrix(), F()));
        iterations--;
        aux = false;
        for (let i = 0; i < n; i++)
            if (Math.abs(estimate[i] - estimate_aux[i]) > error)
                aux = true;
    } while (iterations > 0 && aux);
    return estimate;
}
function gradient_matrix() {
    let J = new Array(n), estimate_aux = estimate;
    let h = 1e-10;
    for (let i = 0; i < n; i++) {
        J[i] = new Array(n);
        for (let j = 0; j < n; j++) {
            estimate_aux[j] += h;
            J[i][j] = equations[i](estimate_aux);
            estimate_aux[j] -= 2*h;
            J[i][j] -= equations[i](estimate_aux);
            estimate_aux[j] += h;
            J[i][j] /= (2*h);
        }
    }
    return J;
}
function F() {
    let f = new Array(n);
    for (let i = 0; i < n; i++) f[i] = equations[i](estimate);
    return f;
}
function subtract_vector(a, b) {
    let l = a.length;
    for (let i = 0; i < l; i++) a[i] -= b[i]*0.5;
    return a;
}
function total_pivoting_gauss(A, b) {
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
        if (A[i][i] == 0) A[i][i] = 1e-10;
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
    return x;
}