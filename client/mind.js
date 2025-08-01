const locationBtn = document.getElementById("location-btn");
const latRes = document.getElementById("latitude-res");
const longRes = document.getElementById("longitude-res");

locationBtn.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      latRes.textContent = `Latitude: ${latitude}`;
      longRes.textContent = `Longitude: ${longitude}`;
    });
  } else {
    latRes.textContent = "Geolocation not supported.";
  }
});

const form = document.getElementById("signup-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;
    if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
      
        if (!navigator.geolocation) {
          alert("Geolocation not supported.");
          return;
        }
          //  Get location first
         navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
           const location = `Lat: ${latitude.toFixed(3)}, Lng: ${longitude.toFixed(3)}`;
            
  
  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, location }),
    });

    const result = await res.json();
    console.log("Signup result from server:", result);

    if (res.ok) {
      //  SAVE USER TO LOCALSTORAGE
      localStorage.setItem("user", JSON.stringify(result.user));

      //LOG TO VERIFY
      console.log("Stored in localStorage:", JSON.parse(localStorage.getItem("user")));

      //  REDIRECT
      window.location.href = "homePage.html";
    } else {
      alert(result.message || "Signup failed.");
    }
  } catch (error) {
    console.error("Signup error:", error);
  }
});
});