function clearForm() {
    document.getElementById("registrationForm").reset();
}

document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var firstName = document.getElementById("firstName").value.trim();
    var lastName = document.getElementById("lastName").value.trim();
    var address = document.getElementById("Nickname").value.trim();
    var age = document.getElementById("age").value.trim();
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    alert("Thanks for registering with our website, your customer record was created successfully.");
});
//HomeaPage
document.getElementById('SubmitBtn').addEventListener('click', function() {
    const text = document.getElementById('name').value;
    const category = document.getElementById('Selection').value;
    
    if (category === 'Updates') {
        document.getElementById('updatesContent').innerText = text;
    } else if (category === 'HomePage') {
        document.getElementById('homePageContent').innerText = text;
    }
});

document.getElementById('ClearFormBtn').addEventListener('click', function() {
    document.getElementById('name').value = '';
    document.getElementById('updatesContent').innerText = '';
    document.getElementById('homePageContent').innerText = '';
});
document.getElementById('SubmitBtn').addEventListener('click', function() {
    const isRegistered = localStorage.getItem('isRegistered');

    if (!isRegistered) {
        alert('You need to register first!');
        window.location.href = 'registration.html';
        return;
    }

    const text = document.getElementById('name').value;
    const category = document.getElementById('Selection').value;
    
    if (category === 'Updates') {
        localStorage.setItem('updatesContent', text);
    } else if (category === 'HomePage') {
        document.getElementById('homePageContent').innerText = text;
    }
});

document.getElementById('ClearFormBtn').addEventListener('click', function() {
    document.getElementById('name').value = '';
    localStorage.removeItem('updatesContent');
    document.getElementById('homePageContent').innerText = '';
});
//Registration section 
document.getElementById('SubmitBtn').addEventListener('click', function() {
    const isRegistered = localStorage.getItem('isRegistered');

    if (!isRegistered) {
        alert('You need to register first!');
        window.location.href = 'registration.html';
        return;
    }

    const text = document.getElementById('name').value;
    const category = document.getElementById('Selection').value;

    if (category === 'Updates') {
        localStorage.setItem('updatesContent', text);
    } else if (category === 'HomePage') {
        document.getElementById('homePageContent').innerText = text;
    }
});

document.getElementById('ClearFormBtn').addEventListener('click', function() {
    document.getElementById('name').value = '';
    localStorage.removeItem('updatesContent');
    document.getElementById('homePageContent').innerText = '';
});
/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }