const testimonials = [
    {
    quote: "He tackled our most complex challenges with clarity and composure when we had no playbook. He balances business acumen with builder energy and a relentless focus on delivery.",
        name: "Belen Caeiro",
        designation: "VP Product @ Meister",
        src: "🧭"
    },
    {
    quote: "Sherif is a PM who combines strong product instincts with genuine curiosity and deep ownership. He’s not afraid to ask the hard questions, push for real outcomes, and roll up his sleeves when things get messy.",
        name: "Tanya Sharma",
        designation: "Product Led Growth Lead @ Meister",
        src: "💡"
    },
    {
    quote: "The domain was everything from authentication to payments—always with clarity, structure, and a calm technical depth that made even complex topics feel manageable.",
        name: "Liis Monson",
        designation: "Senior Product Leader @ Meister",
        src: "🧠"
    },
    {
    quote: "His ability to balance high-level strategy with thoughtful, detail-oriented execution is rare — and it shows in how he guides teams, shapes roadmaps, and brings clarity to complex problems.",
        name: "Mira Amin",
        designation: "Vendor Manager @ Amazon",
        src: "♟️"
    },
    {
    quote: "He’s a visionary with the rare ability to both inspire and execute. A great communicator who can rally teams and clients alike, Sherif consistently delivered impact and clarity.",
        name: "Abdallah Shapsough",
        designation: "VP Product @ Pelcro",
        src: "🚀"
    },
    {
    quote: "Sherif is one of the hardest workers I know... It’s impressive how dedicated he is. On top of that, he’s super supportive and always there for his team.",
        name: "Rana Haleem",
        designation: "Product Manager @ Pelcro",
        src: "🔥"
    },
    {
    quote: "He took extreme ownership over his role. Sherif has always worked with a high degree of discipline, integrity and always took it upon himself to solve the hardest problems.",
        name: "Michael Ghattas",
        designation: "CEO @ Pelcro",
        src: "🤝"
    },
    {
    quote: "Sherif consistently demonstrates industry knowledge and a sharp ability to navigate and resolve complex challenges, ensuring that our product needs are met with high standards.",
        name: "Shobhi Kandasamy",
        designation: "Associate Director @ Oxford American",
        src: "🎯"
    },
    {
    quote: "I could count on him to challenge my preconceptions and deliver quality solutions. Sherif can disagree without being disagreeable, and I have always found him to be open to new ideas.",
        name: "Jeff Spies",
        designation: "Subscription Expert (Client)",
        src: "💬"
    },
    {
    quote: "His capacity to remain organized and involved in multiple concurrent complex projects has made him a dependable key team member... His capacity to work under stress is second to none.",
        name: "Frédéric Trudeau",
        designation: "VP of Engineering @ Pelcro",
        src: "⚓"
    },
    {
    quote: "He is a natural product manager and always thinks of new approaches to improve our product. His communication skills are top-notch, and he is extremely driven to get things done despite obstacles.",
        name: "Alex Barreto",
        designation: "Fractional CPO/CSO",
        src: "📈"
    },
    {
    quote: "He consistently gave 100 percent effort to the team... He had excellent time management skills and had a knack for keeping everyone calm and productive during intense periods.",
        name: "Sara Rady",
        designation: "Sales Manager @ Zyda",
        src: "🕊️"
    },
    {
    quote: "Sherif has been a crucial factor to my success. He's highly influential, and motivates you to follow his work ethic without even trying. He's great to work with.",
        name: "Amr Ismail",
        designation: "Product Manager @ Procore",
        src: "🌟"
    },
    {
    quote: "He understands the 80:20 rule... he is always able to recognise issues and potential concerns before they occur and mitigate their effects. His reputation always precedes him.",
        name: "Ahmed Al Mansour",
        designation: "Program Delivery Manager @ Dell Technologies",
        src: "📉"
    },
    {
    quote: "He is incredibly dependable and goes out of his way to help team members... Sherif has a unique talent for being able to very easily build relationships through his charismatic personality.",
        name: "Ashley King",
        designation: "Project Manager @ VeraSafe",
        src: "🤲"
    },
    {
    quote: "I felt that I could count on him for anything... what impressed me the most was his ability to learn from mistakes and to always look for ways to improve the processes.",
        name: "Paola Ortiz",
        designation: "Director of Project Management @ VeraSafe",
        src: "🔄"
    },
    {
    quote: "He's a perfect combination of helpful, thoughtful, creative, dedicated, and funny. You can tell his real talents lay in the technical work he does.",
        name: "Kellie du Preez",
        designation: "DPO @ VeraSafe",
        src: "🎭"
    },
    {
    quote: "It can be difficult to assimilate a legal background with technical project management. Sherif eliminated this misconception. He has the unique ability to teach and mentor as he fixes problems.",
        name: "Zia Maharaj",
        designation: "Partner @ VeraSafe",
        src: "🌉"
    },
    {
    quote: "Sherif works with me directly as the Project Manager... he has been unfailingly organized, communicative, and supportive. His background knowledge of data protection and IT has proven invaluable.",
        name: "Calli Schroeder",
        designation: "Global Privacy Counsel @ EPIC",
        src: "🛡️"
    },
    {
    quote: "Not only is he a good listener... but also he strives for constant improvement. Sherif always inspires with his optimism, but his confidence is fact-based, which makes him a reliable teammate.",
        name: "Nick Maystrenko",
        designation: "Resource Management @ FTI Consulting",
        src: "💪"
    },
    {
    quote: "Sherif has added a lot to making our PM lives easier. His organization skills as a Resource Manager are remarkable and we as Project Managers admire his persistence and follow up.",
        name: "Lilian Hani Aziz",
        designation: "Services Leader @ Dell",
        src: "📋"
    },
    {
    quote: "The willing to learn & be updated in the modern technologies are considered main features for Sherif. Worth to mention the innovation and the creativity in his ideas.",
        name: "Mohamed Zakaria",
        designation: "IT Infrastructure Head @ CIB Egypt",
        src: "🆙"
    },
    {
    quote: "I was impressed with his ability to quickly grasp and apply technical concepts. He works very well in a team and is committed to providing an excellent client experience.",
        name: "Jim Evans",
        designation: "Client @ IBM",
        src: "🎓"
    },
    {
    quote: "He proved to be organized, independent, and a tireless perfectionist, who's always ready to put all his energy and stamina to get the job done. One of the most reliable professionals.",
        name: "Sherif Korayem",
        designation: "VP Global Operations @ Teleperformance",
        src: "⚡"
    }
];

