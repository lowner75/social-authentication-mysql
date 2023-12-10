/**
* js/main.js ...
* Social Authentication main script sheet ...
*/

"use strict";

// Document ready ...
$(() => {

  // Quick script to set side navigation active page ...
  if ($("aside a")) {
    $("aside a").each(function(i, obj) {
      if($(this).attr("href") === location.pathname) $(this).addClass("active")
    })		
  }

  // Set selected theme, else default to operating system ....
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

// Animate login and sign-up icons on input focus ...
$($(".email-input")).on("focus", () => {
  $(".fa-envelope").css("color", "var(--accent-color)")
})
$($(".email-input")).on("blur", () => {
  $(".fa-envelope").css("color", "var(--color-text)")
})
$($(".password-input")).on("focus", () => {
  $(".fa-lock").css("color", "var(--accent-color)")
  $(".eye").css("color", "var(--accent-color)")
})
$($(".password-input")).on("blur", () => {
  $(".fa-lock").css("color", "var(--color-text)")
  $(".eye").css("color", "var(--color-text)")
})
$($(".user-input")).on("focus", function() {
  const id = $(this).attr("id")
  $("." + id + "-user-icon").css("color", "var(--accent-color)")
})
$($(".user-input")).on("blur", function() {
  const id = $(this).attr("id")
  $("." + id + "-user-icon").css("color", "var(--color-text)")
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
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("data-theme", "os");
    addCheck("os");
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

// Modal handler ...
const triggers = document.getElementsByClassName('modal-trigger');
const triggerArray = Array.from(triggers).entries();
const modals = document.getElementsByClassName('modal');
const closeButtons = document.getElementsByClassName('btn-close-modal');
window.addEventListener("keydown", (e) => { if (e.key === "Escape") $(".modal").removeClass("show-modal") });

for (let [index, trigger] of triggerArray) {
  const toggleModal = () => {
    modals[index].classList.toggle("show-modal")
  }
  trigger.addEventListener("click", toggleModal)
  closeButtons[index].addEventListener("click", toggleModal)
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
    error: (data) => {
      $(".modal-panel-content").html("SocialAuth encountered the following error:<br/>" + data.responseJSON)
      document.querySelector(".modal").classList.toggle('show-modal')
      document.querySelector(".btn-close-modal").addEventListener("click", () => document.querySelector(".modal").classList.remove('show-modal'))
    },
    success: (data) => window.location.href = data.redirect
  })

})

// Password regular expression checker ...
// 8 to 16 characters, at least one lowercase letter, one 
// uppercase letter, one numeric digit, and one special character ....
const pwRegEx = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.@_*\s).{8,16}$/)

// Create account with email button handler ...
$("#btn-sign-up").on("click", () => {

  const fname = $("#fname").val()
  const lname = $("#lname").val()
  const email = $("#signup-email").val()
  const password = $("#signup-password").val()

  const data = {
    fname: fname,
    lname: lname,
    email: email,
    password: password
  }

  $.ajax({
    type: "POST",
    url: "/auth/sign-up/",
    dataType: "json",
    data: data,
    encode: true,
    error: (data) => console.log(data),
    success: (data) => {
      console.log(data)
      if (data.success === true) window.location.href = "/profile/"
    }
  })

})

// Change password handler ...
$("#btn-change-password").on("click", () => {

  const data = {
    oldPassword: $("#old-password").val(),
    newPassword: $("#new-password").val(),
    confirmNewPassword: $("#confirm-new-password").val()
  }

  // Check password meets regular expression check and
  // that new password and confirmed new password match ...
  if (data.newPassword === "" || pwRegEx.test(data.newPassword) === false || data.newPassword !== data.confirmNewPassword) return

  // Check that old password is not null ...
  if (data.oldPassword === undefined || data.oldPassword === null || data.oldPassword === "") return

  $.ajax({
    type: "POST",
    url: "/api/change-password/",
    dataType: "json",
    data: data,
    encode: true,
    success: (data) => {
      if (data.success === true) {
        $("#modal-alert .modal-panel-content").text("Password successfully updated.")
        document.querySelector("#modal-change-password").classList.toggle('show-modal')
        setTimeout(() => {
          $("#modal-change-password input[type=password]").each(function() { $(this).val("") })
          $(".password-check").removeClass("password-check-success")
          $(".password-match").removeClass("password-check-success")
          $(".password-check").addClass("password-check-failure")
          $(".password-match").addClass("password-check-failure")
        }, 500)
        document.querySelector("#modal-alert").classList.toggle('show-modal')
      }
    },
    error: (data) => {
      if (data.status === 401) {
        location.pathname = "/login/"
      }
    }
  })

})

