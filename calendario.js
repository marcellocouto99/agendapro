class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        
        this.monthNames = [
            'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
            'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.renderCalendar();
        this.initTimeSlots();
    }
    
    bindEvents() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
    }
    
    renderCalendar() {
        const monthYear = document.getElementById('monthYear');
        const calendarGrid = document.getElementById('calendarGrid');

        // Atualiza mês/ano
        monthYear.textContent = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        calendarGrid.innerHTML = '';

        const ano = this.currentDate.getFullYear();
        const mes = this.currentDate.getMonth();

        const primeiroDia = new Date(ano, mes, 1);
        const ultimoDia = new Date(ano, mes + 1, 0);
        const qtdDias = ultimoDia.getDate();
        const diaSemana = primeiroDia.getDay();

        // Dias do mês anterior
        for (let i = diaSemana - 1; i >= 0; i--) {
            const diaAnt = new Date(ano, mes, -i).getDate();
            const dayElement = this.createDayElement(diaAnt, true);
            calendarGrid.appendChild(dayElement);
        }

        // Dias do mês atual
        for (let dia = 1; dia <= qtdDias; dia++) {
            const dayElement = this.createDayElement(dia, false);
            calendarGrid.appendChild(dayElement);
        }

        // Dias do próximo mês para completar
        const totalCelulas = diaSemana + qtdDias;
        const proximos = 7 - (totalCelulas % 7);
        if (proximos < 7) {
            for (let i = 1; i <= proximos; i++) {
                const dayElement = this.createDayElement(i, true);
                calendarGrid.appendChild(dayElement);
            }
        }

        this.highlightToday();
    }
    
    createDayElement(day, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${isOtherMonth ? 'other-month' : ''}`;
        dayElement.textContent = day;
        
        if (!isOtherMonth) {
            dayElement.addEventListener('click', () => {
                this.selectDate(day);
            });
        }
        
        return dayElement;
    }
    
    selectDate(day) {
        // Remove seleção anterior
        const previousSelected = document.querySelector('.calendar-day.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }

        // Marca novo dia
        const dayElements = document.querySelectorAll('.calendar-day:not(.other-month)');
        dayElements.forEach(element => {
            if (element.textContent == day) {
                element.classList.add('selected');
                this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            }
        });

        // Mostra horários
        const timeSection = document.getElementById('timeSection');
        if (timeSection) {
            timeSection.classList.add('show');
        }

        // Simulação de agendamentos
        const agendamentos = {
          "0900": { nome: "Mário", placa: "PAI-1953", loja: "Toyota" },
          "1400": { nome: "Marcello", placa: "JFV-9097", loja: "Jeep" }
        };

        // Atualiza status de cada horário
        document.querySelectorAll('.status-box').forEach(box => {
            const hora = box.id.replace("status-", ""); // ex: "0900"
            if (agendamentos[hora]) {
                const dados = agendamentos[hora];
                box.textContent = `${dados.nome} - ${dados.placa} (${dados.loja})`;
            } else {
                box.textContent = "Livre";
            }
        });
    }
    
    highlightToday() {
        const today = new Date();
        if (today.getMonth() === this.currentDate.getMonth() && 
            today.getFullYear() === this.currentDate.getFullYear()) {
            
            const dayElements = document.querySelectorAll('.calendar-day:not(.other-month)');
            dayElements.forEach(element => {
                if (element.textContent == today.getDate()) {
                    element.style.border = '2px solid #ffd700';
                }
            });
        }
    }
    
    initTimeSlots() {
        const timeSlots = document.querySelectorAll('.time-slot');
        
        timeSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                const previousSelected = document.querySelector('.time-slot.selected');
                if (previousSelected) {
                    previousSelected.classList.remove('selected');
                }
                slot.classList.add('selected');
                this.selectedTime = slot.dataset.time;
                this.showSelectionFeedback();
            });
        });
    }
    
    showSelectionFeedback() {
        if (this.selectedDate && this.selectedTime) {
            const dateStr = this.selectedDate.toLocaleDateString('pt-BR');
            console.log(`Data selecionada: ${dateStr} às ${this.selectedTime}`);
        }
    }
}

// Inicializa
document.addEventListener('DOMContentLoaded', () => {
    const calendar = new Calendar();
    window.calendar = calendar;    
});

// Ripple
document.addEventListener('click', (e) => {
  const dayEl = e.target.closest('.calendar-day');
  if (!dayEl || dayEl.classList.contains('other-month')) return;

  const rect = dayEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const size = Math.ceil(Math.max(rect.width, rect.height) * 1.5);

  dayEl.style.setProperty('--ripple-x', `${x}px`);
  dayEl.style.setProperty('--ripple-y', `${y}px`);
  dayEl.style.setProperty('--ripple-size', `${size}px`);

  dayEl.classList.remove('ripple-anim');
  void dayEl.offsetWidth;
  dayEl.classList.add('ripple-anim');
});
