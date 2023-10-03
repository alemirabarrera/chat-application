const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const  socketController =async (socket = new Socket(), io)=>{    
    const usuario = await comprobarJWT(socket.handshake.headers["x-token"]);
    if(!usuario){
        return socket.disconnect();
    }

    //agregar al usuario conectado
    chatMensajes.ConectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensaje', chatMensajes.ultimos10);

    
    //conectarlo a una sala especial
    const data=new String(usuario._id)    
    socket.join(data.toString()); //global, socket.id, usuario._id     

    //limpiar cuando alguien se desconecta    
    socket.on('disconnect',()=>{
        chatMensajes.desconectarUsuario(usuario._id)
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    }) 
    socket.on('enviar-mensaje', ({uid, mensaje})=>{
        if(uid){               
            console.log({uid, mensaje});
            //Mensaje Privado            
            socket.to( uid ).emit('mensaje-privado', {de:usuario.nombre, mensaje})
        }else{
            chatMensajes.enviarMensaje(usuario._id, usuario.nombre, mensaje);
            io.emit('recibir-mensaje', chatMensajes.ultimos10);
        }        
    })
}

module.exports ={
    socketController
}