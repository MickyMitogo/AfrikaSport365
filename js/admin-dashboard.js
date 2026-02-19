/**
 * Admin Dashboard Script
 * Maneja navegación, autenticación y secciones del dashboard
 */

(function () {
    'use strict';

    // Verificar sesión
    function checkSession() {
        const session = localStorage.getItem('adminSession');
        if (!session) {
            window.location.href = 'admin-login.html';
            return;
        }

        const sessionData = JSON.parse(session);
        document.getElementById('adminUsername').textContent = sessionData.user;
    }

    // Manejar navegación entre secciones
    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');
        const sectionTitle = document.getElementById('sectionTitle');
        const sectionSubtitle = document.getElementById('sectionSubtitle');
        const sidebar = document.getElementById('adminSidebar');

        const sectionTitles = {
            dashboard: { title: 'Dashboard', subtitle: 'Bienvenido al panel de administración' },
            noticias: { title: 'Gestionar Noticias', subtitle: 'Administra las noticias del portal' },
            'ultima-hora': { title: 'Noticias de Última Hora', subtitle: 'Administra las noticias urgentes en tiempo real' },
            regional: { title: 'Noticias por Región', subtitle: 'Gestiona noticias por región africana' },
            multimedia: { title: 'Multimedia', subtitle: 'Administra fotos, vídeos y contenido multimedia' },
            opinion: { title: 'Opinión & Análisis', subtitle: 'Gestiona artículos de opinión y análisis' },
            eventos: { title: 'Eventos', subtitle: 'Administra eventos deportivos' },
            atletas: { title: 'Atletas', subtitle: 'Gestiona perfiles de atletas' },
            historia: { title: 'Historia Destacada', subtitle: 'Gestiona la historia destacada de la portada' }
        };

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();

                const section = item.getAttribute('data-section');

                // Actualizar navbar activo
                navItems.forEach(nav => nav.classList.remove('nav-item-active'));
                item.classList.add('nav-item-active');

                // Actualizar contenido visible
                contentSections.forEach(section => section.classList.remove('active'));
                document.getElementById(`${section}-section`).classList.add('active');

                // Actualizar títulos
                sectionTitle.textContent = sectionTitles[section].title;
                sectionSubtitle.textContent = sectionTitles[section].subtitle;

                // Cerrar sidebar en móvil
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }

    // Manejar toggle del sidebar
    function setupSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('adminSidebar');

        sidebarToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        mobileMenuToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 &&
                !sidebar.contains(e.target) &&
                !mobileMenuToggle?.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    // Manejar logout
    function setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                localStorage.removeItem('adminSession');
                window.location.href = 'admin-login.html';
            }
        });
    }

    // Inicializar
    function init() {
        checkSession();
        setupNavigation();
        setupSidebarToggle();
        setupLogout();
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
