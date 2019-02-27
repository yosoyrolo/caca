const auth = firebase.auth();
var loginPage = {};

//el usuario inico sesion o cerro sesion
auth.onAuthStateChanged(firebaseUser => {
  console.log(firebaseUser);

  if (firebaseUser) {
    //Inicio sesion
    goTo(document.querySelector("#loginPage"), "components/profilePage.html");
  } else {
    //Cerro sesion
    goTo(document.querySelector("#profilePage"), "components/startPage.html");
  }
});

loginPage.loginButton = function() {
  var user = document.querySelector("#email").value;
  var pass = document.querySelector("#password").value;
  if (user == "" && pass == "") {
    loginPage.errorLogin("Ingresa un correo y una contraseña");
  } else if (user != "" && pass == "") {
    loginPage.errorLogin("Ingresa una contraseña");
  } else if (user == "" && pass != "") {
    loginPage.errorLogin("Ingresa un correo");
  } else if (user != "" && pass != "") {
    if (loginPage.validateEmail(user)) {
      //el correo y la contraseña estan bien escritas
      const promise = auth.signInWithEmailAndPassword(user, pass);

      promise.catch(e => loginPage.checkError(e));
    } else {
      loginPage.errorLogin("Ingresa un correo valido");
    }
  }
};

loginPage.checkError = function(promise) {
  console.log("Check FireBase Auth error");
  switch (promise.code) {
    case "auth/user-not-found":
      loginPage.errorLogin("Este usuario no existe.");
      break;
    case "auth/wrong-password":
      loginPage.errorLogin("La contraseña es incorrecta.");
      break;
  }
};

loginPage.enterkey = function(event) {
  var code = event.code;
  if (code == "Enter") {
    //Do Something
    this.loginButton();
  }
};

loginPage.errorLogin = function(toast) {
  document
    .querySelector("#loginCard")
    .classList.remove("animated", "fadeInUp", "swing");
  document.querySelector("#loginCard").classList.add("animated", "swing");
  document
    .querySelector("#loginCard")
    .addEventListener("animationend", function() {
      document
        .querySelector("#loginCard")
        .classList.remove("animated", "swing");
    });
  M.toast({ html: toast });
};

loginPage.validateEmail = function(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

function goTo(element, url) {
  if (element != null) {
    animateCSS(element, "zoomOut", function() {
      element.parentElement.removeChild(element);
      ajax.get(
        url,
        {},
        function(a) {
          document.querySelector("#app-container").innerHTML = a;
        },
        function() {}
      );
    });
  } else {
    ajax.get(
      url,
      {},
      function(a) {
        document.querySelector("#app-container").innerHTML = a;
      },
      function() {}
    );
  }
}
