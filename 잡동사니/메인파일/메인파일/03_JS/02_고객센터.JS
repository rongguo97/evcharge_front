/**
 * CHARCAGE Customer Service - Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
    initFaqAccordion();
    initContactForm();
    initMobileMenu();
});

/**
 * FAQ Accordion Toggle Logic
 */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-q');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const currentCard = question.parentElement;
            const isActive = currentCard.classList.contains('active');

            // Close all other open cards
            document.querySelectorAll('.faq-card').forEach(card => {
                card.classList.remove('active');
            });

            // Toggle current card
            if (!isActive) {
                currentCard.classList.add('active');
            }
        });
    });
}

/**
 * Contact Form Submission Handling
 */
function initContactForm() {
    const csForm = document.getElementById('csForm');
    
    if (csForm) {
        csForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                type: document.getElementById('inquiry_type').value,
                name: document.getElementById('user_name').value,
                email: document.getElementById('user_email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            console.log('Form Submitted:', formData);
            alert(`${formData.name}님, 문의가 정상적으로 접수되었습니다.\n영업일 기준 2~3일 내에 ${formData.email}로 답변을 보내드리겠습니다.`);
            
            csForm.reset();
        });
    }
}

/**
 * Mobile Sidebar Menu Logic
 */
function initMobileMenu() {
    const menuOpenBtn = document.getElementById('menuOpenBtn');
    const menuCloseBtn = document.getElementById('menuCloseBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = document.querySelectorAll('.m-link');

    // Open Menu
    if (menuOpenBtn) {
        menuOpenBtn.addEventListener('click', () => {
            mobileSidebar.classList.add('open');
            mobileOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    }

    // Close Menu
    const closeMenu = () => {
        mobileSidebar.classList.remove('open');
        mobileOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

    // Mobile Accordion Menu
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const subMenu = link.nextElementSibling;
            if (subMenu && subMenu.classList.contains('m-sub-menu')) {
                e.preventDefault();
                subMenu.classList.toggle('show');
                link.querySelector('i').classList.toggle('fa-chevron-up');
                link.querySelector('i').classList.toggle('fa-chevron-down');
            }
        });
    });
}

/**
 * Helper: Set Inquiry Type from Quick Menu
 */
function setInquiryType(typeValue) {
    const selectBox = document.getElementById('inquiry_type');
    if (selectBox) {
        selectBox.value = typeValue;
        
        // Smooth scroll to form
        const formSection = document.getElementById('contact-form-anchor');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}








