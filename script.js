document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navbar.classList.toggle('active');
        
        // Toggle bars animation
        const bars = this.querySelectorAll('.bar');
        if (this.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
    });
    
    // Close mobile menu when clicking a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbar.classList.contains('active')) {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
                
                // Reset bars
                const bars = hamburger.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                });
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Form submission to Telegram
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                // Get form values
                const formData = {
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    pickup: document.getElementById('pickup').value,
                    dropoff: document.getElementById('dropoff').value,
                    date: document.getElementById('date').value,
                    time: document.getElementById('time').value,
                    service: document.querySelector('.service-card.active')?.querySelector('h3')?.textContent || 'Not specified'
                };

                // Format the message for Telegram
                const message = `🚖 *New Taxi Booking - SKK/Myawaddy* 🚖\n\n` +
                               `👤 *Name:* ${formData.name}\n` +
                               `📞 *Phone:* ${formData.phone}\n` +
                               `📍 *Pickup:* ${formData.pickup}\n` +
                               `🏁 *Drop-off:* ${formData.dropoff}\n` +
                               `📅 *Date:* ${formData.date}\n` +
                               `⏰ *Time:* ${formData.time}\n` +
                               `🔧 *Service:* ${formData.service}\n\n` +
                               `_Received from SwiftRide Website_`;

                // Send to Telegram via Vercel serverless function
                const response = await fetch('/api/sendBooking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message
                    })
                });

                const result = await response.json();
                
                if (response.ok) {
                    // Show success message in Burmese and English
                    alert(`ကျေးဇူးတင်ပါသည် ${formData.name}!\n\nYour booking from ${formData.pickup} to ${formData.dropoff} has been received.\nWe'll contact you shortly.\n\nကျေးဇူးပြု၍ ဖုန်းလိုင်းပိတ်မသွားပါနှင့်။`);
                    this.reset();
                } else {
                    throw new Error(result.error || 'Failed to send booking');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Booking failed. Please call us directly at 09684562181\n\nကျေးဇူးပြု၍ ဖုန်းဖြင့်ဆက်သွယ်ပေးပါ။');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // Add click handler for service cards to show selected service
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            serviceCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Set active nav link based on scroll position
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Auto-focus on first form field when booking section is reached
    const bookSection = document.getElementById('book');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.getElementById('name').focus();
            }
        });
    }, { threshold: 0.5 });
    
    if (bookSection) {
        observer.observe(bookSection);
    }
});