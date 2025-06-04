// // Function to check if an element is in the viewport
// function isInViewport(element) {
//     const rect = element.getBoundingClientRect();
//     return (
//       rect.top >= 0 &&
//       rect.left >= 0 &&
//       rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//       rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//     );
//   }
  
//   // Function to handle scroll event
//   function handleScroll() {
//     const leftComments = document.querySelectorAll('.left-comment');
//     const rightComments = document.querySelectorAll('.right-comment');
  
//     leftComments.forEach(leftComment => {
//       if (isInViewport(leftComment)) {
//         leftComment.classList.add('slide-in');
//       }
//     });
  
//     rightComments.forEach(rightComment => {
//       if (isInViewport(rightComment)) {
//         rightComment.classList.add('slide-in');
//       }
//     });
//   }
  
//   // Add scroll event listener to window
//   window.addEventListener('scroll', handleScroll);
  
//   // Initial check on page load
//   document.addEventListener('DOMContentLoaded', () => {
//     handleScroll();
//   });
  