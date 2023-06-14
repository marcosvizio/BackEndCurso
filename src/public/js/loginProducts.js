const login = document.getElementById('loginSession')

login.addEventListener('click', event => {
    event.preventDefault();
    window.location.replace('/login')
})