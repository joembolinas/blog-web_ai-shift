document.addEventListener('DOMContentLoaded', () => {
    // --- Basic Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            // Set ARIA attribute for accessibility
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
            // Change icon based on state
            mobileMenuButton.textContent = isExpanded ? '✕' : '☰';
        });
    }

    // --- Smooth Scrolling & Close Mobile Menu on Link Click ---
    const navAnchors = document.querySelectorAll('nav ul li a[href^="#"]');
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 70; // Fallback height

    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default jump

            const targetId = this.getAttribute('href');
            try { // Use try-catch for robustness if element doesn't exist
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Close mobile menu if open before scrolling
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        if (mobileMenuButton) {
                             mobileMenuButton.textContent = '☰';
                             mobileMenuButton.setAttribute('aria-expanded', 'false');
                        }
                    }

                    // Calculate scroll position considering navbar height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth' // Uses the CSS variable if supported
                    });
                }
            } catch (error) {
                console.error("Error finding element for smooth scroll:", targetId, error);
            }
        });
    });

     // --- Active Link Highlighting on Scroll ---
     const sections = document.querySelectorAll('main section[id]'); // Target sections within main
     const navListItems = document.querySelectorAll('nav ul li a');

     function setActiveLink() {
         let currentSectionId = '';
         const scrollPosition = window.pageYOffset;

         sections.forEach(section => {
             // Check if section is in view (adjust offset as needed)
             // Offset allows activation slightly before the section top hits the exact nav bottom
             const sectionTop = section.offsetTop - navbarHeight - 50;
             const sectionBottom = sectionTop + section.offsetHeight;

             if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                 currentSectionId = section.getAttribute('id');
             }
         });

         // If near the top, highlight the first link (e.g., Summary)
         if (scrollPosition < sections[0].offsetTop - navbarHeight - 50) {
              currentSectionId = sections[0].getAttribute('id'); // Default to first section if above all
         }

         // Update active class on nav links
         navListItems.forEach(a => {
             a.classList.remove('active');
             // Check if the link's href matches the current section ID
             if (a.getAttribute('href') === `#${currentSectionId}`) {
                 a.classList.add('active');
             }
         });
     }

     // Debounce scroll event listener for performance
     let scrollTimeout;
     window.addEventListener('scroll', () => {
         clearTimeout(scrollTimeout);
         scrollTimeout = setTimeout(setActiveLink, 100); // Adjust delay as needed (e.g., 50-150ms)
     });

     // Initial check in case the page loads scrolled down
     setActiveLink();


     // --- Add data-label attributes dynamically for table accessibility on mobile ---
     document.querySelectorAll('.table-viz').forEach(table => {
        const headerCells = table.querySelectorAll('.table-viz-header > div');
        const bodyRows = table.querySelectorAll('.table-viz-row');

        if (headerCells.length > 0) {
            bodyRows.forEach(row => {
                const cells = row.children;
                for (let i = 0; i < cells.length; i++) {
                    if (headerCells[i]) { // Check corresponding header exists
                         cells[i].setAttribute('data-label', headerCells[i].textContent.trim());
                    }
                }
            });
        }
     });

}); // End DOMContentLoaded