// Password checker ...
$(".password-check").on("keyup", () => {
  
  const password = $(".password-check").val()

  if (pwRegEx.test(password)) {
    $(".password-check").removeClass("password-check-failure")
    $(".password-check").addClass("password-check-success")
  } else {
    $(".password-check").removeClass("password-check-success")
    $(".password-check").addClass("password-check-failure")
  }

})

// Password match checker ...
$(".password-match").on("keyup", () => {

  const passwordToMatch = $(".password-match").val()
  const password = $(".password-check").val()

  if (password !== "" && password === passwordToMatch) {
    $(".password-match").removeClass("password-check-failure")
    $(".password-match").addClass("password-check-success")
  } else {
    $(".password-match").removeClass("password-check-success")
    $(".password-match").addClass("password-check-failure")
  }

})

// Clear social media links ...
$("#btn-clear-social").on("click", () => {

  $.ajax({
    type: "POST",
    url: "/api/clear-social/",
    dataType: "json",
    encode: true,
    success: (data) => {
      if (data.success === true) {
        /*$("#modal-alert .modal-panel-content").text("Social media links successfully cleared.")
        document.querySelector("#modal-clear-social").classList.toggle('show-modal')
        document.querySelector("#modal-alert").classList.add('show-modal')*/
      }
    },
    error: (data) => {
      if (data.status === 401) {
        location.pathname = "/login/"
      }
    }
  })

})

// Update profile ...
$("#btn-update-profile").on("click", () => {
  
  const fname = $("#fname").val()
  const lname = $("#lname").val()
  const email = $("#email").val()
  
  // Email reqular expression checker ...
  const emailRegEx = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/g)
  
  // Form validation ...
  let err = "", errCount = 0;
  if (fname.length < 3) { err += "Your first name must contain at least 2 characters. "; errCount += 1 }
  if (lname.length < 3) { err += "Your last name must contain at least 2 characters. "; errCount += 1 }
  if (!emailRegEx.test(email)) { err += "The email address provided does not appear valid."; errCount += 1 }
  if (errCount !== 0) {
    $(".update-profile-error").html("The following error(s) occurred:<br/><br/>" + err)
    return
  } else {
    $(".update-profile-error").html("Please confirm that you wish to update your profile information.")
  }

  $("#modal-update-profile").addClass('show-modal')
  document.querySelector("#modal-update-profile .btn-close-modal").addEventListener("click", () => document.querySelector(".modal").classList.remove('show-modal'))
  
  $.ajax({
    type: "POST",
    url: "/api/update-profile/",
    dataType: "json",
    data: {
      fname: fname,
      lname: lname,
      email: email
    },
    encode: true,
    success: (data) => {
      if (data.success === true) {
        /*$("#modal-alert .modal-panel-content").text("Profile successfully updated.")
        document.querySelector("#modal-clear-social").classList.toggle('show-modal')
        document.querySelector("#modal-alert").classList.add('show-modal')*/
      }
    },
    error: (data) => {
      if (data.status === 401) {
        location.pathname = "/login/"
      }
    }
  })

})

