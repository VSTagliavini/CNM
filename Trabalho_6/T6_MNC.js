let w = new Array(20);
let X = new Array(20);
w[0] = 0.1527533871307258; X[0] = -0.0765265211334973;
w[1] = 0.1527533871307258; X[1] = 0.0765265211334973;
w[2] = 0.1491729864726037; X[2] = -0.2277858511416451;
w[3] = 0.1491729864726037; X[3] = 0.2277858511416451;
w[4] = 0.1420961093183820; X[4] = -0.3737060887154195;
w[5] = 0.1420961093183820; X[5] = 0.3737060887154195;
w[6] = 0.1316886384491766; X[6] = -0.5108670019508271;
w[7] = 0.1316886384491766; X[7] = 0.5108670019508271;
w[8] = 0.1181945319615184; X[8] = -0.6360536807265150;
w[9] = 0.1181945319615184; X[9] = 0.6360536807265150;
w[10] = 0.1019301198172404; X[10] = -0.7463319064601508;
w[11] = 0.1019301198172404; X[11] = 0.7463319064601508;
w[12] = 0.0832767415767048; X[12] = -0.8391169718222188;
w[13] = 0.0832767415767048; X[13] = 0.8391169718222188;
w[14] = 0.0626720483341091; X[14] = -0.9122344282513259;
w[15] = 0.0626720483341091; X[15] = 0.9122344282513259;
w[16] = 0.0406014298003869; X[16] = -0.9639719272779138;
w[17] = 0.0406014298003869; X[17] = 0.9639719272779138;
w[18] = 0.0176140071391521; X[18] = -0.9931285991850949;
w[19] = 0.0176140071391521; X[19] = 0.9931285991850949;

function CorrigeFuncao(funcao) {
    Funcoes_velhas = [`^`, `sin(`, `cos(`, `tan(`, `sinh`, `cosh`, `tanh`, `log`, `ln`, `e`, `pi`];
    Funcoes_corretas = [`**`, `Math.sin(`, `Math.cos(`, `Math.tan(`, `Math.sinh`, `Math.cosh`, `Math.tanh`, `Math.log10`, `Math.log`, `Math.E`, `Math.PI`];
    for (let i = 0; i < Funcoes_velhas.length; i++) {
        funcao = funcao.replace(Funcoes_velhas[i], Funcoes_corretas[i]);
    }
    return funcao;
}

function Calcular() {
    let funcao = CorrigeFuncao(document.getElementById(`Funcao`).value);
    let a = parseFloat(document.getElementById(`a`).value);
    let b = parseFloat(document.getElementById(`b`).value);
    let erro = parseFloat(document.getElementById(`ErrMax`).value);
    if (isNaN(a) || isNaN(b) || isNaN(erro)) {
        window.alert(`Insira números reais como a, b e erro máximo.`);
        return;
    }
    let Metodos = document.getElementsByName(`Opcoes`);
    let integral;
    if (Metodos[0].checked) integral = RetEsq(funcao, a, b, erro);
    else if (Metodos[1].checked) integral = RetDir(funcao, a, b, erro);
    else if (Metodos[2].checked) integral = Trap(funcao, a, b, erro);
    else if (Metodos[3].checked) integral = Simpson13(funcao, a, b, erro);
    else if (Metodos[4].checked) integral = Simpson38(funcao, a, b, erro);
    else if (Metodos[5].checked) integral = QuaGau(funcao, a, b);
    document.getElementById(`Resultado`).innerHTML = `&int;<sup>${b}</sup><sub>${a}</sub> (${document.getElementById(`Funcao`).value}) &approx; ${integral}`;
}

function RetEsq(funcao, a, b, erro) {
    f = new Function(`x`, `return ${funcao};`);
    let NPontos = 10;
    let p = 0, q;
    let h = (b-a)/NPontos;
    for (let i = 0; i < NPontos; i++) {
        x = a + i*h;
        p += f(x);
    }
    p *= h;
    do {
        
        q = p;
        NPontos *= 2;
        h = (b-a)/NPontos;
        p = 0;
        for (let i = 0; i < NPontos; i++) {
            x = a + i*h;
            p += f(x);
        }
        p *= h;
    } while(Math.abs(p - q) > erro);
    return p;
}
function RetDir(funcao, a, b, erro) {
    f = new Function(`x`, `return ${funcao};`);
    let NPontos = 10;
    let p = 0, q;
    let h = (b-a)/NPontos;
    for (let i = 1; i <= NPontos; i++) {
        x = a + i*h;
        p += f(x);
    }
    p *= h;
    do {
        
        q = p;
        NPontos *= 2;
        h = (b-a)/NPontos;
        p = 0;
        for (let i = 1; i <= NPontos; i++) {
            x = a + i*h;
            p += f(x);
        }
        p *= h;
    } while(Math.abs(p - q) > erro);
    return p;
}
function Trap(funcao, a, b, erro) {
    f = new Function(`x`, `return ${funcao};`);
    let NPontos = 10;
    let p = (f(a)+f(b))/2, q;
    let h = (b-a)/NPontos;
    for (let i = 0; i < NPontos; i++) {
        x = a + i*h;
        p += f(x);
    }
    p *= h;
    do {
        q = p;
        NPontos *= 2;
        h = (b-a)/NPontos;
        p = (f(a)+f(b))/2;
        for (let i = 0; i < NPontos; i++) {
            x = a + i*h;
            p += f(x);
        }
        p *= h;
    } while(Math.abs(p - q) > erro);
    return p;
}
function Simpson13(funcao, a, b, erro) {
    f = new Function(`x`, `return ${funcao};`);
    let NPontos = 10;
    let h = (b-a)/NPontos;
    let p = 0, q;
    for (let i = 0; i < NPontos; i += 2) p += (h/3)*(f(a+i*h) + 4*f(a+(i+1)*h) + f(a+(i+2)*h));
    do {
        q = p;
        NPontos *= 2;
        let h = (b-a)/NPontos;
        p = 0;
        for (let i = 0; i < NPontos; i += 2) p += (h/3)*(f(a+i*h) + 4*f(a+(i+1)*h) + f(a+(i+2)*h));
    } while (Math.abs(p - q) > erro);
    return p;
}
function Simpson38(funcao, a, b, erro) {
    f = new Function(`x`, `return ${funcao};`);
    let NPontos = 15;
    let h = (b-a)/NPontos;
    let p = 0, q;
    for (let i = 0; i < NPontos; i += 3) p += (3/8)*h*(f(a+i*h) + 3*f(a+(i+1)*h) + 3*f(a+(i+2)*h) + f(a+(i+3)*h));
    do {
        q = p;
        NPontos *= 3;
        let h = (b-a)/NPontos;
        p = 0;
        for (let i = 0; i < NPontos; i += 3) p += (3/8)*h*(f(a+i*h) + 3*f(a+(i+1)*h) + 3*f(a+(i+2)*h) + f(a+(i+3)*h));
    } while (Math.abs(p - q) > erro);
    return p;
}
function QuaGau(funcao, a, b) {
    let f = new Function(`x`, `return ${funcao};`);
    let p = 0;
    for (let i = 0; i < 20; i++) p += w[i] * (((b-a)/2) * f(a*((1-X[i])/2) + b*((1+X[i])/2)));
    return p;
}
