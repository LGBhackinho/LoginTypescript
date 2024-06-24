function submitLogin(event) {
  event.preventDefault();

  const login = getInputValueAndClearError("login", "error-login");
  const mdp = getInputValueAndClearError("mdp", "error-mdp");
  let isValid = true;

  if (!validateEmail(login)) {
    showError("error-login", "FORMAT NON VALIDE");
    document.getElementById("login").focus();
    isValid = false;
  }

  if (login === "") {
    showError("error-login", "ERREUR LOGIN");
    document.getElementById("login").focus();
    isValid = false;
  }

  if (mdp === "") {
    showError("error-mdp", "ERREUR MOT DE PASSE");
    document.getElementById("mdp").focus();
    isValid = false;
  }

  //Pour un inscription

  //   if (!validateMdp(mdp)) {
  //     showError("error-mdp", "FORMAT NON VALIDE");
  //     document.getElementById("mdp").focus();
  //     return;
  //   }

  // Si toutes les validations sont réussies, soumettre le formulaire
  if (isValid) {
    // event.target.submit(); // Si toutes les validations sont réussies, soumettre le formulaire

    fetch("http://localhost:3000/loginAdd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //// ATTENTION login et mdp son les id qui correspond au schema donc la variable doit s appeler comme le schema///////////
      body: JSON.stringify({ login, mdp }),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("ok donnee traite");
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    console.log(JSON.stringify({ login, mdp }));

    ///////////////////// AFFICHER LE RESULTAT ///////////////

    fetch("http://localhost:3000/logins")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Retourne une autre promesse qui se résout en données JSON
      })
      .then((data) => {
        document.getElementById("texteJson").innerHTML =
          "login : " +
          data[data.length - 1].login +
          " " +
          "mot de passe : " +
          data[data.length - 1].mdp;
        console.log(data); // Traitez les données JSON ici
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }
}

function getInputValueAndClearError(inputId, errorId) {
  const inputValue = document.getElementById(inputId).value;
  document.getElementById(errorId).innerText = "";
  return inputValue;
}

function showError(errorId, errorMessage) {
  const errorElement = document.getElementById(errorId);
  errorElement.innerText = errorMessage;
  errorElement.style.color = "red";
  errorElement.style.fontSize = "18px"; // Ajustez la taille de la police selon vos besoins
}

function viderForm() {
  document.getElementById("login").value = "";
  document.getElementById("mdp").value = "";
  document.getElementById("error-login").innerText = "";
  document.getElementById("error-mdp").innerText = "";
}

function validateEmail(mail) {
  const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return mailformat.test(mail);
}

//VERIFCATION POUR UNE INSCRIPTION

function validateMdp(mdp) {
  const mdpformat =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return mdpformat.test(mdp);
}

function rechercheJson() {
  fetch("https://jsonplaceholder.typicode.com/posts/1")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Retourne une autre promesse qui se résout en données JSON
    })
    .then((data) => {
      document.getElementById("texteJson").innerHTML =
        "title : " + data.title + " " + "Description : " + data.body;
      console.log(data); // Traitez les données JSON ici
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}

///////FONCTION POUR ECRIRE DU JSON DANS UNE API

function ecrireJson() {
  const postDatas = async (url = "", data = {}) => {
    try {
      const response = await fetch(url, {
        method: "POST", // ou 'GET', 'PUT', 'DELETE', etc.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Corps de la requête (payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json(); // Attendre que la promesse soit résolue avec les données JSON
      return responseData; // Retourner les données
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  // Utilisation de la fonction postData
  postDatas("https://jsonplaceholder.typicode.com/posts", {
    title: "tutre a ecrire",
    body: "je ne sais pas quoi ecrire",
    userId: 1,
  }).then((data) => {
    document.getElementById("texteJson1").innerHTML =
      "title : " + data.title + " " + "Description : " + data.body; // Affiche les données renvoyées par le serveur
  });
}

function funcPrimiseAll() {
  const urls = [
    "https://jsonplaceholder.typicode.com/posts/1",
    "https://jsonplaceholder.typicode.com/posts/2",
    "https://jsonplaceholder.typicode.com/posts/3",
  ];

  const fetchPromises = urls.map((url) =>
    fetch(url).then((response) => response.json())
  );

  Promise.all(fetchPromises)
    .then((results) => {
      console.log(results); // Affiche les résultats des trois requêtes fetch
    })
    .catch((error) => {
      console.error("One of the fetch requests failed:", error);
    });
}