// Upload profile photo ...
$("#btn-upload-profile-photo").on("click", () => {

  $("#profile-photo-file-selector").trigger("click")
  $(document.body).on("change", "#profile-photo-file-selector", (e) => {

    // Use uploaded image file ...
    const file = e.target.files[0]
    if (!file) return
    const img = new Image()
    img.src = URL.createObjectURL(file)
    
    // Initialise variables ...
    const canvas = document.getElementById("canvas")
    const context = canvas.getContext("2d")
    let cw = canvas.width
    let ch = canvas.height

    // Get image aspect ratio ...
    const getAspectRatio = (srcWidth, srcHeight, maxWidth, maxHeight) => {
      const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
      return { width: srcWidth * ratio, height: srcHeight * ratio }
    }
    const aspectRatio = getAspectRatio(img.width, img.height, 460, 460)
    
    // Enlarge the image to cover the canvas ...
    let percent, height, width
    if (aspectRatio.height < aspectRatio.width) {
      percent = aspectRatio.height / aspectRatio.width
      height = aspectRatio.height / percent
      width = aspectRatio.width / percent
    } else {
      percent = aspectRatio.width / aspectRatio.height
      height = aspectRatio.height / percent
      width = aspectRatio.width / percent
    }

    // Used to calculate canvas position relative to window ...
    const reOffset = () => {
      const BB = canvas.getBoundingClientRect()
      offsetX = BB.left
      offsetY = BB.top        
    }
    var offsetX, offsetY
    reOffset()

    window.onscroll = (e) => reOffset()
    window.onresize = (e) => reOffset()
    canvas.onresize = (e) => reOffset()

    // Save relevant information about shapes drawn on the canvas ...
    let shapes = []

    // Drag related vars ...
    let isDragging = false;
    let startX, startY

    // Hold the index of the shape being dragged (if any) ...
    let selectedShapeIndex;

    // Load the image ...
    const card = new Image()
    card.onload = () => {

      // Define one image and save it in the shapes[] array ...
      shapes.push({ x: 0, y: 0, width: 460, height: 460, image: card })

      // Draw the shapes on the canvas ...
      drawAll()

      // Listen for mouse events ...
      canvas.onmousedown = handleMouseDown
      canvas.onmousemove = handleMouseMove
      canvas.onmouseup = handleMouseUp
      canvas.onmouseout = handleMouseOut

    }

    card.src = URL.createObjectURL(file)

    // Given mouse X & Y (mx & my) and shape object
    // return true/false whether mouse is inside the shape ...
    const isMouseInShape = (mx,my,shape) => {

      // Is this shape an image? ...
      if (shape.image) {

        // This is a rectangle ...
        let rLeft = shape.x
        let rRight = shape.x + shape.width
        let rTop = shape.y
        let rBott = shape.y + shape.height

        // Math test to see if mouse is inside image ...
        if (mx > rLeft && mx < rRight && my > rTop && my < rBott) return(true)

      }
      // The mouse isn't in any of this shapes ...
      return(false);
    }

    const handleMouseDown = (e) => {

      // Tell the browser we're handling this event ...
      e.preventDefault()
      e.stopPropagation()

      // Calculate the current mouse position ...
      startX = parseInt(e.clientX-offsetX)
      startY = parseInt(e.clientY-offsetY)

      // Test mouse position against all shapes
      // post result if mouse is in a shape ...
      for (let i = 0; i < shapes.length; i++) {
        if (isMouseInShape(startX, startY, shapes[i])) {

          // The mouse is inside this shape
          // select this shape ...
          selectedShapeIndex = i

          // Set the isDragging flag ...
          isDragging = true
          
          // and return (==stop looking for 
          // further shapes under the mouse)
          return

        }
      }
    }

    const handleMouseUp = (e) => {

      // Return if not dragging ...
      if (!isDragging) return

      // Tell the browser we're handling this event ...
      e.preventDefault()
      e.stopPropagation()
      
      // The drag is over -- clear the isDragging flag ...
      isDragging = false

    }

    const handleMouseOut = (e) => {

      // Return if not dragging ...
      if (!isDragging) return

      // Tell the browser we're handling this event ...
      e.preventDefault()
      e.stopPropagation()

      // The drag is over -- clear the isDragging flag ...
      isDragging = false

    }

    const handleMouseMove = (e) => {
      
      // Return if not dragging ...
      if (!isDragging) return
      
      // Tell the browser we're handling this event ...
      e.preventDefault()
      e.stopPropagation()
      
      // Calculate the current mouse position ...
      let mouseX, mouseY
      mouseX = parseInt(e.clientX-offsetX)
      mouseY = parseInt(e.clientY-offsetY)

      // How far has the mouse dragged from its previous mousemove position ...
      let dx = mouseX-startX
      let dy = mouseY-startY

      // Move the selected shape by the drag distance ...
      let selectedShape = shapes[selectedShapeIndex]
      selectedShape.x += dx
      selectedShape.y += dy

      // Clear the canvas and redraw all shapes ...
      drawAll()

      // Update the starting drag position (== the current mouse position) ...
      startX = mouseX
      startY = mouseY
    }

    // Clear the canvas and redraw all
    // shapes in their current positions ...
    const drawAll = () => {
      context.clearRect(0, 0, cw, ch)
      for(let i = 0; i < shapes.length; i++) {
          let shape = shapes[i]
          if(shape.image){
              // it's an image ...
              context.drawImage(shape.image, shape.x, shape.y)
          }
      }
    }

    $("#modal-profile-photo").addClass("show-modal")

  })

})

