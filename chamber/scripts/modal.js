  const modalTriggers = document.querySelectorAll('.modal-trigger');
  const closeButtons = document.querySelectorAll('.close');
  
  modalTriggers.forEach(click => {
   click.addEventListener('click', (e) => {
      const modalId = click.getAttribute('href');
      document.querySelector(modalId).style.display = 'block';
    });
  });
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.modal').style.display = 'none';
    });
});
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }});