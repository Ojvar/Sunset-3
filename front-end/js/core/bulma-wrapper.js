"use strict";

window.onload = () => {
    document
        .querySelector(".navbar-burger.burger")
        .addEventListener("click", (e) => {
            const target = e.target.attributes["data-target"].value;

            document.getElementById(target).classList.toggle("is-active");
        });
};
