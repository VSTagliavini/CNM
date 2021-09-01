function CorrigeEquacao(Equacao) {
    Funcoes_velhas = [`^`, `sin(`, `cos(`, `tan(`, `sinh`, `cosh`, `tanh`, `log`, `ln`, `e`, `pi`]
    Funcoes_corretas = [`**`, `Math.sin(`, `Math.cos(`, `Math.tan(`, `Math.sinh`, `Math.cosh`, `Math.tanh`, `Math.log10`, `Math.log`, `Math.E`, `Math.PI`]
    for (let i = 0; i < Funcoes_velhas.length; i++) {
        Equacao = Equacao.replace(Funcoes_velhas[i], Funcoes_corretas[i])
    }
    return Equacao
}
function d1fx(Equacao, x, erro) {
    let h = 0.015625
    x += h
    let p = eval(Equacao)
    x -= 2*h
    p -= eval(Equacao)
    x += h
    p /= (2*h)
    let q
    do {
        q = p
        h /= 2
        x += h
        p = eval(Equacao)
        x -= 2*h
        p -= eval(Equacao)
        p /= (2*h)
        x += h
    } while (Math.abs(p - q) > erro)
    return p
}
function d2fx(Equacao, x, erro) {
    let h = 0.015625
    let p = -2*eval(Equacao)
    x += h
    p += eval(Equacao)
    x -= 2*h
    p += eval(Equacao)
    p /= (h**2)
    x += h
    let q
    do {
        q = p
        h /= 2
        p = -2*eval(Equacao)
        x += h
        p += eval(Equacao)
        x -= 2*h
        p += eval(Equacao)
        p /= (h**2)
        x += h
    } while (Math.abs(p - q) > erro)
    return p
}
function CalcularFx() {
    var epsilon = parseFloat(document.getElementById(`epi1`).value)
    var x = parseFloat(document.getElementById(`x`).value)
    var equacao = document.getElementById(`fx`).value
    equacao = CorrigeEquacao(equacao)
    if (isNaN(epsilon) || isNaN(x)) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Insira valores válidos para x e epsilon."));
    } else {
        document.getElementById(`d1fx`).value = d1fx(equacao, x, epsilon)
        document.getElementById(`d2fx`).value = d2fx(equacao, x, epsilon)
    }
    
}
function Resizen() {
    let n = parseFloat(document.getElementById(`n`).value)
    if (isNaN(n) || n <= 0) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Insira um valor válido para n.`))
        return
    }
    let vetorx = document.getElementById(`vetorx`)
    vetorx.innerHTML = `<p>X[]</p><p>`
    for (let i = 0; i < n; i++) {
        vetorx.innerHTML += `<textarea id="x` + i + `" rows="1" cols="15"></textarea>`
    }
    vetorx.innerHTML += `</p>`
    let Gradiente = document.getElementById(`Grad`)
    Gradiente.innerHTML = `<p>G[]</p>\n<p>`
    for (let i = 0; i < n; i++) {
        Gradiente.innerHTML += `<textarea id="G` + i + `" rows="1" cols="15"></textarea>`
    }
    Gradiente.innerHTML += `</p>`
    let Hessiana = document.getElementById(`Hess`)
    Hessiana.innerHTML = `<p>H[][]</p>`
    for (let i = 0; i < n; i++) {
        Hessiana.innerHTML += `\n<p>`
        for (let j = 0; j < n; j++) {
            Hessiana.innerHTML += `<textarea id="H${i}${j}" rows="1" cols="15"></textarea>`
        }
        Hessiana.innerHTML += `</p>`
    }
}
function Calcularfxn() {
    let n = parseFloat(document.getElementById(`n`).value)
    if (isNaN(n) || n <= 0) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Insira um valor válido para n.`))
        return
    }
    let epsilon = parseFloat(document.getElementById(`epin`).value)
    if (isNaN(epsilon)) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Insira um valor válido para episilon.`))
        return
    }
    let equacao = document.getElementById(`fxn`).value
    equacao = CorrigeEquacao(equacao)

    let aux
    let x = [null]
    for (let i = 0; i < n; i++) {
        aux = parseFloat(document.getElementById(`x`+i).value)
        if (isNaN(aux)) {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Insira um valor válido para x${i+1}.`))
            return
        }
        x.push(aux)
    }
    for (let i = 0; i < n; i++) {
        aux = d1fxn(equacao, x, epsilon, i+1)
        if (isNaN(aux)) {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Insira uma expressão válida.`))
            return
        }
        document.getElementById(`G${i}`).value = `G${i+1}=` + aux
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            aux = d2fxn(equacao, x, epsilon, i+1, j+1)
            if (isNaN(aux)) {
                window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Insira uma expressão válida.`))
                return
            }
            document.getElementById(`H${i}${j}`).value = `H${i+1}${j+1}=` + aux
        }
    }
}
function d1fxn(Equacao, x, erro, i) {
    let h = 0.015625
    x[i] += h
    let p = eval(Equacao)
    x[i] -= 2*h
    p -= eval(Equacao)
    x[i] += h
    p /= (2*h)
    let q = Infinity
    do {
        q = p
        h /= 2
        x[i] += h
        p = eval(Equacao)
        x[i] -= 2*h
        p -= eval(Equacao)
        x[i] += h
        p /= (2*h)
    } while (Math.abs(p-q) > erro)
    return p
}
function d2fxn(Equacao, x, erro, i, j) {
    let h = 0.015625
    let p
    let q
    if (i == j) {
        p = -2*eval(Equacao)
        x[i] += h
        p += eval(Equacao)
        x[i] -= 2*h
        p += eval(Equacao)
        x[i] += h
        p /= h*h
        do {
            q = p
            h /= 2
            p = -2*eval(Equacao)
            x[i] += h
            p += eval(Equacao)
            x[i] -= 2*h
            p += eval(Equacao)
            x[i] += h
            p /= h*h
        } while (Math.abs(p-q) > erro)
        return p
    }
    x[i] += h
    x[j] += h
    p = eval(Equacao)
    x[j] -= 2*h
    p -= eval(Equacao)
    x[i] -= 2*h
    p += eval(Equacao)
    x[j] += 2*h
    p -= eval(Equacao)
    x[i] += h
    x[j] -= h
    p /= (4*h*h)
    do {
        q = p
        h/= 2
        x[i] += h
        x[j] += h
        p = eval(Equacao)
        x[j] -= 2*h
        p -= eval(Equacao)
        x[i] -= 2*h
        p += eval(Equacao)
        x[j] += 2*h
        p -= eval(Equacao)
        x[i] += h
        x[j] -= h
        p /= (4*h*h)
    } while (Math.abs(p-q) > erro)
    return p
}