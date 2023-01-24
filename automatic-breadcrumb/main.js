// Get the current location
const currentLocation = window.location.pathname;

// Split the location into an array of levels
const locationArray = currentLocation.split('/');

// Create the breadcrumb container
const breadcrumb = document.createElement('div');
breadcrumb.classList.add('breadcrumb');

// Iterate through the location levels and create breadcrumb links
locationArray.forEach((level, index) => {
    // Skip the first level (it's usually just a forward slash)
    if (index === 0) return;

    // Create the breadcrumb link
    const link = document.createElement('a');
    link.href = locationArray.slice(0, index + 1).join('/');
    link.textContent = level;

    // Append the link to the breadcrumb container
    breadcrumb.appendChild(link);
});

// Append the breadcrumb container to the body
document.body.appendChild(breadcrumb);