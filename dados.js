document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("pitstopDadosForm");
    const confirmButton = form.querySelector(".pitstop-confirm-button");

    const nomeInput = document.getElementById("pitstopNome");
    const placaInput = document.getElementById("pitstopPlaca");
    const lojaSelect = document.getElementById("pitstopLoja");

    // 🔹 Função que valida os campos
    function validarFormulario() {
        const nome = nomeInput.value.trim();
        const placa = placaInput.value.trim();
        const loja = lojaSelect.value;
        const selected = window.calendar.getSelectedDateTime();

        const valido = nome && placa && loja && selected;
        confirmButton.disabled = !valido; // habilita/desabilita botão
    }

    // 🔹 Observa alterações nos inputs
    nomeInput.addEventListener("input", validarFormulario);
    placaInput.addEventListener("input", validarFormulario);
    lojaSelect.addEventListener("change", validarFormulario);

    // 🔹 Também observa clique em dias/horários (vem do script.js)
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("calendar-day") || e.target.classList.contains("time-slot")) {
            setTimeout(validarFormulario, 100); // dá um tempinho pro script.js atualizar
        }

        // 🔹 Máscara para placa
placaInput.addEventListener("input", () => {
    let valor = placaInput.value.toUpperCase(); // sempre em maiúsculas

    // Remove caracteres inválidos (só letras, números e hífen)
    valor = valor.replace(/[^A-Z0-9-]/g, "");

    // Garante formato ABC-123 ou ABC-1A23
    if (valor.length > 3 && valor[3] !== "-") {
        valor = valor.slice(0, 3) + "-" + valor.slice(3);
    }

    // Máximo 8 caracteres (AAA-1234 ou AAA-1A23)
    valor = valor.slice(0, 8);

    placaInput.value = valor;
});
    });

    // 🔹 Submit final
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nome = nomeInput.value.trim();
        const placa = placaInput.value.trim();
        const loja = lojaSelect.value;
        const selected = window.calendar.getSelectedDateTime();

        if (!selected) {
            alert("⚠️ Selecione uma data e um horário.");
            return;
        }

        const agendamento = {
            nome,
            placa,
            loja,
            data: selected.date,
            horario: selected.time,
            dataHora: selected.formatted
        };

        console.log("✅ Agendamento pronto:", agendamento);
            alert("✅ Agendamento confirmado com sucesso!");

    // Se quiser, já limpa o formulário e desativa o botão:
    form.reset();
    confirmButton.disabled = true;
});

        // 🔹 Aqui você salva no Firebase
        /*
        firebase.firestore().collection("agendamentos").add(agendamento)
          .then(() => {
              alert("✅ Agendamento confirmado com sucesso!");
              form.reset();
              confirmButton.disabled = true; // bloqueia novamente até preencher tudo
          })
          .catch(error => {
              console.error("Erro ao salvar agendamento:", error);
              alert("❌ Erro ao salvar, tente novamente.");
          });
        */

    // 🔹 Inicializa botão desativado
    confirmButton.disabled = true;
});
