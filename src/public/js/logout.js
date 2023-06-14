const logout = document.getElementById('logoutSession')

logout.addEventListener('click', async event => {
    event.preventDefault();
    const response = await fetch('/api/sessions/logout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })
    const responseData = await response.json()
    console.log(responseData);
    if (responseData.status==='success') {
        window.location.replace('/login')
    }
})