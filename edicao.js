document.addEventListener('DOMContentLoaded', () => {
    const appointmentsTableBody = document.querySelector('#appointmentsTable tbody');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const closeModal = document.querySelector('.close');
    const cancelBtn = document.querySelector('.cancel-btn');
    
    let currentEditingId = null;
    let appointments = []; // agora vem só do Firestore

    // === CARREGAR AGENDAMENTOS DO FIRESTORE ===
    async function loadAppointments() {
        appointmentsTableBody.innerHTML = "<tr><td colspan='6'>Carregando...</td></tr>";

        // Puxa já ordenado por data e depois hora
        const snap = await getDocs(
            query(collection(db, "agendamentos"),
                orderBy("dateISO", "asc"),
                orderBy("time", "asc")
            )
        );

        appointments = [];
        snap.forEach(docSnap => {
            appointments.push({ id: docSnap.id, ...docSnap.data() });
        });

        renderAppointments(searchInput.value);
    }

    function renderAppointments(filter = '') {
        appointmentsTableBody.innerHTML = '';
        const filteredAppointments = appointments.filter(appointment => {
            const lowerCaseFilter = filter.toLowerCase();
            return (appointment.name || "").toLowerCase().includes(lowerCaseFilter) ||
                   (appointment.plate || "").toLowerCase().includes(lowerCaseFilter) ||
                   (appointment.store || "").toLowerCase().includes(lowerCaseFilter);
        });

        if (filteredAppointments.length === 0) {
            const row = appointmentsTableBody.insertRow();
            row.innerHTML = '<td colspan="6" style="text-align: center; color: #666;">Nenhum agendamento encontrado</td>';
            return;
        }

        filteredAppointments.forEach(appointment => {
            const row = appointmentsTableBody.insertRow();
            row.innerHTML = `
                <td>${appointment.name}</td>
                <td>${appointment.plate}</td>
                <td>${appointment.store}</td>
                <td>${formatDate(appointment.dateISO)}</td>
                <td>${formatTime(appointment.time)}</td>
                <td class="actions">
                    <button class="edit-btn" data-id="${appointment.id}">Editar</button>
                    <button class="delete-btn" data-id="${appointment.id}">Apagar</button>
                </td>
            `;
        });
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('pt-BR');
    }

    function formatTime(timeString) {
        if (!timeString) return "";
        return timeString.slice(0,2) + ":" + timeString.slice(2);
    }

    // Modal edição
    function openEditModal(appointmentId) {
        const appointment = appointments.find(app => app.id === appointmentId);
        if (!appointment) return;

        currentEditingId = appointmentId;
        document.getElementById('editName').value = appointment.name;
        document.getElementById('editPlate').value = appointment.plate;
        document.getElementById('editStore').value = appointment.store;
        document.getElementById('editDate').value = appointment.dateISO;
        document.getElementById('editTime').value = appointment.time;
        
        editModal.style.display = 'block';
    }

    function closeEditModal() {
        editModal.style.display = 'none';
        currentEditingId = null;
        editForm.reset();
    }

    async function saveAppointment(formData) {
        if (!currentEditingId) return;
        const docRef = doc(db, "agendamentos", currentEditingId);

        await updateDoc(docRef, {
            name: formData.get('name'),
            plate: formData.get('plate').toUpperCase(),
            store: formData.get('store'),
            dateISO: formData.get('date'),
            time: formData.get('time')
        });

        closeEditModal();
        await loadAppointments();
        alert("Agendamento atualizado com sucesso!");
    }

    async function deleteAppointment(appointmentId) {
        const appointment = appointments.find(app => app.id === appointmentId);
        if (!appointment) return;

        if (confirm(`Tem certeza que deseja apagar o agendamento de ${appointment.name}?`)) {
            await deleteDoc(doc(db, "agendamentos", appointmentId));
            await loadAppointments();
            alert("Agendamento removido com sucesso!");
        }
    }

    // === Eventos ===
    searchButton.addEventListener('click', () => {
        renderAppointments(searchInput.value);
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            renderAppointments(searchInput.value);
        }
    });

    searchInput.addEventListener('input', () => {
        renderAppointments(searchInput.value);
    });

    appointmentsTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            openEditModal(event.target.dataset.id);
        } else if (event.target.classList.contains('delete-btn')) {
            deleteAppointment(event.target.dataset.id);
        }
    });

    closeModal.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);

    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeEditModal();
        }
    });

    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(editForm);
        saveAppointment(formData);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && editModal.style.display === 'block') {
            closeEditModal();
        }
    });

    // === Inicialização ===
    loadAppointments();
});
