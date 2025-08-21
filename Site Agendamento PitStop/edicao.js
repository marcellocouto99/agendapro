document.addEventListener('DOMContentLoaded', () => {
    let appointments = [
        { id: 1, name: 'João Silva', plate: 'ABC-1234', store: 'Jeep', date: '2025-08-22', time: '10:00' },
        { id: 2, name: 'Maria Souza', plate: 'DEF-5678', store: 'Fiat', date: '2025-08-22', time: '11:00' },
        { id: 3, name: 'Carlos Pereira', plate: 'GHI-9012', store: 'Seminovos', date: '2025-08-23', time: '14:00' },
        { id: 4, name: 'Ana Costa', plate: 'JKL-3456', store: 'Nissan', date: '2025-08-23', time: '15:00' },
        { id: 5, name: 'Pedro Santos', plate: 'MNO-7890', store: 'Toyota', date: '2025-08-24', time: '09:00' },
        { id: 6, name: 'Lucia Oliveira', plate: 'PQR-2468', store: 'Jeep', date: '2025-08-24', time: '16:00' }
    ];

    const appointmentsTableBody = document.querySelector('#appointmentsTable tbody');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const closeModal = document.querySelector('.close');
    const cancelBtn = document.querySelector('.cancel-btn');
    
    let currentEditingId = null;

    function renderAppointments(filter = '') {
        appointmentsTableBody.innerHTML = '';
        const filteredAppointments = appointments.filter(appointment => {
            const lowerCaseFilter = filter.toLowerCase();
            return appointment.name.toLowerCase().includes(lowerCaseFilter) ||
                   appointment.plate.toLowerCase().includes(lowerCaseFilter) ||
                   appointment.store.toLowerCase().includes(lowerCaseFilter);
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
                <td>${formatDate(appointment.date)}</td>
                <td>${appointment.time}</td>
                <td class="actions">
                    <button class="edit-btn" data-id="${appointment.id}">Editar</button>
                    <button class="delete-btn" data-id="${appointment.id}">Apagar</button>
                </td>
            `;
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('pt-BR');
    }

    function openEditModal(appointmentId) {
        const appointment = appointments.find(app => app.id === appointmentId);
        if (!appointment) return;

        currentEditingId = appointmentId;
        document.getElementById('editName').value = appointment.name;
        document.getElementById('editPlate').value = appointment.plate;
        document.getElementById('editStore').value = appointment.store;
        document.getElementById('editDate').value = appointment.date;
        document.getElementById('editTime').value = appointment.time;
        
        editModal.style.display = 'block';
    }

    function closeEditModal() {
        editModal.style.display = 'none';
        currentEditingId = null;
        editForm.reset();
    }

    function saveAppointment(formData) {
        const appointmentIndex = appointments.findIndex(app => app.id === currentEditingId);
        if (appointmentIndex !== -1) {
            appointments[appointmentIndex] = {
                ...appointments[appointmentIndex],
                name: formData.get('name'),
                plate: formData.get('plate'),
                store: formData.get('store'),
                date: formData.get('date'),
                time: formData.get('time')
            };
            renderAppointments(searchInput.value);
            closeEditModal();
            alert('Agendamento atualizado com sucesso!');
        }
    }

    function deleteAppointment(appointmentId) {
        const appointment = appointments.find(app => app.id === appointmentId);
        if (!appointment) return;

        if (confirm(`Tem certeza que deseja apagar o agendamento de ${appointment.name}?`)) {
            appointments = appointments.filter(app => app.id !== appointmentId);
            renderAppointments(searchInput.value);
            alert('Agendamento removido com sucesso!');
        }
    }

    // Initial render
    renderAppointments();

    // Search functionality
    searchButton.addEventListener('click', () => {
        renderAppointments(searchInput.value);
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            renderAppointments(searchInput.value);
        }
    });

    // Real-time search as user types
    searchInput.addEventListener('input', () => {
        renderAppointments(searchInput.value);
    });

    // Edit and Delete functionality (event delegation)
    appointmentsTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const id = parseInt(event.target.dataset.id);
            openEditModal(id);
        } else if (event.target.classList.contains('delete-btn')) {
            const id = parseInt(event.target.dataset.id);
            deleteAppointment(id);
        }
    });

    // Modal functionality
    closeModal.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeEditModal();
        }
    });

    // Form submission
    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(editForm);
        saveAppointment(formData);
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && editModal.style.display === 'block') {
            closeEditModal();
        }
    });
});


