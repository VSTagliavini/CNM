function CorrigeFuncao(funcao) {
    Funcoes_velhas = [`^`, `sin(`, `cos(`, `tan(`, `sinh`, `cosh`, `tanh`, `log`, `ln`, `e`, `pi`];
    Funcoes_corretas = [`**`, `Math.sin(`, `Math.cos(`, `Math.tan(`, `Math.sinh`, `Math.cosh`, `Math.tanh`, `Math.log10`, `Math.log`, `Math.E`, `Math.PI`];
    for (let i = 0; i < Funcoes_velhas.length; i++) {
        funcao = funcao.replace(Funcoes_velhas[i], Funcoes_corretas[i]);
    }
    return funcao;
}

function CalcularIntervalos() {
    let a = parseFloat(document.getElementById(`aIntervalos`).value), b = parseFloat(document.getElementById(`bIntervalos`).value), delta = parseFloat(document.getElementById(`deltaIntervalos`).value);
    let funcao = CorrigeFuncao(document.getElementById(`f(x)Intervalos`).value);
    if (isNaN(a) || isNaN(b) || isNaN(delta)) {
        window.alert(`Insira valores válidos para a, b e delta.`);
        return;
    }
    if (a >= b) {
        window.alert(`a deve ser menor que b.`);
        return;
    }
    funcao = new Function(`x`, `return ${funcao};`);
    fx = [];
    for (let x = a; x <= b; x += delta) {
        fx.push(funcao(x));
    }
    let Tabela = document.getElementById(`Intervalos`);
    Tabela.innerHTML = ``;
    let linha1 = document.createElement(`tr`), linha2 = document.createElement(`tr`), linha3 = document.createElement(`tr`);
    let celula1 = document.createElement(`th`), celula2 = document.createElement(`th`), celula3 = document.createElement(`th`);
    celula1.innerText = `i`;
    celula2.innerText = `a[i]`;
    celula3.innerText = `b[i]`;
    linha1.appendChild(celula1);
    linha2.appendChild(celula2);
    linha3.appendChild(celula3);
    for (let i = 0; i < fx.length-1; i++) {
        celula1 = document.createElement(`th`);
        celula1.innerText = i+1;
        linha1.appendChild(celula1);
        celula2 = document.createElement(`td`);
        celula2.innerText = fx[i];
        linha2.appendChild(celula2);
        celula3 = document.createElement(`td`);
        celula3.innerText = fx[i+1];
        linha3.appendChild(celula3);
    }
    Tabela.appendChild(linha1);
    Tabela.appendChild(linha2);
    Tabela.appendChild(linha3);
}

function CalcularRaizes() {
    let funcao = CorrigeFuncao(document.getElementById(`fxRaizes`).value);
    let a = parseFloat(document.getElementById(`aRaizes`).value);
    let b = parseFloat(document.getElementById(`bRaizes`).value);
    let erro = parseFloat(document.getElementById(`erroRaizes`).value);
    if (isNaN(a) || isNaN(b) || isNaN(erro)) {
        window.alert(`Insira valores válidos para a, b e epsilon.`);
        return;
    }
    let x = [];
    let Metodo = document.getElementsByName(`Opcoes`);
    if (Metodo[0].checked)
        x = BuscaUniforme(funcao, a, b, erro, x);
    else if (Metodo[1].checked)
        x = Bisseccao(funcao, a, b, erro, x);
    else if (Metodo[2].checked)
        x = Cordas(funcao, a, b, erro, x);
    else if (Metodo[3].checked)
        z = CordasMod(funcao, a, b, erro, x);
    else if (Metodo[4].checked)
        x = Newton(funcao, a, b, erro, x);
    else
        x = NewtonMod(funcao, a, b, erro, x);
    let aux = [];
    for (let i = 0; i < x.length; i++) {
        if (!isNaN(x[i])) aux.push(x[i]);
    }
    Funcao = new Function(`x`, `return ${funcao};`);
    let Tabela = document.getElementById(`Raizes`);
    let linha1 = document.createElement(`tr`), linha2 = document.createElement(`tr`), linha3 = document.createElement(`tr`);
    let celula1 = document.createElement(`th`), celula2 = document.createElement(`th`), celula3 = document.createElement(`th`);
    Tabela.innerHTML = ``;
    celula1.innerText = `i`;
    celula2.innerText = `x[i]`;
    celula3.innerText = `f(x[i])`;
    linha1.appendChild(celula1);
    linha2.appendChild(celula2);
    linha3.appendChild(celula3);
    for (let i = 0; i < aux.length; i++) {
        celula1 = document.createElement(`th`);
        celula1.innerHTML = i+1;
        linha1.appendChild(celula1);
        celula2 = document.createElement(`td`);
        celula2.innerText = aux[i];
        linha2.appendChild(celula2);
        celula3 = document.createElement(`td`);
        celula3.innerText = Funcao(aux[i]);
        linha3.appendChild(celula3);
    }
    Tabela.appendChild(linha1);
    Tabela.appendChild(linha2);
    Tabela.appendChild(linha3);
}

function BuscaUniforme(funcao, a, b, erro, x) {
    
    let passo = (b-a)/10;
    if (passo < erro) {
        x.push((a+b)/2);
        return;
    }
    Funcao = new Function(`x`, `return ${funcao};`);
    let p = Funcao(a);
    if (p == 0) {
        x.push(a);
        return;
    }
    let q;
    while (a < b) {
        q = p;
        p = Funcao(a+passo);
        if (p * q < 0)
            x.push(BuscaUniforme(funcao, a, a+passo, erro, x));            
        else if (q == 0) x.push(a);
        a += passo;
    }
    return x;
}