// Global variables for column management
let columnContainers = [];
let isDesktop = false;
let isTablet = false;
let isMobile = false;

// Create testimonial card HTML
function createTestimonialCard(testimonial) {
    return `
        <div class="testimonials-card">
            <div class="testimonials-card-header">
                <div class="testimonials-card-avatar">${testimonial.src}</div>
                <div>
                    <p class="testimonials-card-name">${testimonial.name}</p>
                    <p class="testimonials-card-designation">${testimonial.designation}</p>
                </div>
            </div>
            <p class="testimonials-card-quote">"${testimonial.quote}"</p>
        </div>
    `;
}

// Distribute testimonials across columns based on viewport
function distributeTestimonials() {
    const screenWidth = window.innerWidth;
    
    // Determine viewport type
    isDesktop = screenWidth >= 1024;
    isTablet = screenWidth >= 768 && screenWidth < 1024;
    isMobile = screenWidth < 768;
    
    // Clear existing content
    columnContainers.forEach(container => {
        if (container) {
            container.innerHTML = '';
        }
    });
    
    if (isMobile) {
        // Mobile: Only use column 1, all testimonials
        if (columnContainers[0]) {
            const duplicatedTestimonials = [...testimonials, ...testimonials]; // Duplicate for seamless scroll
            duplicatedTestimonials.forEach(testimonial => {
                columnContainers[0].innerHTML += createTestimonialCard(testimonial);
            });
        }
    } else if (isTablet) {
        // Tablet: Use columns 1 and 2, hide column 3
        const col1Testimonials = testimonials.filter((_, index) => index % 2 === 0);
        const col2Testimonials = testimonials.filter((_, index) => index % 2 === 1);
        
        if (columnContainers[0]) {
            const duplicatedCol1 = [...col1Testimonials, ...col1Testimonials];
            duplicatedCol1.forEach(testimonial => {
                columnContainers[0].innerHTML += createTestimonialCard(testimonial);
            });
        }
        
        if (columnContainers[1]) {
            const duplicatedCol2 = [...col2Testimonials, ...col2Testimonials];
            duplicatedCol2.forEach(testimonial => {
                columnContainers[1].innerHTML += createTestimonialCard(testimonial);
            });
        }
    } else {
        // Desktop: Use all 3 columns
        const col1Testimonials = testimonials.filter((_, index) => index % 3 === 0);
        const col2Testimonials = testimonials.filter((_, index) => index % 3 === 1);
        const col3Testimonials = testimonials.filter((_, index) => index % 3 === 2);
        
        if (columnContainers[0]) {
            const duplicatedCol1 = [...col1Testimonials, ...col1Testimonials];
            duplicatedCol1.forEach(testimonial => {
                columnContainers[0].innerHTML += createTestimonialCard(testimonial);
            });
        }
        
        if (columnContainers[1]) {
            const duplicatedCol2 = [...col2Testimonials, ...col2Testimonials];
            duplicatedCol2.forEach(testimonial => {
                columnContainers[1].innerHTML += createTestimonialCard(testimonial);
            });
        }
        
        if (columnContainers[2]) {
            const duplicatedCol3 = [...col3Testimonials, ...col3Testimonials];
            duplicatedCol3.forEach(testimonial => {
                columnContainers[2].innerHTML += createTestimonialCard(testimonial);
            });
        }
    }
}

