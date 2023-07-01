/**
* js/main.js ...
* Social Authentication main script sheet ...
*/

"use strict";

// Document ready ...
$(() => {

	// Login preloader ...
	if (location.pathname == "/login/") {
		$("#login-container").css("pointer-events", "none")
		gsap.fromTo("#logo-preloader", { y: 0 }, { autoAlpha: 1, duration: 0.25, delay: 0.5, scale: 0.8, y: 0, ease: "power4.easeOut", onComplete: () => {
			gsap.to("#logo-preloader", { autoAlpha: 0, duration: 0.25, delay: 0.25, scale: 0.8, ease: "power4.easeOut" })
			gsap.fromTo("#login-container", { y: 0 }, { autoAlpha: 1, duration: 0.25, delay: 0.5, y: 0, ease: "power4.easeOut", onComplete: () => {
				$("#login-container").css("pointer-events", "auto")
			}})
		}})
	}

	// Quick script to set side navigation active page ...
	if ($("aside a")) {
		$("aside a").each(function(i, obj) {
			if($(this).attr("href") === location.pathname) $(this).addClass("active")
		})		
	}

	// Set theme check for selected theme, else default to operating system ....
	if ($(".nav-top")) {
		const theme = localStorage.getItem('data-theme');
		if (theme) {
			if (theme === "os") $("#theme-os").append("<div id='theme-check' class='float-end fa-solid fa-check' style='margin-top: 3px'></div>")
			if (theme === "dark") $("#theme-dark").append("<div id='theme-check' class='float-end fa-solid fa-check' style='margin-top: 3px'></div>")
			if (theme === "light") $("#theme-light").append("<div id='theme-check' class='float-end fa-solid fa-check' style='margin-top: 3px'></div>")
		} else {
			$("#theme-os").append("<div id='theme-check' class='float-end fa-solid fa-check' style='margin-top: 3px'></div>")
		}
	}
	
})

// Change theme ...
const changeTheme = (theme) => {
	const addCheck = (theme) => {
		$("#theme-check").remove();
		$(`#theme-${theme}`).append("<div id='theme-check' class='float-end fa-solid fa-check' style='margin-top: 3px'></div>")
	}
	if (theme === "os") {
		const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
		if (prefersDarkScheme.matches) {
			document.documentElement.setAttribute("data-theme", "dark");
			localStorage.setItem("data-theme", "os");
			addCheck("os");
		} else {
			document.documentElement.setAttribute("data-theme", "light");
			localStorage.setItem("data-theme", "os");
			addCheck("os");
		}
	} else {
		if (theme === "dark") {
			document.documentElement.setAttribute("data-theme", theme)
			localStorage.setItem("data-theme", theme)
				addCheck("dark");
		}
		if (theme === "light") {
			document.documentElement.setAttribute("data-theme", theme)
			localStorage.setItem("data-theme", theme)
				addCheck("light");
		}
	}
}

// Password visibility toggler ...
if ($('.password-toggler')) {
	
    $('.password-toggler').on("click", () => {
  
		// Toggle input type attribute ...
		let type = $('.password').attr("type") === "password" ? "text" : "password";
		$(".password").attr("type", type);

		// Toggle eye icon ...
		if ($(".eye").hasClass("fa-eye-slash")) {
			$(".eye").removeClass("fa-eye-slash");
			$(".eye").addClass("fa-eye");
		} else {
			$(".eye").removeClass("fa-eye");
			$(".eye").addClass("fa-eye-slash");
		}

	})

}

// Open modal handler ...
const openModal = (modal, modalBg) => {
	gsap.to(modalBg, { duration: 0.5, autoAlpha: 1, ease: "power4.out" });
	gsap.fromTo(modal, { y: 20 }, { duration: 0.5, y: 0, ease: "power4.out", onComplete: () => {
		if ($("input")) $("input").trigger("focus")
		if ($("#old-password")) $("#old-password").trigger("focus")
	}});
}

// Close modal handler ...
const closeModal = (modal, modalBg) => {
	gsap.to(modalBg, { duration: 0.25, autoAlpha: 0, ease: "power4.in" });
	gsap.fromTo(modal, { y: 0 }, { duration: 0.25, y: 0, ease: "power4.in" });
}

// Change password handler ...
$("#btn-change-password").on("click", () => {

	// Open modal ...
	openModal("#change-password-modal", "#change-password-modal-bg")
	
	// Close modal ...
	$(document).on("keydown", (e) => { if (e.key === "Escape" || e.key === "Enter") closeModal("#change-password-modal", "#change-password-modal-bg") });
	$(".btn-close-change-password-modal").on("click", () => { closeModal("#change-password-modal", "#change-password-modal-bg") });

})

// Error handler ...
const errorHandler = (err) => {

	// Pass error details to alert modal ...
	$("#alert-box-msg").html(`<p class="mb-2" style="font-weight: 500">Soical.Auth Error:</p>${err.responseJSON}`)

	// Open modal ...
	openModal("#alert-box", "#alert-box-bg")
	
	// Close modal ...
	$(document).on("keydown", (e) => { if (e.key === "Escape" || e.key === "Enter") closeModal("#alert-box", "#alert-box-bg") });
	$(".btn-close-alert-box").on("click", () => { closeModal("#alert-box", "#alert-box-bg") });

}

// Login handler ...
$("#btn-login").on("click", () => {

	const data = {
		email: $("#email").val(),
		password: $("#password").val()
	}

	$.ajax({
		type: "POST",
		url: "/auth/",
		data: data,
		dataType: "json",
		error: (data) => errorHandler(data),
		success: () => window.location.href = "/profile/"
	})

})

// GSAP variables ...
const duration = 0.25
const ease = "Power2.easeInOut"

// Switch to sign up button handler ...
$("#btn-switch-to-sign-up").on("click", () => {

	gsap.to(".login", { autoAlpha: 0, y: -10, duration: duration, ease: ease, onComplete: () => {
		gsap.set(".login", { y: 0 })
		gsap.set(".sign-up", { y: 10, onComplete: () => {
			gsap.to(".sign-up", { autoAlpha: 1, y: 0, duration: duration , ease: ease })
		}})
	}})
	
})

// Switch to login button handler ...
$("#btn-switch-to-login").on("click", () => {

	gsap.to(".sign-up", { autoAlpha: 0, y: -10, duration: duration, ease: ease, onComplete: () => {
		gsap.set(".sign-up", { y: 0 })
		gsap.set(".login", { y: 10, onComplete: () => {
			gsap.to(".login", { autoAlpha: 1, y: 0, duration: duration , ease: ease })
			//gsap.fromTo(".login-stagger", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, delay: 0, stagger: 0.05, ease: "back.inOut" })
		}})
	}})

})

// Create account with email button handler ...
$("#btn-sign-up").on("click", () => {

	const data = {
		fname: $("#fname").val(),
		lname: $("#lname").val(),
		email: $("#signup-email").val(),
		password: $("#signup-password").val()
	}

	$.ajax({
		type: "POST",
		url: "/auth/sign-up/",
		dataType: "json",
		data: data,
		encode: true,
		error: (data) => errorHandler(data),
		success: (data) => {
			if (data.success === true) window.location.href = "/profile/"
		}
	})

})