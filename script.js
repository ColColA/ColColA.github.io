const preview = document.getElementById('preview');

document.querySelectorAll('.button').forEach(btn => {

  // when the cursor enters a button
  btn.addEventListener('mouseenter', () => {
    // preview.src   = btn.dataset.img; // pick up the data-attribute
    preview.src   = btn.getAttribute("data-image"); // pick up the data-attribute
    preview.alt   = btn.textContent.trim() + ' preview';
    preview.style.opacity = 1;       // fade in
  });

  // when the cursor leaves
  btn.addEventListener('mouseleave', () => {
    preview.style.opacity = 0;       // fade out
  });
});