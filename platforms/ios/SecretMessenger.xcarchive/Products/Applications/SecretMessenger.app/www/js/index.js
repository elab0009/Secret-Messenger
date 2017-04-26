/*
 Ahamad Elabd & Rajat Kumar
 26/april/2017
 */
var app = {
    image: "", // Application Constructor
    userGuid: "",
    mgs_id: 0,
     userId: 0
    , initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    }
    , openSender: function () {
        console.log("here");
        let event = new CustomEvent("touchend", {
            bubbles: true
            , cancelable: true
        });
        document.getElementById("addBack").dispatchEvent(event);
    }
    , register: function () {
        let userName = document.getElementById("userName").value;
        let userEmail = document.getElementById("userEmail").value;
        if (userName == "" || userEmail == "") {
            alert("fill  all");
        }
        else {
            let req = new Request("https://griffis.edumedia.ca/mad9022/steg/register.php");
            let myData = new FormData();
            myData.append("user_name", userName);
            myData.append("email", userEmail);
            let opts = {
                method: 'post'
                , mode: 'cors'
                , body: myData
            };
            fetch(req, opts).then(function (response) {
                console.log(response);
                return response.json();
            }).then(function (data) {
                console.log(data);
                if (data.code == 0) {
                    app.userId = data.user_id;
                    app.userGuid = data.user_guid;
                    app.listMessages();
                    document.getElementById("loginModal").classList.remove("active");
                }
                else {
                    alert(data.message);
                }
            }).catch(function (err) {
                console.log("ERROR: ", err.message);
            });
        }
    }
    , loginIn: function () {
        let userName = document.getElementById("userName").value;
        let userEmail = document.getElementById("userEmail").value;
        if (userName == "" || userEmail == "") {
            alert("fill  all");
        }
        else {
            let req = new Request("https://griffis.edumedia.ca/mad9022/steg/login.php");
            let myData = new FormData();
            myData.append("user_name", userName);
            myData.append("email", userEmail);
            let opts = {
                method: 'post'
                , mode: 'cors'
                , body: myData
            };
            fetch(req, opts).then(function (response) {
                console.log(response);
                return response.json();
                console.log("hi");
            }).then(function (data) {
                console.log(data);
                if (data.code == 0) {
                    app.userId = data.user_id;
                    app.userGuid = data.user_guid;
                    app.listMessages();
                    document.getElementById("loginModal").classList.remove("active");
                }
                else {
                    alert(data.message);
                }
            }).catch(function (err) {
                console.log("ERROR: ", err.message);
            });
        }
    }
    , listUsers: function () {
        let req = new Request("https://griffis.edumedia.ca/mad9022/steg/user-list.php");
        let myData = new FormData();
        myData.append("user_id", app.userId);
        myData.append("user_guid", app.userGuid);
        let opts = {
            method: 'post'
            , mode: 'cors'
            , body: myData
        };
        fetch(req, opts).then(function (response) {
            console.log(response);
            return response.json();
        }).then(function (data) {
            console.log(data);
            let userList = document.getElementById("userlist");
            userList.innerHTML = '<option value="select">Select</option>';
            for (let i = 0; i < data.users.length; i++) {
                userList.innerHTML = userList.innerHTML + '<option value="' + data.users[i].user_id + '">' + data.users[i].user_name + '</option>';
            }
        }).catch(function (err) {
            console.log("ERROR: ", err.message);
        });
    }
    , listMessages: function () {
        console.log('listMessages');
        let req = new Request("https://griffis.edumedia.ca/mad9022/steg/msg-list.php");
        let myData = new FormData();
        myData.append("user_id", app.userId);
        myData.append("user_guid", app.userGuid);
        let opts = {
            method: 'post'
            , mode: 'cors'
            , body: myData
        };
        fetch(req, opts).then(function (response) {
            console.log(response);
            return response.json();
        }).then(function (data) {
            if (data.code == 0) {
                /*   
                    <li class="table-view-cell">
                        <a class="navigate-right" href="#detailsmodal">
                            <div class="media-body"> 
                                <span class="name">Name</span> 
                            </div>
                        </a>
                    </li>
                */
                let E = document.getElementById("Messenger");
                E.innerHTML = "";
                console.log(data.messages);
                data.messages.forEach(function (msg) {
                    let msgList = document.createElement("li");
                    msgList.className = "table-view-cell";
                    let a = document.createElement("a");
                    a.className = "navigate-right";
                    a.setAttribute("href", "#detailsmodal");
                    a.addEventListener("touchend", function () {
                        app.showMsgD(msg.msg_id)
                    });
                    let div = document.createElement("div");
                    div.className = "media-body";
                    let span = document.createElement("span");
                    span.className = "name";
                    span.textContent = msg.user_name;
                    msgList.appendChild(a);
                    a.appendChild(div);
                    div.appendChild(span);
                    E.appendChild(msgList);
                });
            }
            else {
                alert(data.message);
            }
        }).catch(function (err) {
            console.log("ERROR: ", err.message);
        });
    }
    , openAddM: function () {
        app.listUsers();
    }
    , takePic: function () {
        
        try{
            
            let options = {
                quality: 80
                , destinationType: Camera.DestinationType.FILE_URI
                , encodingType: Camera.EncodingType.PNG
                , mediaType: Camera.MediaType.PICTURE
                , pictureSourceType: Camera.PictureSourceType.CAMERA
                , allowEdit: true
                , targetWidth: 300
                , targetHeight: 300
            };
            navigator.camera.getPicture(app.successCallback, app.err, options);
            
        } catch( error ){
            app.err( error );
        }
        
    }
    , successCallback: function (imgData) {
        app.image = imgData;
        document.getElementById("img").src = imgData;
        document.getElementById("img").classList.remove("hidden");
        document.getElementById("takeImg").classList.add("hidden");
    }
    , err: function ( error ) {
        console.log("error ", error);
        //alert(error);
        app.successCallback('img/placeholder.png');
    }
    , showMsgD: function (msg_id) {
        console.log(msg_id);
        let req = new Request("https://griffis.edumedia.ca/mad9022/steg/msg-get.php");
        let myData = new FormData();
        myData.append("user_id", app.userId);
        myData.append("user_guid", app.userGuid);
        myData.append("message_id", msg_id);
        let opts = {
            method: 'post'
            , mode: 'cors'
            , body: myData
        };
        fetch(req, opts).then(function (response) {
            console.log(response);
            return response.json();
        }).then(function (data) {
            if (data.code == 0) {
                let imgT = document.getElementById("pic");
                
                //message
                app.msg_id = msg_id;
                
                //user name
                let req = new Request("https://griffis.edumedia.ca/mad9022/steg/user-list.php");
                let myData = new FormData();
                myData.append("user_id", app.userId);
                myData.append("user_guid", app.userGuid);
                let opts = {
                    method: 'post'
                    , mode: 'cors'
                    , body: myData
                };
                fetch(req, opts).then(function (response) {
                    return response.json();
                }).then(function (dataUsers) {
                    for (let i = 0; i < dataUsers.users.length; i++) {
                        if (data.sender == dataUsers.users[i].user_id){
                            document.getElementById("h1").textContent = dataUsers.users[i].user_name;
                            break;
                        }
                    }
                }).catch(function (err) {
                    console.log("ERROR: ", err.message);
                });
                
                
                let listener = function(){
                    
                    let canva = document.createElement("canvas");
                    canva.width = 300;
                    canva.height = 300;
                    canva.getContext("2d").drawImage(imgT,0,0);

                    try{
                        document.getElementById("fillDetail").textContent = BITS.getMessage(data.recipient, canva);
                    } catch(Error){
                        console.log(Error);
                        document.getElementById("fillDetail").textContent = 'ERROR';
                    }
                    imgT.removeEventListener('load',listener);
                };
                
                
                imgT.addEventListener('load', listener);
                imgT.src = 'https://griffis.edumedia.ca/mad9022/steg/' + data.image;
                
            }
            else {
                alert(data.message);
            }
        }).catch(function (err) {
            console.log("ERROR: ", err.message);
        });
    }
    , delete: function() {
        let req = new Request("https://griffis.edumedia.ca/mad9022/steg/msg-delete.php");
        let myData = new FormData();
        myData.append("user_id", app.userId);
        myData.append("user_guid", app.userGuid);
        myData.append("message_id", app.msg_id);
        let opts = {
            method: 'post'
            , mode: 'cors'
            , body: myData
        };
        fetch(req, opts).then(function (response) {
            console.log("delete", app.msg_id);
            return response.json();
        }).then(function (data) {
            if (data.code == 0) {
                let event = new CustomEvent("touchend", {
                    bubbles: true
                    , cancelable: true
                });
                document.getElementById("back").dispatchEvent(event);
                app.listMessages();
            }
            else {
                alert(data.message);
            }
        }).catch(function (err) {
            console.log("ERROR: ", err.message);
        });
    },SendMail : function(){
        
        let canva = document.createElement("canvas");
        let imgT = document.getElementById("img");
        canva.width = 300;
        canva.height = 300;
        canva.getContext("2d").drawImage(document.getElementById("img"),0,0);
        
        let imgMsg = document.getElementById("imgMsg").value.trim();
        let user = document.getElementById("userlist").value.trim();
        
        //add message to the image
        try{
        
            console.log("user", user);
            canva = BITS.setUserId(BITS.numberToBitArray(user) , canva);
            console.log("userArray", BITS.numberToBitArray(user));
            //console.log("getuser ", BITS.getUserId(newcanva));
            canva = BITS.setMsgLength(BITS.numberToBitArray(imgMsg.length * 16),canva);
            
            newcanva = BITS.setMessage(BITS.stringToBitArray(imgMsg),canva);
            
            //console.log("user ", BITS.getUserId(canva));
            console.log("message ", BITS.getMessage(user, canva));
            
        } catch(error){
            console.log("error",error);
        }
        
        let dataURL = canva.toDataURL( );

        app.dataURLToBlob( dataURL )
        .then(function( blob ){
            
       let req = new Request("https://griffis.edumedia.ca/mad9022/steg/msg-send.php");
            
            let myData = new FormData();
            myData.append('image', blob);
            myData.append("user_id", app.userId);
            myData.append("user_guid", app.userGuid);
            myData.append("recipient_id", user);
            
            let opts = {
                method: 'post'
                , mode: 'cors'
                , body: myData
            };  
            fetch(req, opts).then(function (response) {
                console.log("send");
                return response.json();
            }).then(function (data) {
                console.log(data);
                if (data.code == 0) {
                    
                let event = new CustomEvent("touchend", {
                    bubbles: true
                    , cancelable: true
                });
                document.getElementById("addBack").dispatchEvent(event);    
                   
                }
                else {
                    alert(data.message);
                }
            }).catch(function (err) {
                console.log("ERROR: ", err.message);
            });
        });
    },
    dataURLToBlob : function (dataURL) {
        return Promise.resolve().then(function () {
            var type = dataURL.match(/data:([^;]+)/)[1];
            var base64 = dataURL.replace(/^[^,]+,/, '');
            var buff = app.binaryStringToArrayBuffer(atob(base64));
            return new Blob([buff], {type: type});
        });
    },

    binaryStringToArrayBuffer : function(binary) {
        var length = binary.length;
        var buf = new ArrayBuffer(length);
        var arr = new Uint8Array(buf);
        var i = -1;
        while (++i < length) {
            arr[i] = binary.charCodeAt(i);
        }
        return buf;
    },backBottom: function(){
        console.log("Here1");

        document.getElementById("userlist").value = 'select';
        document.getElementById("imgMsg").value = "";
        document.getElementById("img").classList.add("hidden");
        document.getElementById("takeImg").classList.remove("hidden");
        
        app.listMessages();
        
        
        
    },
    
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        document.getElementById("logIn").addEventListener("click", app.loginIn);
        document.getElementById("sender").addEventListener("touchend", app.openSender);
        document.getElementById("register").addEventListener("click", app.register);
        document.getElementById("addMsg").addEventListener("touchend", app.openAddM);
        document.getElementById("takeImg").addEventListener("click", app.takePic);
        document.getElementById("deleteItem").addEventListener("click", app.delete);
        document.getElementById("sendMail").addEventListener("click", app.SendMail);
        document.getElementById("addBack").addEventListener("touchend",app.backBottom);
        document.getElementById("reload").addEventListener("click", app.listMessages);
        
    }
, };
app.initialize();
//app.onDeviceReady();