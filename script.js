document.addEventListener('DOMContentLoaded', () => {
    // ===================================
    // CONFIGURACIÓN INICIAL Y CONSTANTES
    // ===================================
    const WHATSAPP_NUMBER = '59160714251';

    AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
        easing: 'ease-out-quad',
    });

    console.log("NEUROFISI•K Landing Page cargada.");

    // ===================================
    // LÓGICA DEL MENÚ DE NAVEGACIÓN
    // ===================================
    const nav = document.querySelector('.main-nav');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // ===================================
    // LÓGICA DE MODALES
    // ===================================

    // --- Modal de Imágenes ---
    const treatmentItems = document.querySelectorAll('.treatment-item[data-modal-img]');
    const imageModal = document.getElementById('image-modal');
    const imageModalImg = imageModal?.querySelector('.modal-img');
    const imageModalOverlay = imageModal?.querySelector('.modal-overlay');

    function closeImageModal() {
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (imageModal && imageModalImg && imageModalOverlay) {
        treatmentItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.getAttribute('data-modal-img');
                if (imgSrc) {
                    imageModalImg.setAttribute('src', `${imgSrc}?v=${new Date().getTime()}`);
                    imageModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        imageModalOverlay.addEventListener('click', closeImageModal);
    }

    // --- Modal de Oferta ---
    const offerModal = document.getElementById('offer-modal');
    const openOfferBtn = document.getElementById('open-offer-modal-btn');
    const offerModalOverlay = offerModal?.querySelector('.modal-overlay');
    const closeOfferBtn = offerModal?.querySelector('.close-btn');

    function closeOfferModal() {
        offerModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (offerModal && openOfferBtn && offerModalOverlay && closeOfferBtn) {
        openOfferBtn.addEventListener('click', () => {
            offerModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        offerModalOverlay.addEventListener('click', closeOfferModal);
        closeOfferBtn.addEventListener('click', closeOfferModal);
    }

    // Cierre de modales con la tecla 'Escape'
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (imageModal?.classList.contains('active')) closeImageModal();
            if (offerModal?.classList.contains('active')) closeOfferModal();
        }
    });

    // ===================================
    // LÓGICA DE FORMULARIOS
    // ===================================

    // --- Función para validar fechas (evitar Domingos) ---
    function preventSundays(dateInput) {
        if (!dateInput) return;
        dateInput.addEventListener('input', (e) => {
            const dateValue = e.target.value;
            const selectedDate = new Date(`${dateValue}T00:00:00Z`);
            if (selectedDate.getUTCDay() === 0) {
                alert('Lo sentimos, no atendemos los domingos. Por favor, selecciona otro día.');
                e.target.value = '';
            }
        });
    }

    // --- Función genérica para enviar formularios a WhatsApp ---
    function setupFormToWhatsapp(formId, messageBuilder, afterSubmit) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            const message = messageBuilder(data);
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');

            if (afterSubmit) afterSubmit(form);
        });
    }

    // --- Configuración del formulario de Oferta ---
    setupFormToWhatsapp('offer-form', (data) => {
        const attendanceSelect = document.getElementById('offer-attendance');
        const attendanceText = attendanceSelect.options[attendanceSelect.selectedIndex].text;
        return `¡Hola, NEUROFISI•K! 😊\n\nSolicito la *OFERTA ESPECIAL 2X1* (Hidroterapia + Masaje Relajante). Por favor, revisen mi solicitud:\n\n* Nombre: ${data['offer-name']}\n* Teléfono: ${data['offer-phone']}\n* Email: ${data['offer-email'] || 'No especificado'}\n* Fecha Deseada: ${data['offer-date']}\n* Hora Preferida: ${data['offer-time']}\n* Asistencia: ${attendanceText}\n\nAgradezco me confirmen la disponibilidad ¡Gracias!`;
    }, () => closeOfferModal());

    // --- Configuración del formulario de Contacto Principal ---
    setupFormToWhatsapp('main-contact-form', (data) => {
        const timeSelect = document.getElementById('appointment-time');
        const timeText = timeSelect.options[timeSelect.selectedIndex].text;
        const therapySelect = document.getElementById('therapy-type');
        const therapyText = therapySelect.options[therapySelect.selectedIndex].text;
        return `¡Hola, NEUROFISI•K! 😊\n\nQuiero agendar una cita. Por favor, revisen mi solicitud:\n\n* Nombre: ${data.name}\n* Teléfono: ${data.phone}\n* Email: ${data.email || 'No especificado'}\n* Fecha Deseada: ${data['appointment-date']}\n* Hora Preferida: ${timeText}\n* Terapia de Interés: ${therapyText}\n* Problema: ${data.message}\n\nAgradezco que me confirmen la disponibilidad ¡Gracias!`;
    }, (form) => form.reset());

    // Aplicar validación de domingos a los campos de fecha
    preventSundays(document.getElementById('offer-date'));
    preventSundays(document.getElementById('appointment-date'));

    // ===================================
    // LÓGICA DEL CHATBOT
    // ===================================
    const toggleBtn = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatBody = document.getElementById('chat-body');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('chatbot-send');

    if (toggleBtn && chatbotContainer && chatBody && userInput && sendBtn) {
        const chatbotState = {
            step: 0,
            patient: {},
            initiated: false,
        };

        const addMessage = (text, sender = 'bot') => {
            const msg = document.createElement('div');
            msg.className = sender;
            msg.innerHTML = text; // Usamos innerHTML para poder renderizar HTML
            chatBody.appendChild(msg);
            chatBody.scrollTop = chatBody.scrollHeight;
        };

        const startChat = () => {
            addMessage('¡Hola! 👋 Soy Calí, tu asistente de NEUROFISI•K. ¿Podrías decirme tu nombre?');
            chatbotState.initiated = true;
        };

        const handleResponse = (text) => {
            switch (chatbotState.step) {
                case 0:
                    chatbotState.patient.name = text;
                    addMessage(`Encantado/a, ${text}. 😊 ¿Podrías contarme brevemente el motivo de tu consulta?`);
                    chatbotState.step++;
                    break;
                case 1:
                    chatbotState.patient.reason = text;
                    addMessage(`Perfecto. Ahora selecciona la fecha y hora que prefieras para tu cita.`);
                    showCalendar();
                    chatbotState.step++;
                    break;
                case 2: // Esperando la confirmación del calendario
                    const { name, reason, date, time } = chatbotState.patient;
                    addMessage(`✅ Tu cita ha sido registrada para el ${date} a las ${time}. Motivo: ${reason}. ¡Te esperamos, ${name}! 💙`);
                    chatbotState.step++; // Finaliza la conversación
                    break;
            }
        };

        const showCalendar = () => {
            const calendarHTML = `
                <div id="calendar-form" class="bot">
                    <label>📅 Fecha:</label><br>
                    <input type="date" id="chatbot-date"><br>
                    <label>🕐 Hora:</label><br>
                    <input type="time" id="chatbot-time"><br>
                    <button id="confirm-appointment-btn">Confirmar cita</button>
                </div>`;
            addMessage(calendarHTML);
            preventSundays(document.getElementById('chatbot-date'));
        };

        const confirmAppointment = () => {
            const dateInput = document.getElementById('chatbot-date');
            const timeInput = document.getElementById('chatbot-time');
            if (!dateInput.value || !timeInput.value) {
                addMessage("⚠️ Por favor selecciona una fecha y hora válidas.", 'bot');
                return;
            }
            chatbotState.patient.date = dateInput.value;
            chatbotState.patient.time = timeInput.value;
            document.getElementById('calendar-form').remove();
            addMessage(`Cita para el ${dateInput.value} a las ${timeInput.value}`, 'user');
            setTimeout(() => handleResponse(""), 800);
        };

        const sendMessage = () => {
            const text = userInput.value.trim();
            if (!text) return;
            addMessage(text, 'user');
            userInput.value = '';
            setTimeout(() => handleResponse(text), 800);
        };

        toggleBtn.addEventListener('click', () => {
            const isVisible = chatbotContainer.style.display === 'flex';
            chatbotContainer.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible && !chatbotState.initiated) {
                startChat();
            }
        });

        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Delegación de eventos para el botón del calendario
        chatBody.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'confirm-appointment-btn') {
                confirmAppointment();
            }
        });
    }
});