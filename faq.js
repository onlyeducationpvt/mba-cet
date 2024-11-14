async function fetchFaqData() {
    try {
        const response = await fetch('faq.json');
        if (!response.ok) {
            throw new Error('Failed to fetch FAQ data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading FAQ data:', error);
        return null;
    }
}

function createFaqElements(faqData) {
    const faqList = document.getElementById('faqList');
    
    faqData.faqItems.forEach(item => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        
        faqItem.innerHTML = `
            <div class="faq-question">${item.question}</div>
            <div class="faq-answer">
                <p>${item.answer}</p>
            </div>
        `;
        
        faqList.appendChild(faqItem);
    });
}

function addClickHandlers() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Initialize FAQ when the page loads
async function initializeFaq() {
    const faqData = await fetchFaqData();
    if (faqData) {
        createFaqElements(faqData);
        addClickHandlers();
    }
}

// Start initialization when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeFaq);