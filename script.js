// script.js

document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const titleInput = document.getElementById('title-input');
    const addButton = document.getElementById('add-button');
    const pinboard = document.getElementById('pinboard');
    const themeSelect = document.getElementById('theme-select');

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'white';
    document.body.classList.add(`${savedTheme}-theme`);
    themeSelect.value = savedTheme;

    // Change theme on selection
    themeSelect.addEventListener('change', (event) => {
        const theme = event.target.value;
        document.body.className = '';
        document.body.classList.add(`${theme}-theme`);
        localStorage.setItem('theme', theme);
    });

    // Retrieve links from localStorage or initialize an empty array
    let links = JSON.parse(localStorage.getItem('links')) || [];

    // Function to display all links on the pinboard
    function displayLinks() {
        pinboard.innerHTML = '';
        links.forEach((link, index) => {
            const pin = document.createElement('div');
            pin.classList.add('pin');

            // Use Google's favicon service to get the site's favicon
            const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${link.url}`;

            pin.innerHTML = `
                <img src="${faviconUrl}" alt="Favicon">
                <a href="${link.url}" target="_blank">${link.title}</a>
                <button data-index="${index}" class="delete-button">Delete</button>
            `;

            pinboard.appendChild(pin);
        });
    }

    // Function to add a new link to the pinboard
    function addLink() {
        const url = urlInput.value.trim();
        const title = titleInput.value.trim() || url;

        if (url) {
            links.push({ url, title });
            localStorage.setItem('links', JSON.stringify(links));
            displayLinks();

            // Clear input fields
            urlInput.value = '';
            titleInput.value = '';
        }
    }

    // Function to delete a link from the pinboard
    function deleteLink(index) {
        links.splice(index, 1);
        localStorage.setItem('links', JSON.stringify(links));
        displayLinks();
    }

    // Event listener for the 'Add' button
    addButton.addEventListener('click', addLink);

    // Event listener for the 'Delete' buttons
    pinboard.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const index = event.target.getAttribute('data-index');
            deleteLink(index);
        }
    });

    // Drag-and-Drop functions
    function handleDragStart(event) {
        event.target.classList.add('dragging');
        event.dataTransfer.setData('text/plain', event.target.dataset.index);
    }

    function handleDragOver(event) {
        event.preventDefault();
        event.target.classList.add('drag-over');
    }

    function handleDragLeave(event) {
        event.target.classList.remove('drag-over');
    }

    function handleDrop(event) {
        event.preventDefault();
        event.target.classList.remove('drag-over');

        const draggedIndex = event.dataTransfer.getData('text/plain');
        const targetIndex = event.target.dataset.index;

        // Swap the links
        const [draggedItem] = links.splice(draggedIndex, 1);
        links.splice(targetIndex, 0, draggedItem);

        // Update localStorage and display
        localStorage.setItem('links', JSON.stringify(links));
        displayLinks();
    }

    function makePinsDraggable() {
        const pins = document.querySelectorAll('.pin');
        pins.forEach((pin, index) => {
            pin.setAttribute('draggable', true);
            pin.dataset.index = index;
            pin.addEventListener('dragstart', handleDragStart);
            pin.addEventListener('dragover', handleDragOver);
            pin.addEventListener('dragleave', handleDragLeave);
            pin.addEventListener('drop', handleDrop);
        });
    }

    // Update displayLinks function to make pins draggable
    function displayLinks() {
        pinboard.innerHTML = '';
        links.forEach((link, index) => {
            const pin = document.createElement('div');
            pin.classList.add('pin');

            // Use Google's favicon service to get the site's favicon
            const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${link.url}`;

            pin.innerHTML = `
                <img src="${faviconUrl}" alt="Favicon">
                <a href="${link.url}" target="_blank">${link.title}</a>
                <button data-index="${index}" class="delete-button">Delete</button>
            `;

            pinboard.appendChild(pin);
        });
        makePinsDraggable();
    }
    // Display links on page load
    displayLinks();
});
