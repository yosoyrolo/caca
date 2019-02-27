var appContainer = document.querySelector("app-container");

function elementOut(ele) {
  var element = document.querySelector(ele);
  element.classList.add("animated", "zoomOut");
  element.addEventListener("animationend", function() {
    element.parentElement.removeChild(element);
    return true;
  });
}

function elementOutGoTo(ele, comp) {
  var element = document.querySelector(ele);
  element.classList.add("animated", "zoomOut");
  element.addEventListener("animationend", function() {
    element.parentElement.removeChild(element);
    ajax.get(
      comp,
      {},
      function(a) {
        appContainer.innerHTML = a;
      },
      true
    );
    return true;
  });
}

var ajax = {};
ajax.x = function() {
  if (typeof XMLHttpRequest !== "undefined") {
    return new XMLHttpRequest();
  }
  var versions = [
    "MSXML2.XmlHttp.6.0",
    "MSXML2.XmlHttp.5.0",
    "MSXML2.XmlHttp.4.0",
    "MSXML2.XmlHttp.3.0",
    "MSXML2.XmlHttp.2.0",
    "Microsoft.XmlHttp"
  ];

  var xhr;
  for (var i = 0; i < versions.length; i++) {
    try {
      xhr = new ActiveXObject(versions[i]);
      break;
    } catch (e) {}
  }
  return xhr;
};

ajax.send = function(url, callback, method, data, async) {
  if (async === undefined) {
    async = true;
  }
  var x = ajax.x();
  x.open(method, url, async);
  x.onreadystatechange = function() {
    if (x.readyState == 4) {
      callback(x.responseText);
    }
  };
  if (method == "POST") {
    x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  }
  x.send(data);
};

ajax.get = function(url, data, callback, async) {
  var query = [];
  for (var key in data) {
    query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
  }
  ajax.send(
    url + (query.length ? "?" + query.join("&") : ""),
    callback,
    "GET",
    null,
    async
  );
};

ajax.post = function(url, data, callback, async) {
  var query = [];
  for (var key in data) {
    query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
  }
  ajax.send(url, callback, "POST", query.join("&"), async);
};

/*
----------------------------------- Animate


*/

function animateCSS(element, animationName, callback) {
  const node = element;
  node.classList.add("animated", animationName);

  function handleAnimationEnd() {
    node.classList.remove("animated", animationName);
    node.removeEventListener("animationend", handleAnimationEnd);

    if (typeof callback === "function") callback();
  }

  node.addEventListener("animationend", handleAnimationEnd);
}
