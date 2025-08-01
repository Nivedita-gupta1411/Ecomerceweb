// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "abc Gupta",
    email: "abc@email.com",
    location: "iiitkota, Jaipur",
    bio: "first-year student, love books!",
    trust: "4.8",
    reviews: 12,
    photo: "https://via.placeholder.com/80"
  };

  // Fill the profile data
  document.getElementById("name").textContent = user.name;
  document.getElementById("email").textContent = user.email;
  document.getElementById("location").textContent = user.location;
  document.getElementById("bio").textContent = user.bio;
  document.getElementById("trust").textContent = `⭐ ${user.trust} (${user.reviews} reviews)`;
  document.getElementById("profile-photo").src = user.photo;

  // Pre-fill the edit form fields
  document.getElementById("edit-bio").value = user.bio;
  document.getElementById("edit-location").value = user.location;

  // Handle image preview + save to localStorage
  const photoInput = document.getElementById("photo-input");
  photoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        document.getElementById("profile-photo").src = reader.result;
        user.photo = reader.result;

        // Save new photo to localStorage
        localStorage.setItem("user", JSON.stringify(user));
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle form submission
  document.getElementById("edit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    user.bio = document.getElementById("edit-bio").value;
    user.location = document.getElementById("edit-location").value;

    // Save to localStorage
    localStorage.setItem("userProfile", JSON.stringify(user));

    // Update profile on the screen
    document.getElementById("bio").textContent = user.bio;
    document.getElementById("location").textContent = user.location;

    alert("Profile updated!");
  });
});
