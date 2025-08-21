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
        // Month navigation
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

    // Limpa grid anterior
    calendarGrid.innerHTML = '';

    const ano = this.currentDate.getFullYear();
    const mes = this.currentDate.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const qtdDias = ultimoDia.getDate();
    const diaSemana = primeiroDia.getDay(); // 0 = domingo

    // --- dias do mês anterior ---
    for (let i = diaSemana - 1; i >= 0; i--) {
        const diaAnt = new Date(ano, mes, -i).getDate();
        const dayElement = this.createDayElement(diaAnt, true);
        calendarGrid.appendChild(dayElement);
    }

    // --- dias do mês atual ---
    for (let dia = 1; dia <= qtdDias; dia++) {
        const dayElement = this.createDayElement(dia, false);
        calendarGrid.appendChild(dayElement);
    }

    // --- dias do mês seguinte ---
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
        const dataAtual = new Date();
        const dataDoDia = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);

        if (dataDoDia < new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate())) {
            // Dia no passado → desabilita
            dayElement.classList.add('disabled');
        } else {
            // Só permite clique em dias atuais ou futuros
            dayElement.addEventListener('click', () => {
                this.selectDate(day);
            });
        }
    }

    return dayElement;
}

    
selectDate(day) {
    // Remove seleção anterior
    const previousSelected = document.querySelector('.calendar-day.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }

    // Marca o novo dia
    const dayElements = document.querySelectorAll('.calendar-day:not(.other-month)');
    dayElements.forEach(element => {
        if (element.textContent == day) {
            element.classList.add('selected');
            this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        }
    });

    // 👉 Mostra a seção de horários
    const timeSection = document.getElementById('timeSection');
    if (timeSection) {
        timeSection.classList.add('show');
    }
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
                // Remove previous selection
                const previousSelected = document.querySelector('.time-slot.selected');
                if (previousSelected) {
                    previousSelected.classList.remove('selected');
                }
                
                // Add selection to clicked slot
                slot.classList.add('selected');
                this.selectedTime = slot.dataset.time;
                
                // Show selection feedback
                this.showSelectionFeedback();
            });
        });
    }
    
    showSelectionFeedback() {
        if (this.selectedDate && this.selectedTime) {
            const dateStr = this.selectedDate.toLocaleDateString('pt-BR');
            console.log(`Data selecionada: ${dateStr} às ${this.selectedTime}`);
            
            // You can add a visual feedback here, like a toast notification
            // or update a display element showing the selected date and time
        }
    }
    
    getSelectedDateTime() {
        if (this.selectedDate && this.selectedTime) {
            return {
                date: this.selectedDate,
                time: this.selectedTime,
                formatted: `${this.selectedDate.toLocaleDateString('pt-BR')} às ${this.selectedTime}`
            };
        }
        return null;
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calendar = new Calendar();
    
    // Make calendar globally accessible for debugging
    window.calendar = calendar;    
});

// Ripple ao clicar
document.addEventListener('click', (e) => {
  const dayEl = e.target.closest('.calendar-day');
  if (!dayEl) return;
  if (dayEl.classList.contains('other-month')) return;

  // Pega posição relativa do clique
  const rect = dayEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Calcula tamanho do círculo
  const size = Math.ceil(Math.max(rect.width, rect.height) * 1.5);

  // Passa variáveis para o CSS
  dayEl.style.setProperty('--ripple-x', `${x}px`);
  dayEl.style.setProperty('--ripple-y', `${y}px`);
  dayEl.style.setProperty('--ripple-size', `${size}px`);

  // Reinicia a animação
  dayEl.classList.remove('ripple-anim');
  void dayEl.offsetWidth; // força reflow (necessário p/ reiniciar animação)
  dayEl.classList.add('ripple-anim');
});

