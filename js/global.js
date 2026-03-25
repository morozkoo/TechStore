document.addEventListener('DOMContentLoaded', function() {
  const burger = document.getElementById('burger');
  
  if (burger) {
    const button = burger.querySelector('.burger__button');
    const overlay = burger.querySelector('.burger__overlay');
    
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      burger.classList.toggle('burger--open');
    });
    
    if (overlay) {
      overlay.addEventListener('click', function() {
        burger.classList.remove('burger--open');
      });
    }
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && burger.classList.contains('burger--open')) {
        burger.classList.remove('burger--open');
      }
    });
  }
});