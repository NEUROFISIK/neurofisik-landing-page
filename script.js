document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,     // Duración de la animación en ms
        once: true,         // Las animaciones solo ocurren una vez
        mirror: false,      // Si las animaciones deben repetirse al volver a hacer scroll
        easing: 'ease-out-quad', // Tipo de curva de animación
    });

    console.log("NEUROFISI•K Landing Page cargada con animaciones y carrusel.");

    // 4. LÓGICA DEL MENÚ DE NAVEGACIÓN
    const nav = document.querySelector('.main-nav');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Efecto de scroll en el nav
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Menú hamburguesa
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Cambiar ícono de hamburguesa a 'X' y viceversa
        const icon = hamburger.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });

    // 6. LÓGICA DEL MODAL DE IMÁGENES
    const treatmentItems = document.querySelectorAll('.treatment-item[data-modal-img]');
    const modal = document.getElementById('image-modal');
    const modalImg = modal.querySelector('.modal-img');
    const modalOverlay = modal.querySelector('.modal-overlay');

    treatmentItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-modal-img');
            if (imgSrc) {
                // Añadimos un timestamp para evitar problemas de caché (cache busting)
                const cacheBustedSrc = `${imgSrc}?v=${new Date().getTime()}`;
                modalImg.setAttribute('src', cacheBustedSrc);
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
            }
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaura el scroll
    }

    // Cierra el modal solo si se hace clic en el fondo oscuro (overlay)
    modalOverlay.addEventListener('click', closeModal);

    // Cierra el modal con la tecla 'Escape'
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // 7. LÓGICA DEL MODAL DE OFERTA
    const offerModal = document.getElementById('offer-modal');
    const openOfferBtn = document.getElementById('open-offer-modal-btn');
    const offerModalOverlay = offerModal.querySelector('.modal-overlay');
    const closeOfferBtn = offerModal.querySelector('.close-btn');
    const offerDateInput = document.getElementById('offer-date');
    const mainDateInput = document.getElementById('appointment-date'); // Campo de fecha del form principal
    const offerForm = document.getElementById('offer-form');

    function openOfferModal() {
        offerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeOfferModal() {
        offerModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (openOfferBtn) {
        openOfferBtn.addEventListener('click', openOfferModal);
    }
    if (offerModalOverlay) {
        offerModalOverlay.addEventListener('click', closeOfferModal);
    }
    if (closeOfferBtn) {
        closeOfferBtn.addEventListener('click', closeOfferModal);
    }

    // --- LÓGICA PARA VALIDAR FECHAS (EVITAR DOMINGOS) ---
    function preventSundays(dateInput) {
        if (!dateInput) return;

        dateInput.addEventListener('input', (e) => {
            const dateValue = e.target.value;
            // Para evitar problemas de zona horaria, creamos la fecha en UTC
            const selectedDate = new Date(`${dateValue}T00:00:00Z`);
            if (selectedDate.getUTCDay() === 0) { // 0 es Domingo en UTC
                alert('Lo sentimos, no atendemos los domingos. Por favor, selecciona otro día.');
                e.target.value = ''; // Limpiamos el campo
            }
        });
    }

    // Aplicar la validación a todos los campos de fecha
    preventSundays(offerDateInput);
    preventSundays(mainDateInput);

    // Enviar formulario de oferta a WhatsApp
    if (offerForm) {
        offerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir el envío normal del formulario

            // Recoger los datos del formulario de la oferta
            const name = document.getElementById('offer-name').value;
            const phone = document.getElementById('offer-phone').value;
            const email = document.getElementById('offer-email').value || 'No especificado';
            const attendanceSelect = document.getElementById('offer-attendance');
            const attendance = attendanceSelect.options[attendanceSelect.selectedIndex].text;
            const date = document.getElementById('offer-date').value;
            const time = document.getElementById('offer-time').value;

            // Crear el mensaje para WhatsApp
            const message = `¡Hola, NEUROFISI•K! 😊\n\nSolicito la *OFERTA ESPECIAL 2X1* (Hidroterapia + Masaje Relajante). Por favor, revisen mi solicitud:\n\n* Nombre: ${name}\n* Teléfono: ${phone}\n* Email: ${email}\n* Fecha Deseada: ${date}\n* Hora Preferida: ${time}\n* Asistencia: ${attendance}\n\nAgradezco me confirmen la disponibilidad ¡Gracias!`;

            // Codificar el mensaje para la URL
            const encodedMessage = encodeURIComponent(message);

            // Número de teléfono de destino
            const whatsappNumber = '59160714251';

            // Crear la URL de WhatsApp y abrirla en una nueva pestaña
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');

            closeOfferModal(); // Cierra el modal después de generar el enlace
        });
    }

    // Enviar formulario de contacto principal a WhatsApp
    const mainContactForm = document.getElementById('main-contact-form');
    if (mainContactForm) {
        mainContactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir el envío normal del formulario

            // Recoger los datos del formulario principal
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value || 'No especificado';
            const date = document.getElementById('appointment-date').value;
            const timeSelect = document.getElementById('appointment-time');
            const time = timeSelect.options[timeSelect.selectedIndex].text;
            const therapySelect = document.getElementById('therapy-type');
            const therapy = therapySelect.options[therapySelect.selectedIndex].text;
            const problem = document.getElementById('message').value;

            // Crear el mensaje para WhatsApp
            const message = `¡Hola, NEUROFISI•K! 😊\n\nQuiero agendar una cita. Por favor, revisen mi solicitud:\n\n* Nombre: ${name}\n* Teléfono: ${phone}\n* Email: ${email}\n* Fecha Deseada: ${date}\n* Hora Preferida: ${time}\n* Terapia de Interés: ${therapy}\n* Problema: ${problem}\n\nAgradezco que me confirmen la disponibilidad ¡Gracias!`;

            // Codificar el mensaje para la URL
            const encodedMessage = encodeURIComponent(message);

            // Número de teléfono de destino
            const whatsappNumber = '59160714251';

            // Crear la URL de WhatsApp y abrirla en una nueva pestaña
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');

            mainContactForm.reset(); // Limpia el formulario después de generar el enlace
        });
    }

    // 3. LÓGICA DEL CHATBOT
    const toggleBtn = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatBody = document.getElementById('chat-body');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('chatbot-send');

    let step = 0;
    let patient = {};
    let chatInitiated = false;

    toggleBtn.addEventListener('click', () => {
        const isVisible = chatbotContainer.style.display === 'flex';
        chatbotContainer.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible && !chatInitiated) {
            startChat();
        }
    });

    function startChat() {
        addMessage('¡Hola! 👋 Soy Calí, tu asistente de NEUROFISI•K. ¿Podrías decirme tu nombre?');
        chatInitiated = true;
    }

    function addMessage(text, sender = 'bot') {
        const msg = document.createElement('div');
        msg.className = sender;
        msg.textContent = text;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleResponse(text) {
        if (step === 0) {
            patient.name = text;
            addMessage(`Encantado/a, ${text}. 😊 ¿Podrías contarme brevemente el motivo de tu consulta?`);
            step++;
        } else if (step === 1) {
            patient.reason = text;
            addMessage(`Perfecto. Ahora selecciona la fecha y hora que prefieras para tu cita.`);
            showCalendar();
            step++;
        } else if (step === 3) {
            addMessage(`✅ Tu cita ha sido registrada para el ${patient.date} a las ${patient.time}. Motivo: ${patient.reason}. ¡Te esperamos, ${patient.name}! 💙`);
        }
    }

    function showCalendar() {
        const calendarDiv = document.createElement('div');
        calendarDiv.id = 'calendar';
        calendarDiv.innerHTML = `
        <label>📅 Fecha:</label><br>
        <input type="date" id="date"><br>
        <label>🕐 Hora:</label><br>
        <input type="time" id="time"><br>
        <button id="confirm-appointment-btn">Confirmar cita</button>
      `;
        chatBody.appendChild(calendarDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        // Aplicar la validación de domingos al calendario del chatbot
        preventSundays(document.getElementById('date'));
        document.getElementById('confirm-appointment-btn').addEventListener('click', confirmAppointment);
    }

    function confirmAppointment() {
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        if (!date || !time) {
            addMessage("⚠️ Por favor selecciona una fecha y hora válidas.");
            return;
        }
        patient.date = date;
        patient.time = time;
        document.getElementById('calendar').remove();
        step = 3;
        setTimeout(() => handleResponse(""), 800); // Pasamos un texto vacío para que entre en la última condición
    }

    function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;
        addMessage(text, 'user');
        userInput.value = '';
        setTimeout(() => handleResponse(text), 800);
    }

    sendBtn.addEventListener('click', () => {
        sendMessage();
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendBtn.click();
    });
});