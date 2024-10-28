function displayImage() {
	const imageNumberInput = document.getElementById('imageNumber');
	var imageNumber = imageNumberInput.value;
	let paddedNumber;

	if (imageNumber < 1 || imageNumber > 48) {
		paddedNumber = 49;
	} else {
		paddedNumber = imageNumber.padStart(2, '0');
	}

	//const imageContainer = document.getElementById('imageContainer');

	// Clear the input field after showing the image
	imageNumberInput.value = '';

	addImageToPage(paddedNumber);	
}

// Function to set a cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration date
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/"; // Set cookie
}

// Function to get a cookie
function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArr = decodedCookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].trim();
        if (cookiePair.indexOf(name + "=") == 0) {
            return cookiePair.substring(name.length + 1, cookiePair.length); // Return cookie value
        }
    }
    return ""; // Return empty string if cookie not found
}

function updateCookie() {
	var string = ""
	var kort = document.getElementById('imageContainer').childNodes;
	if (kort.length > 0) {
		for (var i = kort.length-1; i > 0; i--) {
  			string = string + kort[i].title + ",";
		}
		string = string + kort[0].title
	}
	setCookie("kort", string, 30)
}

// Function to load images from cookies on page load
window.onload = function () {
    const storedImages = getCookie("kort").split(",").filter(Boolean); // Split cookie string
    storedImages.forEach((imageNumber) => {
        addImageToPage(imageNumber);
    });
};

function displayCookies() {
	alert(document.cookie);
};



function addImageToPage(paddedNumber) {

	const imageContainer = document.getElementById('imageContainer');

	// Create a new image wrapper element
	const imageWrapper = document.createElement('div');
	imageWrapper.className = 'image-wrapper';
	imageWrapper.title = paddedNumber;

	// Create the image element
	const img = document.createElement('img');
	img.src = `${paddedNumber}.png`;
	img.alt = `${paddedNumber}`;

	// Create the delete button
	const deleteButton = document.createElement('button');
	deleteButton.className = 'delete-button';
	deleteButton.textContent = 'Ta bort';
	deleteButton.onclick = function() {
		imageContainer.removeChild(imageWrapper);
		updateCookie();
	};

	// Add touch/mouse event listeners to slide the image
	let startX;
	imageWrapper.addEventListener('mousedown', startDrag);
	imageWrapper.addEventListener('touchstart', startDrag);

	function startDrag(event) {
		startX = event.touches ? event.touches[0].clientX : event.clientX;
		document.addEventListener('mousemove', drag);
		document.addEventListener('touchmove', drag);
		document.addEventListener('mouseup', endDrag);
		document.addEventListener('touchend', endDrag);
	}

	function drag(event) {
		const currentX = event.touches ? event.touches[0].clientX : event.clientX;
		const deltaX = currentX - startX;
		if (deltaX < -50) {
			imageWrapper.classList.add('slide-left');
		} else {
			imageWrapper.classList.remove('slide-left');
		}
	}

	function endDrag() {
		document.removeEventListener('mousemove', drag);
		document.removeEventListener('touchmove', drag);
		document.removeEventListener('mouseup', endDrag);
		document.removeEventListener('touchend', endDrag);
	}

	// Append the image and delete button to the image wrapper
	imageWrapper.appendChild(img);
	imageWrapper.appendChild(deleteButton);

	// Prepend the image wrapper directly at the top of the container
	imageContainer.prepend(imageWrapper);
	updateCookie();

}

// Add event listener for the 'Enter' key on the input field
document.getElementById('imageNumber').addEventListener('keydown', function(event) {
	if (event.key === 'Enter' || event.keyCode === 13) {
		event.preventDefault(); // Prevent form submission if inside a form
		displayImage();
	}
});