function Bisseccao(funcao, a, b, erro, x) {
    Funcao = new Function(`x`, `return ${funcao};`);
    if (Funcao(a) * Funcao(b) > 0) {
        window.alert(`Não é possível calcular a raiz da função inserida no intervalo [a, b] através do método da bissecção. Favor escolher outro método ou alterar o intervalo de busca.`);
        return;
    } else if (Funcao(a) == 0) {
        x.push(a);
        return x;
    } else if (Funcao(b) == 0) {
        window.alert(b);
        x.push(b);
        return x;
    }
    let p = Funcao((a+b)/2), q;
    do {
        if (p == 0) {
            break;
        }
        if (p * Funcao(a) > 0) a = (a+b)/2;
        else b = (a+b)/2;
        q = p;
        p = Funcao((a+b)/2);
    } while (Math.abs(p - q) > erro)
    x.push((a+b)/2);
    return x;
}
function Cordas(funcao, a, b, erro, x) {
    Funcao = new Function(`x`, `return ${funcao};`);
    if (Funcao(a) * Funcao(b) > 0) {
        window.alert(`Não é possível calcular a raiz da função inserida no intervalo [a, b] através do método da bissecção. Favor escolher outro método ou alterar o intervalo de busca.`);
        return;
    } else if (Funcao(a) == 0) {
        x.push(a);
        return x;
    } else if (Funcao(b) == 0) {
        window.alert(b);
        x.push(b);
        return x;
    }
    let p = (a * Funcao(b) - b * Funcao(a))/(Funcao(b) - Funcao(a)), q;
    do {
        if (Funcao(p) == 0) {
            break;
        }
        if (Funcao(p) * Funcao(a) > 0) a = p;
        else b = p;
        q = p;
        p = (a * Funcao(b) - b * Funcao(a))/(Funcao(b) - Funcao(a));
    } while (Math.abs(p - q) > erro);    
    x.push(p);
    return x;
}
function CordasMod(funcao, a, b, erro, x) {
    Funcao = new Function(`x`, `return ${funcao};`);
    if (Funcao(a) * Funcao(b) > 0) {
        window.alert(`Não é possível calcular a raiz da função inserida no intervalo [a, b] através do método da bissecção. Favor escolher outro método ou alterar o intervalo de busca.`);
        return;
    } else if (Funcao(a) == 0) {
        x.push(a);
        return x;
    } else if (Funcao(b) == 0) {
        window.alert(b);
        x.push(b);
        return x;
    }
    let contadorA, contadorB = 0;
    let p = (a * Funcao(b) - b * Funcao(a))/(Funcao(b) - Funcao(a)), q;
    do {
        if (Funcao(p) == 0) {
            break;
        }
        if (Funcao(p) * Funcao(a) > 0) {
            if (contadorB >= 5) {
                contadorB = 0;
                p = (a*Funcao(b)-b*Funcao(a)/2)/(Funcao(b)-Funcao(a)/2);
            }
            else {
                contadorB++;
                contadorA = 0;
            }
            a = p;
        } else {
            if (contadorA >= 5) {
                contadorA = 0;
                p = (a*Funcao(b)/2-b*Funcao(a))/(Funcao(b)/2-Funcao(a));
            } else {
                contadorA++;
                contadorB = 0;
            }
            b = p;
        }
        q = p;
        p = (a * Funcao(b) - b * Funcao(a))/(Funcao(b) - Funcao(a));
    } while (Math.abs(p - q) > erro);
    x.push(p);
    return x;
}
function Newton(funcao, a, b, erro, x) {
    Funcao = new Function(`x`, `return ${funcao};`);
    if (Funcao(a) * Funcao(b) > 0) {
        window.alert(`Não é possível calcular a raiz da função inserida no intervalo [a, b] através do método de Newton. Favor escolher outro método ou alterar o intervalo de busca.`);
        return;
    } else if (Funcao(a) == 0) {
        x.push(a);
        return x;
    } else if (Funcao(b) == 0) {
        window.alert(b);
        x.push(b);
        return x;
    }
    let p = (a+b)/2, q;
    do {
        q = p;
        p -= Funcao(p)/d1fx(funcao, p, 0.00001);
    } while (Math.abs(p - q)/2);
    x.push(p);
    return x;
}
function NewtonMod(funcao, a, b, erro, x) {
    Funcao = new Function(`x`, `return ${funcao};`);
    if (Funcao(a) * Funcao(b) > 0) {
        window.alert(`Não é possível calcular a raiz da função inserida no intervalo [a, b] através do método de Newton. Favor escolher outro método ou alterar o intervalo de busca.`);
        return;
    } else if (Funcao(a) == 0) {
        x.push(a);
        return x;
    } else if (Funcao(b) == 0) {
        window.alert(b);
        x.push(b);
        return x;
    }
    let p = (a+b)/2, q, contador = 0, alfa;
    do {
        q = p;
        if (contador % 5 == 0) 
            alfa = d1fx(funcao, p, 0.00001);
        p -= Funcao(p)/alfa;
        contador++;
    } while (Math.abs(p - q) > erro);
    x.push(p);
    return x;
}

function d1fx(Equacao, x, erro) {
    let h = 0.015625;
    F = new Function(`x`, `return ${Equacao};`);
    let p = (F(x+h) - F(x-h))/(2*h);
    let q;
    do {
        q = p;
        h /= 2;
        p = (F(x+h) - F(x-h))/(2*h);
    } while (Math.abs(p - q) > erro);
    if (p == 0) p = 10**-10;
    return p;
}