// Initialize testimonials
function initializeTestimonials() {
    // Get column containers
    columnContainers = [
        document.querySelector('#testimonial-column-1 .testimonials-scroll'),
        document.querySelector('#testimonial-column-2 .testimonials-scroll'),
        document.querySelector('#testimonial-column-3 .testimonials-scroll')
    ];
    
    // Initial distribution
    distributeTestimonials();
    
    // Listen for resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            distributeTestimonials();
        }, 100);
    });
    
    // Monitor chat widget state changes to pause/resume testimonials
    function checkChatWidgetState() {
        const testimonialsSection = document.querySelector('.testimonials-content');
        if (!testimonialsSection) return;
        
        // Check if chat widget is open via the global API or DOM state
        const isChatOpen = (window.AIChatbot && window.AIChatbot.isOpen && window.AIChatbot.isOpen()) ||
                          document.getElementById('ai-chatbot-widget')?.classList.contains('show') ||
                          document.getElementById('chat-widget')?.classList.contains('expanded');
        
        if (isChatOpen) {
            testimonialsSection.classList.add('testimonials-paused');
        } else {
            testimonialsSection.classList.remove('testimonials-paused');
        }
    }
    
    // Check chat state periodically
    setInterval(checkChatWidgetState, 500);
    
    // Also check when window state changes (focus/blur, resize)
    window.addEventListener('focus', checkChatWidgetState);
    window.addEventListener('blur', checkChatWidgetState);
    
    // Listen for chat widget events if they exist
    document.addEventListener('click', function(e) {
        if (e.target.id === 'ai-chatbot-toggle' || 
            e.target.closest('#ai-chatbot-toggle') ||
            e.target.id === 'ai-chatbot-close' ||
            e.target.closest('#ai-chatbot-close') ||
            e.target.id === 'ai-chatbot-close-pill' ||
            e.target.closest('#ai-chatbot-close-pill')) {
            setTimeout(checkChatWidgetState, 100);
        }
    });
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', initializeTestimonials);

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded
    initializeTestimonials();
}
