
const miFormulario = document.querySelector('form');


const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/auth/'
            : 'https://noderestserver-production-7173.up.railway.app/auth/';



miFormulario.addEventListener('submit', ev=>{
    ev.preventDefault();
    const formData = {};
    for(let elem of miFormulario.elements){
        if(elem.name.length > 0){
            formData[elem.name] = elem.value;
        }
    }       
    fetch(url+'login',{
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type':'application/json' }
    })
    .then(resp => resp.json())
    .then(data =>{
        const { token } =data;
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(err =>{
        console.log(err)
    })
});




function onSignIn(googleUser) {
    //google token            
    const body = {id_token: googleUser.credential}                        
    fetch( url+'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( body )
    })
    .then( resp => resp.json() )
    .then( data =>{
        const { token } =data;
        localStorage.setItem('email', data.usuario.correo);
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch( console.warn );
}


const btn_google_singout = document.querySelector("#google_singout");        
btn_google_singout.onclick = ()=>{                        
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('email') || '', done =>{
        localStorage.clear();
        location.reload();
    })}