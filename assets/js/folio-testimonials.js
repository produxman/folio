const testimonials = [
    {
        quote: "I learned so much from Sherif during his time as Head of Product at Pelcro. He's a visionary with the rare ability to both inspire and execute. A great communicator who can rally teams and clients alike, Sherif consistently delivered impact and clarity. Any team would be lucky to have him.",
        name: "Abdallah Shapsough",
        designation: "VP Product & Professional Services",
        src: "🚀",
    },
    {
        quote: "Sherif is one of the hardest workers I know, always paying attention to the details and making sure everything gets done. It's impressive how dedicated he is—he often won't rest until the job is finished! On top of that, he's super supportive and always there for his team. His compassion and work ethic really stand out, and it's genuinely a pleasure to work with him.",
        name: "Rana Haleem",
        designation: "Software Engineer / Product Manager",
        src: "💪",
    },
    {
        quote: "If there's one person who brings both precision and passion to every project, it's Sherif. Working with him was a lesson in how attention to detail and deadlines can be perfectly balanced (sometimes with a little fiery determination). Sure, he might be a bit hot-headed when things aren't perfect, but that's only because he genuinely cares about delivering the best possible outcome. Sherif's ability to organize, care for his team, and chase perfection is inspiring—and a little intimidating in the best way! If you want a project done with heart and excellence, Sherif's your guy.",
        name: "Ayman Adel",
        designation: "Senior Quality Assurance Engineer at Pelcro",
        src: "🔥",
    },
    {
        quote: "It's been an absolutely pleasure working with Sherif at Pelcro. He took extreme ownership over his role, and leveraged his excellent communication to manage the team and client problems effectively. Sherif has always worked with a high degree of discipline, integrity and always took it upon himself to solve the hardest problems.",
        name: "Michael Ghattas",
        designation: "Pelcro CEO, Billing for Publishers & Media",
        src: "🏆",
    },
    {
        quote: "Working with Sherif as Oxford American transitioned its subscription management in-house with Pelcro has been a privilege. His thoughtful and thorough approach has brought significant benefits to our organization. Sherif consistently demonstrates industry knowledge and a sharp ability to navigate and resolve complex challenges, ensuring that our product needs are met with high standards. I highly recommend Sherif for his professionalism and unparalleled expertise in driving product success.",
        name: "Shobhi Kandasamy",
        designation: "Associate Director",
        src: "🎯",
    },
    {
        quote: "I worked with Sherif while my organization migrated to a new subscription system. He was critical to the success of the project: always answering our questions and making sure the product could do what we needed it to do.",
        name: "Mike Gilbert",
        designation: "Systems Developer",
        src: "🔧",
    },
    {
        quote: "Over the past eighteen months, I have had the pleasure of working with Sherif on several high impact feature requests, as he built out his product roadmap. Sherif was a joy to work with, as I could count on him to challenge my preconceptions and deliver quality solutions to my company's problems. Sherif can disagree without being disagreeable, and I have always found him to be open to new ideas, transparent, and willing to work hard to deliver what he's promised. Sherif has always been willing to roll up his sleeves and join me in the weeds as we researched root causes and potential fixes. He is very skilled at documenting SOWs, BRDs, and technical specs so that stakeholders of varying degrees of technical acumen could clearly understand his solutions. I will miss our weekly chats and Slack conversations. All the best Sherif! I hope we can work together again someday.",
        name: "Jeff Spies",
        designation: "Subscription Management Expert | Product, Project, Marketing & Operations Leadership",
        src: "🤝",
    },
    {
        quote: "I had the pleasure of working alongside Sherif at Pelcro, and I was consistently impressed by his ability to drive product vision and execute with precision. Sherif's deep understanding of the product lifecycle, from gathering user requirements to launching features, was evident in how smoothly our product progressed. As a software developer, collaborating with him was always efficient, thanks to his clear communication and problem-solving skills, which allowed us to plan and execute with ease. He also possesses a unique ability to balance business needs with the voice of the customer, ensuring his product decisions are both strategic and user-focused. Anyone who has the opportunity to work with Sherif will undoubtedly benefit from his expertise, leadership, and dedication to delivering high-quality products.",
        name: "Ahmed Mohsen",
        designation: "Senior Software Engineer @ Benjamin",
        src: "⚡",
    },
    {
        quote: "Sherif is a highly dedicated and reliable individual who has consistently demonstrated exceptional performance in his role. His unwavering commitment to his work, coupled with strong interpersonal skills and keen attention to detail, has made him an invaluable asset to our team. He is adept at identifying and resolving complex challenges. His ability to think critically and develop effective solutions is a valuable asset to any team. I wholeheartedly recommend Sherif for any role that requires a dedicated, hardworking, and compassionate individual.",
        name: "Mohamed Ali",
        designation: "Principal Software Engineer at Pelcro",
        src: "💎",
    },
    {
        quote: "Sherif has an incredible capability of being able to push you while also maintaining your motivation and urge to improve. I had the pleasure of working with Sherif as a product marketer, in which I gained more insight into the product and also developed skills that are usable in any work I decide to venture on. His timeliness on task delivery, organization skills, and capability of being able to simplify complex problems eloquently and efficiently is truly what sets him apart from others in his field. This, paired with his sunny disposition and growing appetite for knowledge, made my experience with him all the better.",
        name: "Farida El Bakry",
        designation: "Board Member at ValueTech | Marketing Strategist at FranklinCovey Egypt",
        src: "☀️",
    },
    {
        quote: "Sherif's capacity to remain organized and involved in multiple concurrent complex projects has made him a dependable key team member at Pelcro. His capacity to work under stress and his handling of tough situations is second to none. I had the pleasure to work closely with him multiple times, and I look forward for this trend to continue.",
        name: "Frédéric Trudeau",
        designation: "Vice President of Engineering at Pelcro",
        src: "🎯",
    },
    {
        quote: "I had the pleasure of working with Sherif while we were both at Zyda, and throughout that time, I was blown away by both his communication skills and his ability to see the bigger picture. He is an excellent diplomat, capable of handling the hardest and least cooperative of individuals. Yet, simultaneously, he never loses sight of the business context surrounding each task he performs, making sure that he has not only identified the right problem but is also tackling it in the best way he knows how. And, to top it all off, Sherif's aesthetic sensibilities and his understanding of user behavior shone clearly every time the team grappled with user experience.",
        name: "Ibrahim Zaghw",
        designation: "CEO and Founder of 11:07",
        src: "🧠",
    },
    {
        quote: "Working with Sherif was a pleasure. He is a natural product manager and always thinks of new approaches to improve our product. He always has the best recommendations for books and podcasts. His communication skills are top-notch, and he is extremely driven to get things done despite obstacles. Sherif would be a great addition to any product team.",
        name: "Alex Barreto",
        designation: "General Manager @ Stealth Startup | Product Strategy, Growth",
        src: "📚",
    },
    {
        quote: "As a QA, life was easier when it came to reviewing the requirements and user stories for each feature we were working on, especially with Sherif's amazing interpersonal skills and his patience. He had no problem jumping on a call to review stories and requirements again, explaining them clearly to make sure the released feature had no downside. Working in huge projects with him is more like a picnic.",
        name: "Marwan Tawakol",
        designation: "Senior Test Engineer, Quality Assurance",
        src: "🧘",
    },
    {
        quote: "Sherif and I worked together on several projects. He consistently gave 100 percent effort to the team and played a significant role in ensuring that we deliver projects on time. He had excellent time management skills and had a knack for keeping everyone calm and productive during intense periods.",
        name: "Sara Rady",
        designation: "Sales Manager",
        src: "⏰",
    },
    {
        quote: "Sherif is a great product manager and someone to count on. He's very helpful, thoughtful and fun to work with. He's flexible and responsive to new ideas that could really help and leave a great impact on the team and product. He was always willing to go the extra mile to make everyone comfortable and lift the stress off the team. It was a pleasure working with him; he is a great asset to any team with his dedication and expertise.",
        name: "Aya Elsawi",
        designation: "Product Design @ Jisr",
        src: "🌟",
    },
    {
        quote: "I worked with Sherif at Dell for around two years; he was a very skilled resource deployment manager with excellent people and communication skills. As part of the PM team who worked on a daily basis with Sherif and his team, Sherif was our go-to person for anything urgent that needed quick action. The amount of support he provided was amazing and he was a delight to work with.",
        name: "Noha AbdAlla",
        designation: "Product Manager",
        src: "🚀",
    },
    {
        quote: "Sherif has been, and still is, a crucial factor to my success at Zyda. I joined as an Associate Product Manager after a long career in Training & Development and needed a lot of mentoring to speed up my learning curve. Not only did Sherif facilitate this journey, he also made sure I learned the tiniest details of the PM's job to accelerate my time-to-proficiency. He's highly influential and motivates you to follow his work ethic without even trying. I'd highly recommend him to any company or role.",
        name: "Amr Ismail",
        designation: "Product Manager at Yassir",
        src: "🎓",
    },
    {
        quote: "I had the pleasure of working with Sherif in a couple of projects that involved growth and product. I was amazed by his creativity and his mindset to create solutions. He's an amazing and inspiring person, and working with him is a guarantee of fun.",
        name: "Cássia Ferreira",
        designation: "Sales Account Executive (MBA Marketing & Strategic Sales)",
        src: "🎨",
    },
    {
        quote: "Sherif is the perfect product manager. He's trustworthy, creative, has a long-term vision, and is fun to work with. He helped improve the product in many ways and is always helpful and open to ideas. He has a combination of humor and empathy that lifts the spirit in stressful situations. I highly recommend Sherif to any organization.",
        name: "Khaled Albarawy",
        designation: "Software Engineer @ Adyen",
        src: "😄",
    },
    {
        quote: "Sherif is a true inspiration to me and to the rest of the team. He understands the 80/20 rule and lives it daily, recognizing issues and potential concerns before they occur and mitigating their effects. He is highly motivated, proactive, responsible and committed, always exceeding expectations. I enjoy working with Sherif as a super-qualified and talented PM/RM across all aspects.",
        name: "Ahmed Al Mansour, ITIL, PMP, MSP",
        designation: "District Program Delivery Manager at Dell Technologies",
        src: "⚖️",
    },
    {
        quote: "Sherif is an excellent project manager and a joy to work with. He is incredibly dependable, goes out of his way to help team members, happily takes on new tasks, and proactively thinks up innovative ideas for improving processes. He has a unique talent for easily building relationships through his charismatic personality, giving him a strong edge with both internal and external stakeholder engagement.",
        name: "Ashley King",
        designation: "Information Security | Risk Management | Program & Project Management",
        src: "🤗",
    },
    {
        quote: "Sherif is an excellent professional. In the time we worked together I felt that I could count on him for anything and everything. He is a quick learner and impressed me most with his ability to learn from mistakes and to always look for ways to improve processes, making the team's life easier. As a person, Sherif is trustworthy, professional, cheerful, respectful and very responsible.",
        name: "Paola Ortiz",
        designation: "Director of Project Management and Information Systems Auditor",
        src: "🎯",
    },
    {
        quote: "Sherif is a pleasure to work with—a perfect combination of helpful, thoughtful, creative, dedicated, and funny. He's been a wonderful project manager for our team, keeping several complex privacy and security compliance projects on track. He took it upon himself to learn more about privacy-by-design principles to suggest improvements for clients and business ideas for our company.",
        name: "Kellie du Preez",
        designation: "DPO via VeraSafe",
        src: "🛡️",
    },
    {
        quote: "It's always a pleasure working alongside Sherif on a project. He excels at the core elements of his job and on tasks that extend well beyond the scope of his role. Sherif's productivity and ambition set a great example for the rest of the team. If you're looking for a killer project manager, look no further than Sherif Kamal!",
        name: "Jean van Wyk",
        designation: "Group Data Privacy and Protection Specialist at FirstRand | Attorney | CIPP/E | CIPM | FIP",
        src: "🎖️",
    },
    {
        quote: "As an attorney, I once believed it could be challenging to work with individuals who have completely different qualifications, as we tend to speak different languages. Sherif eliminated this misconception from day one. He excels at his own functions while making my role easy and seamless. He has excellent written and verbal communication skills, foresight to identify possible problems and propose solutions, and manages upwards and downwards in a tactful manner. He is a great asset to my team and an absolute pleasure to work with!",
        name: "Zia Maharaj",
        designation: "Partner at VeraSafe | CIPP/E | CIPP/US | CIPM | FIP",
        src: "⚖️",
    },
    {
        quote: "I worked extensively with Sherif at VeraSafe. In his role as Project Manager he assisted me in the IT department by prioritizing tasks and ensuring the timely completion of tasks and projects. With the increasing demands in a rapidly growing company he did an extraordinary job. His background in IT and technical skills were a great asset to ensure the smooth functioning of the department.",
        name: "Chris Gaffney",
        designation: "System Administrator and Integrator at VeraSafe",
        src: "⚙️",
    },
    {
        quote: "Sherif works with me directly as the Project Manager for several client projects. He has been unfailingly organized, communicative, and supportive of all team members. His background knowledge of data protection and IT has proven invaluable, as has his willingness to step in and assist wherever needed. His value as a coworker cannot be overstated.",
        name: "Calli Schroeder",
        designation: "Senior Counsel and Global Privacy Counsel at EPIC",
        src: "📋",
    },
    {
        quote: "Working with Sherif is always a pleasure. He is a good listener and communicator and constantly searches for ways to do better work. Sherif inspires with optimism—but his confidence is fact-based, which makes him a credible and reliable teammate.",
        name: "Nick Maystrenko",
        designation: "Resource Management @ FTI Consulting | Change Management | Business Operations",
        src: "🌈",
    },
    {
        quote: "Sherif is one of the few Resource Managers that made my life easier and the life of my PM colleagues easier. He understands the overall business, so in each request he knows the background and priority. You can rely on him on the most urgent requests as he always delivers.",
        name: "Hassan Hallouda, PMP",
        designation: "Senior Project Manager at Dell Technologies",
        src: "🚀",
    },
    {
        quote: "Sherif is one of the best resource managers I have worked with due to his dedicated attention to detail. His project management skills are the reason behind his successful engagements. I was always confident of the right outcome knowing he was managing the job.",
        name: "Israa Dabbour, PMP",
        designation: "Project Management Office Manager at EMC, Dubai",
        src: "🔍",
    },
    {
        quote: "Sherif has added a lot to making our PM lives easier. His organization skills as a Resource Manager are remarkable and we admire his persistence and follow-up on requests.",
        name: "Lilian Hani Aziz",
        designation: "Services Leader | Program Manager | Engineer",
        src: "📊",
    },
    {
        quote: "Sherif is a strong caliber with unique skills; combining very good technical skills with excellent presentation and design skills. His strength lies in his ongoing ability to learn and being a fast learner. In the correct position and environment, I expect he will achieve huge success.",
        name: "Ahmed Selim",
        designation: "Platforms Manager - IT Infrastructure",
        src: "💡",
    },
    {
        quote: "Sherif is a talented young individual who makes rocket science look easy. He is a fast learner, adapts well to changes and different techniques, and his creativity is unorthodox and out of the box.",
        name: "Tamer El Kady",
        designation: "FinTech | ITIL | PMP | Architect",
        src: "🚀",
    },
    {
        quote: "He is one of the most hard-working people that I have worked with. He thinks out of the box with new ideas. I would recommend him as I worked with him directly in many situations.",
        name: "Simon Hanna",
        designation: "Assistant General Manager - T24 Application Support",
        src: "💡",
    },
    {
        quote: "Sherif has great potential that will be beneficial for any organization he becomes a part of. His willingness to learn and stay updated with modern technologies are main features. His innovation and creativity stand out. I highly recommend Sherif for hiring.",
        name: "Mohamed Zakaria",
        designation: "Director, IT Infrastructure Management Head at CIB Egypt",
        src: "🌟",
    },
    {
        quote: "It's not every day that you come across someone like Sherif. He reported to me as a Workforce Specialist for almost a year, during which he proved to be organized, independent, and a tireless perfectionist, always ready to put in the energy to get the job done. One of the most reliable professionals you would meet.",
        name: "Sherif Korayem",
        designation: "Vice President of Global Operations",
        src: "💎",
    },
    {
        quote: "Sherif is one of a kind; he has a really good eye for graphic design. He does very creative and efficient designs that meet requirements extremely well. I wish him continued success!",
        name: "Mahitab M. Salem",
        designation: "HR at The National Bank of Egypt",
        src: "🎨",
    },
    {
        quote: "Sherif is a very talented visual designer and great to work with. He is innovative and always looking for fresh ideas to exceed expectations. He is passionate and stays aware of new creative strategies. His designs are awesome.",
        name: "Shereen Nasser",
        designation: "Customer Success / Project Management / Technology Services",
        src: "✨",
    },
    {
        quote: "Sherif has been a valuable member of the team, very diligent in his daily work, meticulous, and proactive in researching and solving customers' issues rather than passing them on. Customers have requested to work with Sherif based on prior engagements. It has been a pleasure having him on the team.",
        name: "David Somers",
        designation: "Former TSM Team Lead at IBM",
        src: "🔍",
    },
    {
        quote: "Sherif is a motivated, self-sufficient, extremely focused and hard-working professional. His innovative and persuasive nature enabled us to provide excellent work for our customers at IBM. He is one of the most creative people I have worked with—a true artist.",
        name: "Amr ElBakry",
        designation: "Senior Solutions Engineer @ NetApp Saudi Arabia",
        src: "🎭",
    },
    {
        quote: "Sherif demonstrated true talent and leadership. He is attentive to details, meticulous in problem solving, punctual, responsible, and trustworthy. He breaks things down to their simplest form, making them easier to grasp. An excellent team player whose presence makes a difference.",
        name: "Sandra Elias",
        designation: "Customer Success Engineer at CyberArk (DACH) GmbH",
        src: "🧩",
    },
    {
        quote: "Sherif is the epitome of everything you need in RTM & Mission Control—proactive, focused, intuitive and supportive. He showed a flair for ensuring every advisor did exactly what was required and when. He should be congratulated on ensuring we deliver what is required.",
        name: "Ahmed Elaydi",
        designation: "Project Manager | Customer Service Expert | AI Solutions Specialist",
        src: "🎯",
    },
    {
        quote: "Mr. Kamal is one of the best calibers I've ever worked with. On a personal level, he created a great environment for the team. Professionally, he was a key player and a direct reason for a very successful expansion. I'd recommend him for even more challenging positions—he simply will not let his boss down.",
        name: "Omar Rady",
        designation: "MBA | Project Management | COPC implementation leader | Agile Practitioner",
        src: "🏆",
    },
    {
        quote: "Sherif is an outstanding talent and has been instrumental in driving us forward with his innovative thinking and ability to turn concepts into actionable solutions. His strategic mindset, combined with his attention to detail, makes him an invaluable asset to any team.",
        name: "Mohamed Hanafy",
        designation: "Data Engineer",
        src: "💭",
    },
    {
        quote: "I had the absolute pleasure working with Sherif during his time at Pelcro. He is undoubtedly one of the most diligent, creative, strategic, and collaborative team members I have worked with. His product sense is unrivaled and his ability to distill complex customer feedback into actionable product improvements is exceptional. I cannot recommend him enough.",
        name: "Nick Carter",
        designation: "CEO at Pelcro",
        src: "🎯",
    },
    {
        quote: "Sherif is a very talented Product Manager and an amazing leader. His ability to lead cross-functional teams is fantastic and his willingness to always help everyone around him is outstanding. He has a great eye for design and product development which helps him build products that users love.",
        name: "Mohamed Khalil",
        designation: "VP of Customer Success at Pelcro",
        src: "🚀",
    },
    {
        quote: "Sherif's expertise in product management is unparalleled. His ability to analyze complex user journeys, identify pain points, and implement solutions that enhance the user experience is truly remarkable. He has a keen eye for design and an innate understanding of what users want.",
        name: "Osama Ouda",
        designation: "Senior Software Engineer at Pelcro",
        src: "🔬",
    },
    {
        quote: "I have had the pleasure of working alongside Sherif at Pelcro, and I can confidently say that he is one of the most talented product managers I have ever encountered. His ability to understand complex technical concepts and translate them into user-friendly solutions is remarkable.",
        name: "Karim Taha",
        designation: "Senior DevOps Engineer at Pelcro",
        src: "🌉",
    },
    {
        quote: "Sherif is remarkable. He has a rare combination of strategic thinking, creativity, and execution excellence. His ability to understand user needs and translate them into actionable product features is simply outstanding. I highly recommend Sherif for any product management role.",
        name: "Mahmoud Rashad",
        designation: "Senior Product Manager",
        src: "⭐",
    },
    {
        quote: "Sherif is incredibly talented and forward-thinking. His strategic approach to product development and his ability to balance user needs with business objectives make him an exceptional product manager. His collaborative spirit and positive attitude make him a joy to work with.",
        name: "Ahmed Usama",
        designation: "Software Engineer at Pelcro",
        src: "🎪",
    },
    {
        quote: "Working with Sherif has been an absolute pleasure. His deep understanding of user experience and product strategy is evident in everything he does. He has a unique ability to see the big picture while paying attention to the smallest details.",
        name: "Mohamed Mostafa",
        designation: "Software Engineering Manager at Pelcro",
        src: "🔎",
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
