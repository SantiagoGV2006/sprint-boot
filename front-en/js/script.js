// Datos de ejemplo para los cursos
const coursesData = [
    {
        id: 1,
        title: "Introducción a la Programación",
        professor: "Dr. Carlos Mendoza",
        status: "available",
        image: "/api/placeholder/400/240",
        schedule: "Lunes y Miércoles",
        time: "8:00 - 10:00",
        description: "Fundamentos de programación utilizando Python. Ideal para principiantes.",
        credits: 4
    },
    {
        id: 2,
        title: "Anatomía Humana",
        professor: "Dra. Ana Martínez",
        status: "available",
        image: "/api/placeholder/400/240",
        schedule: "Martes y Jueves", 
        time: "10:30 - 12:30",
        description: "Estudio detallado de la estructura del cuerpo humano con prácticas de laboratorio.",
        credits: 6
    },
    {
        id: 3,
        title: "Derecho Constitucional",
        professor: "Dr. Roberto Sánchez",
        status: "full",
        image: "/api/placeholder/400/240",
        schedule: "Viernes",
        time: "14:00 - 18:00",
        description: "Análisis de los principios fundamentales del derecho constitucional.",
        credits: 5
    },
    {
        id: 4,
        title: "Psicología Social",
        professor: "Dra. Lucía Fernández",
        status: "available",
        image: "/api/placeholder/400/240",
        schedule: "Lunes y Miércoles",
        time: "16:00 - 18:00",
        description: "Estudio de la influencia social sobre el comportamiento humano.",
        credits: 4
    },
    {
        id: 5,
        title: "Macroeconomía",
        professor: "Dr. Miguel Álvarez",
        status: "available",
        image: "/api/placeholder/400/240",
        schedule: "Martes y Jueves",
        time: "14:00 - 16:00",
        description: "Análisis de los sistemas económicos a gran escala.",
        credits: 5
    },
    {
        id: 6,
        title: "Redes de Computadoras",
        professor: "Dr. Javier Rodríguez",
        status: "full",
        image: "/api/placeholder/400/240",
        schedule: "Miércoles y Viernes",
        time: "10:00 - 12:00",
        description: "Principios fundamentales de las redes informáticas y comunicaciones.",
        credits: 4
    }
];

// Cargar cursos
function loadCourses(courses) {
    const coursesGrid = document.getElementById('courses-grid');
    coursesGrid.innerHTML = '';
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        
        const statusClass = course.status === 'available' ? 'status-available' : 'status-full';
        const statusText = course.status === 'available' ? 'Disponible' : 'Completo';
        
        courseCard.innerHTML = `
            <div class="course-image" style="background: url(${course.image}) center/cover no-repeat">
                <div class="course-status ${statusClass}">${statusText}</div>
            </div>
            <div class="course-details">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-professor">Profesor: ${course.professor}</p>
                <div class="course-info">
                    <div class="info-item">${course.schedule}</div>
                    <div class="info-item">${course.time}</div>
                </div>
                <p class="course-description">${course.description}</p>
                <div class="course-footer">
                    <div class="course-credits">${course.credits} Créditos</div>
                    <button class="enroll-btn">Inscribirse</button>
                </div>
            </div>
        `;
        
        coursesGrid.appendChild(courseCard);
    });
}

// Filtrar cursos
function setupFilters() {
    const nameInput = document.getElementById('search-name');
    const professorInput = document.getElementById('search-professor');
    const statusSelect = document.getElementById('search-status');
    
    const filterCourses = () => {
        const nameFilter = nameInput.value.toLowerCase();
        const professorFilter = professorInput.value.toLowerCase();
        const statusFilter = statusSelect.value;
        
        const filteredCourses = coursesData.filter(course => {
            const nameMatch = course.title.toLowerCase().includes(nameFilter);
            const professorMatch = course.professor.toLowerCase().includes(professorFilter);
            const statusMatch = statusFilter === 'all' || course.status === statusFilter;
            
            return nameMatch && professorMatch && statusMatch;
        });
        
        loadCourses(filteredCourses);
    };
    
    nameInput.addEventListener('input', filterCourses);
    professorInput.addEventListener('input', filterCourses);
    statusSelect.addEventListener('change', filterCourses);
}

// Modal
function setupModal() {
    const modal = document.getElementById('registerModal');
    const btn = document.getElementById('openRegisterModal');
    const span = document.getElementsByClassName('close')[0];
    const quickForm = document.getElementById('quick-form');
    const toast = document.getElementById('toast');
    
    btn.onclick = function() {
        modal.style.display = 'block';
    }
    
    span.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    
    quickForm.addEventListener('submit', function(e) {
        e.preventDefault();
        modal.style.display = 'none';
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
        
        quickForm.reset();
    });
}

// Tabs
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
}

// Mobile menu
function setupMobileMenu() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('burger-toggle');
    });
}

// Form submissions
function setupForms() {
    const studentForm = document.getElementById('student-form');
    const professorForm = document.getElementById('professor-form');
    const toast = document.getElementById('toast');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
        
        e.target.reset();
    };
    
    studentForm.addEventListener('submit', handleSubmit);
    professorForm.addEventListener('submit', handleSubmit);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    loadCourses(coursesData);
    setupFilters();
    setupModal();
    setupTabs();
    setupMobileMenu();
    setupForms();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            const nav = document.querySelector('.nav-links');
            const burger = document.querySelector('.burger');
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('burger-toggle');
            }
        });
    });
});