let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

function calcularPascoa(ano) {
    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(ano, mes - 1, dia);
}

function getFeriados(ano) {
    const pascoa = calcularPascoa(ano);
    const carnaval = new Date(pascoa);
    carnaval.setDate(pascoa.getDate() - 47);
    const sextaFeiraSanta = new Date(pascoa);
    sextaFeiraSanta.setDate(pascoa.getDate() - 2);
    const corpusChristi = new Date(pascoa);
    corpusChristi.setDate(pascoa.getDate() + 60);

    return [
        `${ano}-01-01`,
        `${ano}-04-21`,
        `${ano}-05-01`,
        `${ano}-09-07`,
        `${ano}-10-12`,
        `${ano}-11-02`,
        `${ano}-11-15`,
        `${ano}-12-25`,
        `${ano}-01-25`,
        `${ano}-07-09`,
        carnaval.toISOString().split('T')[0],
        sextaFeiraSanta.toISOString().split('T')[0],
        corpusChristi.toISOString().split('T')[0],
    ];
}

function gerarHorarios(data) {
    const diaSemana = new Date(data).getDay();
    const horarios = [];

    if (diaSemana === 5) {
        for (let hora = 9; hora <= 14; hora++) {
            for (let minuto = 0; minuto < 60; minuto += 30) {
                if (hora === 14 && minuto === 30) break; 
                const horario = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
                horarios.push(horario);
            }
        }
    } else if (diaSemana >= 1 && diaSemana <= 5) {
        for (let hora = 7; hora <= 17; hora++) {
            for (let minuto = 0; minuto < 60; minuto += 30) {
                const horario = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
                horarios.push(horario);
            }
        }
    }
    return horarios;
}

function isFeriado(data) {
    const ano = new Date(data).getFullYear();
    const feriados = getFeriados(ano);
    return feriados.includes(data);
}

if (document.getElementById("loginForm")) {
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("error-message");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "admin" && password === "admin") {
            window.location.href = "admin.html";
        } else if (username === "user" && password === "user") {
            window.location.href = "usuario.html";
        } else {
            errorMessage.textContent = "Usuário ou senha incorretos!";
        }
    });
}

if (document.getElementById("agendamentoForm")) {
    const agendamentoForm = document.getElementById("agendamentoForm");
    const dataInput = document.getElementById("data");
    const horarioSelect = document.getElementById("horario");
    const logoutButton = document.getElementById("logoutButton");

    function atualizarHorarios() {
        const data = dataInput.value;
        const diaSemana = new Date(data).getDay();

        if (diaSemana === 6 || isFeriado(data)) {
            horarioSelect.innerHTML = "<option value=''>Fechado</option>";
            horarioSelect.disabled = true;
        } else {
            const horarios = gerarHorarios(data);
            const horariosAgendados = consultas
                .filter(consulta => consulta.status === "Agendado" && consulta.data === data)
                .map(consulta => consulta.horario);

            horarioSelect.innerHTML = "";
            horarios.forEach(horario => {
                if (!horariosAgendados.includes(horario)) {
                    const option = document.createElement("option");
                    option.value = horario;
                    option.textContent = horario;
                    horarioSelect.appendChild(option);
                }
            });
            horarioSelect.disabled = false;
        }
    }

    dataInput.addEventListener("change", function () {
        atualizarHorarios();
    });

    agendamentoForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const nome = document.getElementById("nome").value;
        const data = document.getElementById("data").value;
        const horario = document.getElementById("horario").value;
        const diaSemana = new Date(data).getDay();

        if (diaSemana === 0 || isFeriado(data)) {
            alert("A clínica não abre em domingos ou feriados!");
            return;
        }

        consultas.push({ nome, data, horario, status: "Agendado" });
        localStorage.setItem("consultas", JSON.stringify(consultas));
        atualizarHorarios();
        agendamentoForm.reset();
    });

    logoutButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });

    atualizarHorarios();
}

if (document.getElementById("lista-consultas")) {
    const listaConsultas = document.getElementById("lista-consultas");
    const logoutButton = document.getElementById("logoutButton");

    function atualizarListaConsultas() {
        listaConsultas.innerHTML = "";
        consultas.forEach((consulta, index) => {
            const li = document.createElement("li");
            li.textContent = `${consulta.nome} - ${consulta.data} às ${consulta.horario} (Status: ${consulta.status})`;
            
            const select = document.createElement("select");
            select.innerHTML = `
                <option value="Agendado" ${consulta.status === "Agendado" ? "selected" : ""}>Agendado</option>
                <option value="Concluído" ${consulta.status === "Concluído" ? "selected" : ""}>Concluído</option>
                <option value="Cancelado" ${consulta.status === "Cancelado" ? "selected" : ""}>Cancelado</option>
            `;
            select.addEventListener("change", function () {
                consultas[index].status = this.value;
                localStorage.setItem("consultas", JSON.stringify(consultas));
                atualizarListaConsultas();
            });
            li.appendChild(select);
            listaConsultas.appendChild(li);
        });
    }

    logoutButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });

    atualizarListaConsultas();
}